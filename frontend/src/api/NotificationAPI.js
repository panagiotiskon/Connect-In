import axios from "axios";

// Set your API URL
const API_URL = "https://localhost:8443/auth";

// Set default configuration for axios
axios.defaults.withCredentials = true;

// Create the Notification API object
const NotificationAPI = {
  // Method to create a notification
  createNotification: async (userId, type, connectionUserId) => {
    try {
      const response = await axios.post(
        `${API_URL}/notifications/${userId}/${type}/${connectionUserId}`,
        null, // No request body in this case
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies with the request
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  // Method to get notifications for a specific user
  getNotifications: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/notifications/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Send cookies with the request
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  // Method to accept a notification
  acceptNotification: async (userId, notificationId) => {
    try {
      await axios.put(
        `${API_URL}/notifications/${userId}/accept/${notificationId}`,
        null, // No request body in this case
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies with the request
        }
      );
    } catch (error) {
      console.error("Error accepting notification:", error);
      throw error;
    }
  },

  // Method to decline a notification
  declineNotification: async (userId, notificationId) => {
    try {
      await axios.delete(
        `${API_URL}/notifications/${userId}/decline/${notificationId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies with the request
        }
      );
    } catch (error) {
      console.error("Error declining notification:", error);
      throw error;
    }
  },

  // Method to get the number of notifications for a specific user
  getNumberOfNotifications: async (userId) => {
    try {
      const response = await axios.get(
        `${API_URL}/notifications/${userId}/count`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies with the request
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching number of notifications:", error);
      throw error;
    }
  },
};

export default NotificationAPI;
