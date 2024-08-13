import axios from "axios";
import test from "../assets/test-photo-profile.png";

const API_URL = "http://localhost:8080/api/auth";
axios.defaults.withCredentials = true;

// Login Function
const login = (email, password) => {
  return axios
    .post(API_URL + "/login", { email, password })
    .then((response) => {
      console.log("Login Response:", response); // Log the full response object
      if (response.data.accessToken) {
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
      console.error("Error Config:", error.config); // Log error config
      throw error; // Re-throw error after logging
    });
};

// Logout Function
const logout = () => {
  localStorage.removeItem("user");
  return axios
    .post(API_URL + "/signout")
    .then((response) => {
      console.log("Logout Response:", response); // Log the full response object
      return response.data;
    })
    .catch((error) => {
      console.error("Logout Error:", error.message, error.config); // Log error message and config
      throw error; // Re-throw error after logging
    });
};

// Register Function
const register = (email, name, surname, password, phoneNumber, photo) => {
  const formData = new FormData();
  formData.append("email", email);
  formData.append("name", name);
  formData.append("surname", surname);
  formData.append("password", password);
  formData.append("phoneNumber", phoneNumber);
  if (photo) {
    formData.append("photo", photo); // Add the photo file to the form data
  }

  return axios
    .post(API_URL + "/signup", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((response) => {
      console.log("Register Response:", response); // Log the full response object
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Register Error:", error.message, error.config); // Log error message and config
      throw error; // Re-throw error after logging
    });
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
