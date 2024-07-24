import axios from "axios";

const AUTH_URL = "http://localhost:8080/auth";

class AuthService {
  async signUp({
    username,
    email,
    password,
    passwordValidation,
    phoneNumber,
    photo,
  }) {
    try {
      const response = await axios.post(`${AUTH_URL}/signup`, {
        username,
        email,
        password,
        phoneNumber,
        photo,
      });
      const responseData = response.data;
      localStorage.setItem("jwtToken", responseData.responseToken);
      return responseData;
    } catch (error) {
      console.error("Sign up error:", error);
      throw error;
    }
  }

  async signIn(email, password) {
    try {
      const response = await fetch(`${AUTH_URL}/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error("Failed to sign in");
      }
      const responseData = await response.json();
      localStorage.setItem("jwtToken", responseData.responseToken);
      return responseData;
    } catch (error) {
      console.error("Sign in error:", error);
      throw error;
    }
  }

  logout() {
    localStorage.removeItem("jwtToken");
  }
}
export default AuthService;
