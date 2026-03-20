import api from "./axiosInstance";

const BASE = "/auth/messages";

const MessagingAPI = {
  sendMessage: async (senderId, receiverId, content) => {
    try {
      const response = await api.post(`${BASE}/send`, null, {
        params: { senderId, receiverId, content },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  getConversation: async (userId1, userId2) => {
    try {
      const response = await api.get(`${BASE}/conversation`, {
        params: { userId1, userId2 },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw error;
    }
  },

  getConversations: async (currentUserId) => {
    try {
      const response = await api.get(`${BASE}/conversations`, {
        params: { currentUserId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },

  createConversation: async (userId1, userId2) => {
    try {
      const response = await api.post(`${BASE}/conversation`, null, {
        params: { userId1, userId2 },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },
};

export default MessagingAPI;
