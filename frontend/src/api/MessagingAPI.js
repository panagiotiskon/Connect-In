import axios from "axios";

// Set your API URL
const API_URL = "https://localhost:8443/auth/messages";

// Set default configuration for axios
axios.defaults.withCredentials = true;

// Create the Messaging API object
const MessagingAPI = {
  // Method to send a message
  sendMessage: async (senderId, receiverId, content) => {
    try {
      const response = await axios.post(
        `${API_URL}/send`,
        null, // No request body in this case
        {
          params: {
            senderId,
            receiverId,
            content,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies with the request
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
        withCredentials: true, // Send cookies with the request
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
        withCredentials: true, // Send cookies with the request
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
        null, // No request body in this case
        {
          params: {
            userId1,
            userId2,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true, // Send cookies with the request
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
