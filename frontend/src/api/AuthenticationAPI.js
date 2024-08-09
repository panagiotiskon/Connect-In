import axios from "axios";

const API_URL = "http://localhost:8000/api/auth";

class AuthService {
  login(email, password) {
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
  }

  logout() {
    localStorage.removeItem("user");
  }

  register(email, name, surname, password, phoneNumber, photo) {
    return axios.post(API_URL + "signup", {
      email,
      name,
      surname,
      password,
      phoneNumber,
      photo,
    });
  }
}

export default new AuthService();
