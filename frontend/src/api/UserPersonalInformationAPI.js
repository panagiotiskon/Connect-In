import axios from "axios";

// Set your API URL
const API_URL = "https://localhost:8443/auth";

axios.defaults.withCredentials = true;

// Fetch user's education details (GET request)
const getEducation = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${userId}/personal-info/education`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // List of EducationDTO objects
  } catch (error) {
    console.error("Error fetching education data:", error);
    return [];
  }
};

// Add new education details (POST request)
const addEducation = async (userId, educationDTO) => {
  try {
    console.log("Starting addEducation process...");
    console.log(`User ID: ${userId}`);
    console.log("Education DTO being sent:", educationDTO);

    const response = await axios.post(
      `${API_URL}/${userId}/personal-info/education`,
      educationDTO,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    // Log the response details
    console.log("Received response from backend:", response);

    // Assuming the backend responds with updated user data
    return response;
  } catch (error) {
    // Log detailed error message for debugging
    console.error("Error occurred while adding education data:", error.message);

    if (error.response) {
      // If the request was made and the server responded with a status code
      console.error(
        "Backend responded with status code:",
        error.response.status
      );
      console.error("Backend response data:", error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error(
        "No response from the server. Request details:",
        error.request
      );
    } else {
      // Something else happened while setting up the request
      console.error("Error setting up the request:", error.message);
    }

    // Re-throw the error to handle it in the calling function
    throw error;
  }
};

const EducationService = {
  getEducation,
  addEducation,
};

export default EducationService;
