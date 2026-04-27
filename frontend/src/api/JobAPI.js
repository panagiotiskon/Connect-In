import api from "./axiosInstance";

const BASE = "/auth/jobs";

const JobAPI = {
  getJobPosts: async (currentUserId) => {
    try {
      const response = await api.get(`${BASE}/posts`, {
        params: { currentUserId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching job posts:", error);
      throw error;
    }
  },

  createJobPost: async (userId, jobTitle, companyName, jobDescription) => {
    try {
      const response = await api.post(`${BASE}/post`, null, {
        params: { userId, jobTitle, companyName, jobDescription },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error creating job post:", error);
      throw error;
    }
  },

  applyToJob: async (userId, jobPostId) => {
    try {
      const response = await api.post(`${BASE}/apply`, null, {
        params: { userId, jobPostId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error applying to job:", error);
      throw error;
    }
  },

  getJobApplications: async (userId) => {
    try {
      const response = await api.get(`${BASE}/applications`, {
        params: { userId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching job applications:", error);
      throw error;
    }
  },

  unapplyFromJob: async (userId, jobPostId) => {
    try {
      const response = await api.delete(`${BASE}/unapply`, {
        params: { userId, jobPostId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error unapplying from job:", error);
      throw error;
    }
  },

  deleteJob: async (userId, jobPostId) => {
    try {
      const response = await api.delete(`${BASE}/delete`, {
        params: { userId, jobPostId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting job post:", error);
      throw error;
    }
  },

  viewJobPost: async (userId, jobId) => {
    try {
      const response = await api.post(`${BASE}/view-job`, null, {
        params: { userId, jobId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error recording job post view:", error);
      throw error;
    }
  },

  getRecommendedJobs: async (userId) => {
    try {
      const response = await api.get(`${BASE}/recommend-jobs`, {
        params: { userId },
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching recommended jobs:", error);
      throw error;
    }
  },
};

export default JobAPI;
