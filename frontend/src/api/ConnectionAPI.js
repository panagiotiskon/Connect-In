import axios from "axios";

// Set your API URL
const API_URL = "https://localhost:8443/auth";

// Set default configuration for axios
axios.defaults.withCredentials = true;

// Fetch all registered users
const getRegisteredUsers = async (searchTerm = "", userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/connections/registered-users`,
      {
        params: {
          search: searchTerm,
          userId: userId, // Include userId in the request parameters
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // List<UserDTO> object
  } catch (error) {
    console.error("Error fetching registered users:", error);
    throw error;
  }
};

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

const requestToConnect = async (userId, connectionUserId) => {
  try {
    const response = await axios.post(
      `${API_URL}/connections/${userId}`,
      null, // No request body needed as we're using query parameters
      {
        params: {
          connectionUserId: connectionUserId,
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // Assuming the backend returns a list of connections
  } catch (error) {
    console.error("Error requesting connection:", error);
    throw error;
  }
};

// Export the ConnectionAPI functions
const ConnectionAPI = {
  getUserConnections,
  createUserConnection,
  getRegisteredUsers,
  requestToConnect,
};

export default ConnectionAPI;
