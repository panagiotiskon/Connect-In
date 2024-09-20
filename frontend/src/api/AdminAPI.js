import axios from "axios";

const API_URL = "https://localhost:8443/admin";

axios.defaults.withCredentials = true;

// Fetch all users without role filtering or pagination
const getUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // List<UserDTO> object
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw error;
  }
};

// Fetch user details by user IDs
const getUserDetails = async (userIds) => {
  try {
    const response = await axios.get(`${API_URL}/users/details`, {
      params: { userIds: userIds.join(",") },
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};

const AdminAPI = {
  getUsers,
  getUserDetails,
};

export default AdminAPI;
