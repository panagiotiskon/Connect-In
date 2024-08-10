import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

const login = (email, password) => {
  return axios
    .post(API_URL + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("user");
  return axios.post(API_URL + "signout").then((response) => {
    return response.data;
  });
};

const register = (email, name, surname, password, phoneNumber, photo) => {
  //   const formData = new FormData();
  //   formData.append("email", email);
  //   formData.append("name", name);
  //   formData.append("surname", surname);
  //   formData.append("password", password);
  //   formData.append("phoneNumber", phoneNumber);
  //   if (photo) {
  //     formData.append("photo", photo); // Add the photo file to the form data
  //   }

  //   return axios.post(API_URL + "signup", formData, {
  //     headers: {
  //       "Content-Type": "multipart/form-data", // Set the correct content type
  //     },
  //   });
  // }
  return axios.post(API_URL + "signup", {
    email,
    name,
    surname,
    password,
    phoneNumber,
    photo,
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
