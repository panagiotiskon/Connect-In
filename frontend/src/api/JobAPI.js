import axios from "axios";

const API_URL = "https://localhost:8443/auth/jobs";

// Set default configuration for axios
axios.defaults.withCredentials = true;
const JobAPI = {
  getJobPosts: async (currentUserId) => {
    try {
      const response = await axios.get(`${API_URL}/posts`, {
        params: {
          currentUserId: currentUserId, // Use 'currentUserId' as the query parameter key
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true, // Send cookies with the request
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching job posts:", error);
      throw error;
    }
  },

  createJobPost: async (userId, jobTitle, companyName, jobDescription) => {
    try {
      const response = await axios.post(
        `${API_URL}/post`,
        null, // No request body needed
        {
          params: {
            userId, // Send as query parameters
            jobTitle,
            companyName,
            jobDescription,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating job post:", error);
      throw error;
    }
  },

  applyToJob: async (userId, jobPostId) => {
    try {
      const response = await axios.post(
        `${API_URL}/apply`,
        null, // No request body needed
        {
          params: {
            userId, // Send as query parameters
            jobPostId,
          },
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      console.error("Error applying to job:", error);
      throw error;
    }
  },
  getJobApplications: async (userId) => {
    try {
      const response = await axios.get(`${API_URL}/applications`, {
        params: {
          userId, // Send as query parameter
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching job applications:", error);
      throw error;
    }
  },
  deleteJob: async (userId, jobPostId) => {
    try {
      const response = await axios.delete(`${API_URL}/delete`, {
        params: {
          userId,
          jobPostId,
        },
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      return response.data;
    } catch (error) {
      console.error("Error deleting job post:", error);
      throw error;
    }
  },
};

export default JobAPI;
