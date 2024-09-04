import axios from "axios";
const API_URL = "https://localhost:8443/auth";

axios.defaults.withCredentials = true;

const getUserImages = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/files/user/${userId}/images`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data; // This will be a list of Base64 strings
  } catch (error) {
    console.error("Error fetching user images:", error);
    return [];
  }
};
const FileService = {
  getUserImages,
};

export default FileService;
