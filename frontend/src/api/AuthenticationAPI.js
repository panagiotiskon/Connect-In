import api from "./axiosInstance";

const BASE = "/auth";

const uploadPhoto = async (file) => {
    const formData = new FormData();
    if (file) {
        formData.append("file", file);
    }
    const response = await api.post(`${BASE}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

const changeEmail = async (userId, oldEmail, newEmail) => {
    const userChangeEmailRequest = { oldEmail, newEmail };
    const response = await api.post(
        `${BASE}/${userId}/change-email`,
        userChangeEmailRequest
    );
    return response.data;
};

const changePassword = async (userId, oldPassword, newPassword) => {
    const UserChangePasswordRequest = { oldPassword, newPassword };
    const response = await api.post(
        `${BASE}/${userId}/change-password`,
        UserChangePasswordRequest
    );
    return response.data;
};

const AuthService = {
    uploadPhoto,
    changeEmail,
    changePassword,
};

export default AuthService;
