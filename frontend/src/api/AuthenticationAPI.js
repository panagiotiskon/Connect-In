import axios from "axios";
import test from "../assets/test-photo-profile.png";

const API_URL = "http://localhost:8080/auth";
axios.defaults.withCredentials = true;

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
const register = (email, name, surname, password, phoneNumber) => {
  const data = {
    email,
    password,
    firstName: name,
    lastName: surname,
    phoneNumber,
  };

  return axios
    .post(API_URL + "/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => {
      console.log("Register Response:", response);
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    })
    .catch((error) => {
      console.error("Register Error:", error.message, error.config);
      throw error;
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
