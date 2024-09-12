import axios from "axios";
import AuthService from "../api/AuthenticationAPI";

const API_URL = "https://localhost:8443/auth";

const getFeed = async (userId) => {
  try {
    const user = await AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/${user?.id}/feed`, {
        headers: {
          "Content-Type": "application/json",
        },});
    return response.data; 
  } catch (error) {
    console.error("Error fetching user feed:", error);
    throw error;
  }
};

const PostService = {
  getFeed,
};

export default PostService;
