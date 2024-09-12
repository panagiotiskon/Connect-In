import axios from "axios";

// Set your API URL
const API_URL = "https://localhost:8443/auth";

// Set default configuration for axios
axios.defaults.withCredentials = true;

// Fetch user connections by user ID
const getUserConnections = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/connections/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // List<ConnectedUserDTO> object
  } catch (error) {
    console.error("Error fetching user connections:", error);
    throw error;
  }
};

// Create a connection between the current user and another user
const createUserConnection = async (userId, connectionUserId) => {
  try {
    const response = await axios.post(
      `${API_URL}/connections/${userId}`,
      null,
      {
        params: { connectionUserId },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // List<Connection> object
  } catch (error) {
    console.error("Error creating user connection:", error);
    throw error;
  }
};

// Export the ConnectionAPI functions
const ConnectionAPI = {
  getUserConnections,
  createUserConnection,
};

export default ConnectionAPI;
