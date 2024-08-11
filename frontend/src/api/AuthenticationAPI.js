import axios from "axios";
import test from "../assets/test-photo-profile.png";
// const API_URL = "http://localhost:8000/api/auth";

// const login = (email, password) => {
//   return axios
//     .post(API_URL + "login", {
//       email,
//       password,
//     })
//     .then((response) => {
//       if (response.data.accessToken) {
//         localStorage.setItem("user", JSON.stringify(response.data));
//       }
//       return response.data;
//     });
// };

// const logout = () => {
//   localStorage.removeItem("user");
//   return axios.post(API_URL + "signout").then((response) => {
//     return response.data;
//   });
// };

// const register = (email, name, surname, password, phoneNumber, photo) => {
//   //   const formData = new FormData();
//   //   formData.append("email", email);
//   //   formData.append("name", name);
//   //   formData.append("surname", surname);
//   //   formData.append("password", password);
//   //   formData.append("phoneNumber", phoneNumber);
//   //   if (photo) {
//   //     formData.append("photo", photo); // Add the photo file to the form data
//   //   }

//   //   return axios.post(API_URL + "signup", formData, {
//   //     headers: {
//   //       "Content-Type": "multipart/form-data", // Set the correct content type
//   //     },
//   //   });
//   // }
//   return axios
//     .post(API_URL + "signup", {
//       email,
//       name,
//       surname,
//       password,
//       phoneNumber,
//       photo,
//     })
//     .then((response) => {
//       if (response.data.accessToken) {
//         // Save the user data in localStorage
//         localStorage.setItem("user", JSON.stringify(response.data));
//       }
//       return response.data;
//     });
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
// AuthService.js

const mockUser = {
  email: "john.doe@example.com",
  name: "Stelios",
  surname: "Dimitriadis",
  photo: test, // Replace with an actual image URL
  accessToken: "mock-access-token",
  phoneNumber: "123-456-7890",
};

// Set the mock user in localStorage for testing purposes
localStorage.setItem("user", JSON.stringify(mockUser));

const login = (email, password) => {
  return new Promise((resolve) => {
    resolve({
      data: mockUser,
    });
  });
};

const logout = () => {
  localStorage.removeItem("user");
};

const register = (email, name, surname, password, phoneNumber, photo) => {
  return new Promise((resolve) => {
    const newUser = {
      email,
      name,
      surname,
      photo,
      phoneNumber,
      accessToken: "new-mock-access-token",
    };
    localStorage.setItem("user", JSON.stringify(newUser));
    resolve({ data: newUser });
  });
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};

const AuthService = {
  register,
  login,
  logout,
  getCurrentUser,
};

export default AuthService;
