import api from "./axiosInstance";
import AuthService from "../api/AuthenticationAPI";

const BASE = "/auth";

const getFeed = async (userId) => {
  try {
    const user = await AuthService.getCurrentUser();
    const response = await api.get(`${BASE}/${user?.id}/feed`, {
      headers: { "Content-Type": "application/json" },
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
  return api.post(`${BASE}/${userId}/create-post`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

const getUserPosts = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.get(`${BASE}/${userId}/posts`);
};

const getUserReactions = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.get(`${BASE}/${userId}/reactions`);
};

const getUserComments = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.get(`${BASE}/${userId}/comments`);
};

const deletePost = async (postId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.delete(`${BASE}/${userId}/${postId}`);
};

const createComment = async (postId, content) => {
  const commentRequest = { content };
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.post(`${BASE}/${userId}/${postId}/create-comment`, commentRequest);
};

const deleteComment = async (postId, commentId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.delete(`${BASE}/${userId}/${postId}/${commentId}`);
};

const createReaction = async (postId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.post(`${BASE}/${userId}/${postId}/create-reaction`);
};

const deleteReaction = async (postId) => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  return api.delete(`${BASE}/${userId}/${postId}/reaction`);
};

const getRecommendedPosts = async () => {
  const currentUser = await AuthService.getCurrentUser();
  const userId = currentUser.id;
  try {
    const response = await api.get(`${BASE}/${userId}/recommended-posts`);
    return response.data;
  } catch (error) {
    console.error("Error fetching recommended posts:", error);
    throw error;
  }
};

const viewPosts = async (userId, postId) => {
  try {
    const response = await api.post(`${BASE}/view-post`, null, {
      params: { userId, postId },
      headers: { "Content-Type": "application/json" },
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
