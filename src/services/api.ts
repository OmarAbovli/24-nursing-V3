import axios from "axios";

// Create an API client instance with more robust configuration
const apiClient = axios.create({
  // Use a relative URL that will work both in development and production environments
  baseURL: "/api", 
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false,
  timeout: 15000,
});

// Add request interceptor to include auth token in requests
apiClient.interceptors.request.use((config) => {
  try {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  } catch (error) {
    console.error("Error in request interceptor:", error);
    return config;
  }
}, (error) => {
  return Promise.reject(error);
});

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    // Check if the response is for user activation
    if (response.config.url?.includes('/admin/users/') && 
        response.config.url?.includes('/activate') && 
        response.config.method === 'put') {
      // Show activation notification
      const userData = response.data.data;
      if (userData) {
        try {
          // In a real application this would trigger an email or push notification
          console.log(`Account activated for ${userData.email}`);
          
          // Show toast notification if the user is currently logged in
          const currentUserData = localStorage.getItem("user_data");
          if (currentUserData) {
            const currentUser = JSON.parse(currentUserData);
            if (currentUser.id === userData.id) {
              // Update local storage with active status
              currentUser.isActive = true;
              currentUser.activationDate = new Date().toISOString();
              localStorage.setItem("user_data", JSON.stringify(currentUser));
              
              // Show notification
              if (window.Notification && Notification.permission === "granted") {
                new Notification("Account Activated", {
                  body: "Your account has been activated by an administrator. You can now make service requests.",
                  icon: "/favicon.ico"
                });
              }
              
              // Add a simulated "email sent" message to console
              console.log(`Notification email sent to ${userData.email} about account activation`);
            }
          }
        } catch (err) {
          console.error("Error processing activation notification:", err);
        }
      }
    }
    return response;
  },
  async (error) => {
    try {
      // Handle common errors (401, 403, etc.)
      if (error.response?.status === 401) {
        // Clear token and redirect to login
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user_type");
        localStorage.removeItem("user_data");
      }
      
      // Log detailed error information for debugging
      console.error("API Error:", {
        status: error.response?.status,
        message: error.response?.data?.message || error.message,
        endpoint: error.config?.url,
        method: error.config?.method,
      });
    } catch (interceptorError) {
      console.error("Error in response interceptor:", interceptorError);
    }
    
    return Promise.reject(error);
  }
);

// Helper to get test credentials (for development)
export const getMockTestUser = () => {
  try {
    // Provide test credentials for development
    return {
      email: "test@example.com",
      password: "Test123!"
    };
  } catch (error) {
    console.error("Error getting test credentials:", error);
    return null;
  }
};

export default apiClient;
