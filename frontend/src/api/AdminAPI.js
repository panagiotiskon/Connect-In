import api from "./axiosInstance";

const BASE = "/admin";

const getUsers = async ({ search = "", page = 0, size = 20 } = {}) => {
  try {
    const response = await api.get(`${BASE}/users`, {
      params: { search, page, size },
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching users data:", error);
    throw error;
  }
};

const getUserDetails = async (userIds) => {
  try {
    const response = await api.get(`${BASE}/users/details`, {
      params: { userIds: userIds.join(",") },
      headers: { "Content-Type": "application/json" },
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
