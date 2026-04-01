import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

// 401 interceptor: let AuthContext and ProtectedRoute handle the redirect
// instead of doing a hard window.location redirect which causes a full page reload
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/login") &&
      !error.config.url?.includes("/auth/current-user") &&
      !error.config.url?.includes("/auth/register")
    ) {
      console.warn("Session expired or unauthorized. Redirecting to login.");
    }
    return Promise.reject(error);
  }
);

export default api;
