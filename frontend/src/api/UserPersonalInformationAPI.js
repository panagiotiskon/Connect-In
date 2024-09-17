import axios from "axios";

// Set your API URL
const API_URL = "https://localhost:8443/auth";

axios.defaults.withCredentials = true;

// Fetch user's details (GET request)
const getUser = async (userId) => {
  try {
    const response = await axios.get(`${API_URL}/${userId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // UserDTO object
  } catch (error) {
    console.error("Error fetching user data:", error);
    throw error;
  }
};

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

    console.log("Received response from backend:", response);
    return response;
  } catch (error) {
    console.error("Error occurred while adding education data:", error.message);

    if (error.response) {
      console.error(
        "Backend responded with status code:",
        error.response.status
      );
      console.error("Backend response data:", error.response.data);
    } else if (error.request) {
      console.error(
        "No response from the server. Request details:",
        error.request
      );
    } else {
      console.error("Error setting up the request:", error.message);
    }

    throw error;
  }
};

// Fetch user's experience details (GET request)
const getExperience = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${userId}/personal-info/experience`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // List of ExperienceDTO objects
  } catch (error) {
    console.error("Error fetching experience data:", error);
    return [];
  }
};

const addExperience = async (userId, experienceDTO) => {
  try {
    console.log("Starting addExperience process...");
    console.log(`User ID: ${userId}`);
    console.log("Experience DTO being sent:", experienceDTO);

    const response = await axios.post(
      `${API_URL}/${userId}/personal-info/experience`,
      experienceDTO,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Received response from backend:", response);
    return response;
  } catch (error) {
    console.error(
      "Error occurred while adding experience data:",
      error.message
    );

    if (error.response) {
      console.error(
        "Backend responded with status code:",
        error.response.status
      );
      console.error("Backend response data:", error.response.data);
    } else if (error.request) {
      console.error(
        "No response from the server. Request details:",
        error.request
      );
    } else {
      console.error("Error setting up the request:", error.message);
    }

    throw error;
  }
};

const getSkills = async (userId) => {
  try {
    const response = await axios.get(
      `${API_URL}/${userId}/personal-info/skills`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data; // List of SkillDTO objects
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return [];
  }
};

const addSkill = async (userId, skillDTO) => {
  try {
    console.log("Starting addSkill process...");
    console.log(`User ID: ${userId}`);
    console.log("Skill DTO being sent:", skillDTO);

    const response = await axios.post(
      `${API_URL}/${userId}/personal-info/skills`,
      skillDTO,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Received response from backend:", response);
    return response;
  } catch (error) {
    console.error("Error occurred while adding skill data:", error.message);

    if (error.response) {
      console.error(
        "Backend responded with status code:",
        error.response.status
      );
      console.error("Backend response data:", error.response.data);
    } else if (error.request) {
      console.error(
        "No response from the server. Request details:",
        error.request
      );
    } else {
      console.error("Error setting up the request:", error.message);
    }

    throw error;
  }
};

const deleteSkill = async (userId, skillId) => {
  try {
    await axios.delete(`${API_URL}/${userId}/personal-info/skills/${skillId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Error deleting skill:", error.message);
    throw error;
  }
};

const deleteEducation = async (userId, educationId) => {
  try {
    await axios.delete(
      `${API_URL}/${userId}/personal-info/educations/${educationId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting education:", error.message);
    throw error;
  }
};

const deleteExperience = async (userId, experienceId) => {
  try {
    await axios.delete(
      `${API_URL}/${userId}/personal-info/experiences/${experienceId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("Error deleting experience:", error.message);
    throw error;
  }
};

const PersonalInfoService = {
  getUser,
  getEducation,
  addEducation,
  getExperience,
  addExperience,
  getSkills,
  addSkill,
  deleteSkill,
  deleteExperience,
  deleteEducation,
};

export default PersonalInfoService;
