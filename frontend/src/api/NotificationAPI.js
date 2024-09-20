import axios from "axios";

const API_URL = "https://localhost:8443/auth";

axios.defaults.withCredentials = true;

const NotificationAPI = {
  createNotification: async (userId, type, connectionUserId, objectId) => {
    try {
      console.log(userId, type, connectionUserId, objectId);
      const response = await axios.post(
        `${API_URL}/notifications/create`,
        {
            userId: userId,
            type: type,
            connectionUserId: connectionUserId,
            objectId: objectId
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  getNotifications: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/notifications/${userId}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  acceptNotification: async (userId, notificationId) => {
    try {
      await axios.put(
        `${API_URL}/notifications/${userId}/accept/${notificationId}`,
        null,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error accepting notification:", error);
      throw error;
    }
  },

  declineNotification: async (userId, notificationId) => {
    try {
      await axios.delete(
        `${API_URL}/notifications/${userId}/decline/${notificationId}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
    } catch (error) {
      console.error("Error declining notification:", error);
      throw error;
    }
  },

  deleteNotification: async (userId, connectionUserId) => {
    try {
      await axios.delete(`${API_URL}/notifications/delete`, {
        params: {
          userId: userId,
          connectedUserId: connectionUserId
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  deleteNotificationById: async (notificationId) => {
    try {
      await axios.delete(`${API_URL}/notifications/delete`, {
        params: {
          notificationId: notificationId
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  deleteNotificationByObjectId: async (objectId) => {
    try {
      await axios.delete(`${API_URL}/notifications/delete`, {
        params: {
          objectId: objectId
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },


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
