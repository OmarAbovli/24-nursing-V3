
import apiClient from "./api";

interface ProfileCompletion {
  name?: string;
  phone?: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  emergencyContact?: string;
  bloodType?: string;
  medicalConditions?: string[];
  allergies?: string[];
  profileImage?: string;
}

export const userProfileService = {
  getProfile: async () => {
    try {
      console.log("Fetching user profile");
      const response = await apiClient.get("/user/profile");
      
      // Update stored user data
      if (response.data) {
        localStorage.setItem("user_data", JSON.stringify(response.data));
      }
      
      return response.data;
    } catch (error) {
      console.error("Failed to get profile:", error);
      throw error;
    }
  },
  
  completeProfile: async (profileData: ProfileCompletion) => {
    try {
      console.log("Completing profile with data:", profileData);
      const response = await apiClient.put("/user/complete-profile", profileData);
      
      // Update stored user data
      if (response.data) {
        const currentUserData = JSON.parse(localStorage.getItem("user_data") || "{}");
        localStorage.setItem("user_data", JSON.stringify({
          ...currentUserData,
          ...response.data,
          profileComplete: true
        }));
      }
      
      return response.data;
    } catch (error) {
      console.error("Failed to complete profile:", error);
      throw error;
    }
  },
  
  uploadProfileImage: async (imageFile: File) => {
    try {
      console.log("Uploading profile image");
      const formData = new FormData();
      formData.append("profileImage", imageFile);
      
      const response = await apiClient.post("/user/upload-profile-image", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      return response.data;
    } catch (error) {
      console.error("Failed to upload profile image:", error);
      throw error;
    }
  }
};
