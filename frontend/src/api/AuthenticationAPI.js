import axios from "axios";

const API_URL = "https://localhost:8443/auth";

axios.defaults.withCredentials = true;

const uploadPhoto = async (file) => {
    const formData = new FormData();
    if (file) {
        formData.append("file", file);
    }

    try {
        const response = await axios.post(`${API_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
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
        const response = await axios.post(
            `${API_URL}/${userId}/change-password`,
            UserChangePasswordRequest
        );

        return response.data;
    } catch (error) {
        console.error("Change Password Error:", error.message);
        throw error;
    }
};

const login = (email, password) => {
    return axios
        .post(API_URL + "/login", { email, password })
        .then((response) => {
            return response.data;
        })
        .catch((error) => {
            console.error("Login Error:", error.message);
            console.error("Error Config:", error.config);
            throw error; 
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
            console.log("Register Response:", response);
            return response.data;
        })
        .catch((error) => {
            console.error("Registration Error:", error.message, error.config);
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
