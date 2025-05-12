
import apiClient from "./api";

interface NurseProfile {
  nationalId?: string;
  licenseId?: string;
  faceVerificationComplete?: boolean;
  experience?: string;
  specializations?: string[];
  availabilityStatus?: boolean;
  location?: {
    latitude: number;
    longitude: number;
  };
}

export const nurseService = {
  updateProfile: async (profileData: NurseProfile) => {
    // Get current location if available and not provided
    if (!profileData.location && navigator.geolocation) {
      try {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              profileData.location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve(position);
            },
            () => {
              console.warn("Could not get nurse location");
              resolve(null);
            }
          );
        });
      } catch (e) {
        console.error("Error getting location:", e);
      }
    }
    
    const response = await apiClient.post("/nurse/profile", profileData);
    
    // Update stored user data
    if (response.data) {
      const currentUserData = JSON.parse(localStorage.getItem("user_data") || "{}");
      localStorage.setItem("user_data", JSON.stringify({
        ...currentUserData,
        ...response.data
      }));
    }
    
    return response.data;
  },

  toggleAvailability: async (available: boolean) => {
    // Get current location when toggling availability
    let location;
    if (navigator.geolocation) {
      try {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve(position);
            },
            () => {
              console.warn("Could not get nurse location");
              resolve(null);
            }
          );
        });
      } catch (e) {
        console.error("Error getting location:", e);
      }
    }
    
    const response = await apiClient.post("/nurse/availability", { 
      available,
      location
    });
    return response.data;
  },

  getRequests: async () => {
    const response = await apiClient.get("/nurse/requests");
    return response.data;
  },
  
  getRequestHistory: async () => {
    const response = await apiClient.get("/nurse/request-history");
    return response.data;
  },

  acceptRequest: async (requestId: string) => {
    // Get current location when accepting request
    let location;
    if (navigator.geolocation) {
      try {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              location = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve(position);
            },
            () => {
              console.warn("Could not get nurse location");
              resolve(null);
            }
          );
        });
      } catch (e) {
        console.error("Error getting location:", e);
      }
    }
    
    const response = await apiClient.post(`/nurse/requests/${requestId}/accept`, { location });
    return response.data;
  },
  
  completeService: async (requestId: string, additionalServices?: string) => {
    const response = await apiClient.post(`/nurse/requests/${requestId}/complete`, {
      additionalServices
    });
    return response.data;
  }
};
