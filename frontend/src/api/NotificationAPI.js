import api from "./axiosInstance";

const BASE = "/auth";

const NotificationAPI = {
  createNotification: async (userId, type, connectionUserId, objectId) => {
    try {
      console.log(userId, type, connectionUserId, objectId);
      const response = await api.post(
        `${BASE}/notifications/create`,
        { userId, type, connectionUserId, objectId },
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating notification:", error);
      throw error;
    }
  },

  getNotifications: async (userId) => {
    try {
      const response = await api.get(`${BASE}/notifications/${userId}`, {
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching notifications:", error);
      throw error;
    }
  },

  acceptNotification: async (userId, notificationId) => {
    try {
      await api.put(
        `${BASE}/notifications/${userId}/accept/${notificationId}`,
        null,
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error accepting notification:", error);
      throw error;
    }
  },

  declineNotification: async (userId, notificationId) => {
    try {
      await api.delete(
        `${BASE}/notifications/${userId}/decline/${notificationId}`,
        { headers: { "Content-Type": "application/json" } }
      );
    } catch (error) {
      console.error("Error declining notification:", error);
      throw error;
    }
  },

  deleteNotification: async (userId, connectionUserId) => {
    try {
      await api.delete(`${BASE}/notifications/delete`, {
        params: { userId, connectedUserId: connectionUserId },
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  deleteNotificationById: async (notificationId) => {
    try {
      await api.delete(`${BASE}/notifications/delete`, {
        params: { notificationId },
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  deleteNotificationByObjectId: async (objectId) => {
    try {
      await api.delete(`${BASE}/notifications/delete`, {
        params: { objectId },
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error deleting notification:", error);
      throw error;
    }
  },

  getNumberOfNotifications: async (userId) => {
    try {
      const response = await api.get(
        `${BASE}/notifications/${userId}/count`,
        { headers: { "Content-Type": "application/json" } }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching number of notifications:", error);
      throw error;
    }
  },
};

export default NotificationAPI;
