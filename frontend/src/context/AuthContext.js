import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import api from "../api/axiosInstance";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const fetchRef = useRef(false);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const response = await api.get("/auth/current-user");
      setUser(response.data);
      return response.data;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  // Bootstrap: fetch current user once on mount
  useEffect(() => {
    if (fetchRef.current) return; // prevent double-fetch in StrictMode
    fetchRef.current = true;

    fetchCurrentUser().finally(() => setIsAuthLoading(false));
  }, [fetchCurrentUser]);

  const login = useCallback(async (email, password) => {
    const response = await api.post("/auth/login", { email, password });
    const userData = response.data;
    // Normalize: login returns { roles: [{name}] }, current-user returns { role: string }
    const normalizedUser = {
      ...userData,
      role: userData.roles?.[0]?.name || null,
    };
    setUser(normalizedUser);
    return normalizedUser;
  }, []);

  const register = useCallback(async (email, name, surname, password, phoneNumber, photo) => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("firstName", name);
    formData.append("lastName", surname);
    formData.append("password", password);
    formData.append("phoneNumber", phoneNumber);
    if (photo) {
      formData.append("profilePicture", photo);
    }
    const response = await api.post("/auth/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    // After registration, fetch the user to populate auth state
    await fetchCurrentUser();
    return response.data;
  }, [fetchCurrentUser]);

  const logout = useCallback(async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // ignore logout errors
    }
    setUser(null);
  }, []);

  const refreshCurrentUser = useCallback(async () => {
    setIsAuthLoading(true);
    const userData = await fetchCurrentUser();
    setIsAuthLoading(false);
    return userData;
  }, [fetchCurrentUser]);

  const isAuthenticated = !!user;

  const value = {
    user,
    isAuthenticated,
    isAuthLoading,
    login,
    register,
    logout,
    refreshCurrentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
