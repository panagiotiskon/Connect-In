import axios from "axios";

const API_URL = "https://localhost:8443/auth";
const UPLOAD_URL = "https://localhost:8443/auth/upload"; // Add your upload URL here

axios.defaults.withCredentials = true;

// Upload Photo Function
const uploadPhoto = async (file) => {
  const formData = new FormData();
  if (file) {
    formData.append("file", file);
  }

  try {
    const response = await axios.post(UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Upload Error:", error.message);
    throw error;
  }
};

const changeEmail = async (oldEmail, newEmail) => {
  try {
    const currentUser = await getCurrentUser();

    const userChangeEmailRequest = {
      oldEmail,
      newEmail,
    };

    const userId = currentUser.id;

    const response = await axios.post(
      `${API_URL}/${userId}/change-email`,
      userChangeEmailRequest
    );

    console.log("Change Email Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Change Email Error:", error.message);
    throw error;
  }
};

const changePassword = async (oldPassword, newPassword) => {
  try {
    const currentUser = await getCurrentUser();

    const UserChangePasswordRequest = {
      oldPassword,
      newPassword,
    };
    const userId = currentUser.id;
    console.log(oldPassword, newPassword);
    const response = await axios.post(
      `${API_URL}/${userId}/change-password`,
      UserChangePasswordRequest
    );

    console.log("Change Password Response:", response.data);

    return response.data;
  } catch (error) {
    console.error("Change Password Error:", error.message);
    throw error;
  }
};

// Login Function
const login = (email, password) => {
  return axios
    .post(API_URL + "/login", { email, password })
    .then((response) => {
      console.log("Login Response:", response);
      console.log("Response Data:", response.data);

      return response.data;
    })
    .catch((error) => {
      // Enhanced error logging
      console.error("Login Error:", error.message); // Log the error message

      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error Response Data:", error.response.data); // Log response data
        console.error("Error Response Status:", error.response.status); // Log response status
        console.error("Error Response Headers:", error.response.headers); // Log response headers
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error Request:", error.request); // Log request data
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", error.message); // Log error message
      }

      // Log the config used for the request
      console.error("Error Config:", error.config); // Log error config

      throw error; // Re-throw error after logging
    });
};

const logout = () => {
  return axios
    .post(API_URL + "/logout")
    .then(() => {
      console.log("User logged out");
    })
    .catch((error) => {
      console.error("Logout Error:", error.message);
    });
};

// Register Function
const register = (email, name, surname, password, phoneNumber, photo) => {
  // Prepare form data to send to the server
  const formData = new FormData();
  formData.append("email", email);
  formData.append("firstName", name);
  formData.append("lastName", surname);
  formData.append("password", password);
  formData.append("phoneNumber", phoneNumber);

  if (photo) {
    formData.append("profilePicture", photo);
  }

  return axios
    .post(API_URL + "/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    })
    .then((response) => {
      // Log the full response object
      console.log("Register Response:", response);

      return response.data;
    })
    .catch((error) => {
      // Enhanced error logging
      console.error("Registration Error:", error.message, error.config);

      if (error.response) {
        // The request was made and the server responded with a status code
        console.error("Error Response Data:", error.response.data); // Log response data
        console.error("Error Response Status:", error.response.status); // Log response status
        console.error("Error Response Headers:", error.response.headers); // Log response headers
      } else if (error.request) {
        // The request was made but no response was received
        console.error("Error Request:", error.request); // Log request data
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error("Error Message:", error.message); // Log error message
      }

      console.error("Error Config:", error.config);

      throw error;
    });
};

const getCurrentUser = async () => {
  try {
    const response = await axios.get(`${API_URL}/current-user`, {
      withCredentials: true,
    });
    console.log(response);
    return response.data;
  } catch (error) {
    return null;
  }
};

const AuthService = {
  register,
  uploadPhoto,
  login,
  logout,
  getCurrentUser,
  changeEmail,
  changePassword,
};

export default AuthService;
