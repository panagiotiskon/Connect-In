import axios from "axios";
import test from "../assets/test-photo-profile.png";

const API_URL = "http://localhost:8080/auth";
const UPLOAD_URL = "http://localhost:8080/auth/upload"; // Add your upload URL here

axios.defaults.withCredentials = true;

// Upload Photo Function
const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await axios.post(UPLOAD_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("Upload Response:", response.data);
    return response.data; // Assuming it contains the photo URL or success message
  } catch (error) {
    console.error("Upload Error:", error.message);
    throw error;
  }
};

// Login Function
const login = (email, password) => {
  return axios
    .post(API_URL + "/login", { email, password })
    .then((response) => {
      // Log the full response object
      console.log("Login Response:", response);

      // Log specific parts of the response data
      console.log("Response Data:", response.data);

      // Check and log access token if available
      if (response.data.accessToken) {
        console.log("Access Token:", response.data.accessToken);
        // Save user data to localStorage
        localStorage.setItem("user", JSON.stringify(response.data));
      }

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

// Logout Function
const logout = () => {
  localStorage.removeItem("user");
};

// Register Function
const register = async (
  email,
  name,
  surname,
  password,
  phoneNumber,
  photoFile
) => {
  try {
    // Step 1: Upload photo
    const uploadResponse = await uploadPhoto(photoFile);
    console.log("Photo uploaded successfully!");

    // Step 2: Prepare registration data (excluding photo)
    const data = {
      email,
      password,
      firstName: name,
      lastName: surname,
      phoneNumber,
      // Add photo URL to registration data if needed
      // photoUrl: uploadResponse.photoUrl,  // Assuming backend returns URL of the uploaded photo
    };

    // Step 3: Register the user
    const registerResponse = await axios.post(API_URL + "/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    console.log("Register Response:", registerResponse);

    if (registerResponse.data.accessToken) {
      localStorage.setItem("user", JSON.stringify(registerResponse.data));
    }

    return registerResponse.data;
  } catch (error) {
    console.error("Registration Error:", error.message, error.config);
    throw error;
  }
};

// Get Current User Function
const getCurrentUser = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("Current User:", user); // Log the current user
  return user;
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
  uploadPhoto, // Optional: You can keep this method public in case you need it elsewhere
};

export default AuthService;

// const mockUser = {
//   email: "john.doe@example.com",
//   name: "Stelios",
//   surname: "Dimitriadis",
//   photo: test, // Replace with an actual image URL
//   accessToken: "mock-access-token",
//   phoneNumber: "123-456-7890",
// };

// // Set the mock user in localStorage for testing purposes
// localStorage.setItem("user", JSON.stringify(mockUser));

// const login = (email, password) => {
//   return new Promise((resolve) => {
//     resolve({
//       data: mockUser,
//     });
//   });
// };

// const logout = () => {
//   localStorage.removeItem("user");
// };

// const register = (email, name, surname, password, phoneNumber, photo) => {
//   return new Promise((resolve) => {
//     const newUser = {
//       email,
//       name,
//       surname,
//       photo,
//       phoneNumber,
//       accessToken: "new-mock-access-token",
//     };
//     localStorage.setItem("user", JSON.stringify(newUser));
//     resolve({ data: newUser });
//   });
// };

// const getCurrentUser = () => {
//   return JSON.parse(localStorage.getItem("user"));
// };

// const AuthService = {
//   register,
//   login,
//   logout,
//   getCurrentUser,
// };

// export default AuthService;
