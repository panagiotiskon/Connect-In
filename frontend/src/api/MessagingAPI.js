import axios from "axios";

const API_URL = "https://localhost:8443/auth/messages";

axios.defaults.withCredentials = true;

const MessagingAPI = {

  sendMessage: async (senderId, receiverId, content) => {
    try {
      const response = await axios.post(
        `${API_URL}/send`,
        null,
        {
          params: {
            senderId,
            receiverId,
            content,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  },

  // Method to get conversation between two users
  getConversation: async (userId1, userId2) => {
    try {
      const response = await axios.get(`${API_URL}/conversation`, {
        params: {
          userId1,
          userId2,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw error;
    }
  },

  // Method to get all conversations for a specific user
  getConversations: async (currentUserId) => {
    try {
      const response = await axios.get(`${API_URL}/conversations`, {
        params: {
          currentUserId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw error;
    }
  },
  createConversation: async (userId1, userId2) => {
    try {
      const response = await axios.post(
        `${API_URL}/conversation`,
        null,
        {
          params: {
            userId1,
            userId2,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating conversation:", error);
      throw error;
    }
  },
};

export default MessagingAPI;
