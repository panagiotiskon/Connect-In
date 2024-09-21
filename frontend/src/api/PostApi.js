import axios from "axios";
import AuthService from "../api/AuthenticationAPI";

const API_URL = "https://localhost:8443/auth";

const getFeed = async (userId) => {
  try {
    const user = await AuthService.getCurrentUser();
    const response = await axios.get(`${API_URL}/${user?.id}/feed`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user feed:", error);
    throw error;
  }
};

const createPost = async (content, photo) => {
  const formData = new FormData();

  formData.append("content", content);

  if (photo) {
    formData.append("file", photo);
  }

  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;

  return axios.post(`${API_URL}/${userId}/create-post`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const getUserPosts = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return axios.get(`${API_URL}/${userId}/posts`);
};

const getUserReactions = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return axios.get(`${API_URL}/${userId}/reactions`);
};

const getUserComments = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return axios.get(`${API_URL}/${userId}/comments`);
};

const deletePost = async (postId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;

  return axios.delete(`${API_URL}/${userId}/${postId}`);
};

const createComment = async (postId, content) => {
  const commentRequest = {
    content,
  };

  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;

  return axios.post(
    `${API_URL}/${userId}/${postId}/create-comment`,
    commentRequest
  );
};

const deleteComment = async (postId, commentId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;

  return axios.delete(`${API_URL}/${userId}/${postId}/${commentId}`);
};

const createReaction = async (postId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;

  return axios.post(`${API_URL}/${userId}/${postId}/create-reaction`);
};

const deleteReaction = async (postId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;

  return axios.delete(`${API_URL}/${userId}/${postId}/reaction`);
};

const getRecommendedPosts = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  try {
    const response = await axios.get(`${API_URL}/${userId}/recommended-posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    throw error;
  }
};

const viewPosts = async (userId, postId) => {
  try {
    const response = await axios.post(`${API_URL}/view-post`, null, {
      params: {
        userId,
        postId,
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error recording job post view:", error);
    throw error;
  }
};

const PostService = {
  getFeed,
  createPost,
  deletePost,
  getUserPosts,
  createComment,
  deleteComment,
  getUserComments,
  createReaction,
  deleteReaction,
  getUserReactions,
  getRecommendedPosts,
  viewPosts,
};

export default PostService;
