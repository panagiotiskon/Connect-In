import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  withCredentials: true,
});

// 401 interceptor: redirect to login when session expires
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !error.config.url?.includes("/auth/login") &&
      !error.config.url?.includes("/auth/current-user")
    ) {
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default api;
