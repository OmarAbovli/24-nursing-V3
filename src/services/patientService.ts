
import apiClient from "./api";

interface ServiceRequest {
  patientName: string;
  patientAge: string;
  address: string;
  serviceType: string;
  details: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

interface PaymentInfo {
  requestId: string;
  method: string;
  transactionNumber?: string;
  amount?: string;
}

export const patientService = {
  requestService: async (serviceData: ServiceRequest) => {
    // Get current location if available
    try {
      if (navigator.geolocation) {
        await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              serviceData.coordinates = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
              };
              resolve(position);
            },
            () => {
              console.warn("Could not get user location");
              resolve(null);
            }
          );
        });
      }
    } catch (e) {
      console.error("Error getting location:", e);
    }
    
    // Add broadcast flag to send to all available nurses
    const response = await apiClient.post("/patient/request-service", {
      ...serviceData,
      broadcastToAllNurses: true
    });
    
    return response.data;
  },

  getCurrentRequest: async () => {
    const response = await apiClient.get("/patient/current-request");
    return response.data;
  },
  
  getRequestHistory: async () => {
    const response = await apiClient.get("/patient/request-history");
    return response.data;
  },
  
  submitPayment: async (paymentData: PaymentInfo) => {
    const response = await apiClient.post("/patient/payment", paymentData);
    return response.data;
  },

  submitRating: async (requestId: string, rating: number, comment: string) => {
    const response = await apiClient.post("/patient/rating", { 
      requestId, 
      rating,
      comment 
    });
    return response.data;
  }
};
