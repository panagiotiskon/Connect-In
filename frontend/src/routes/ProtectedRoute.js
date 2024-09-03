import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import AuthenticationAPI from "../api/AuthenticationAPI";

const ProtectedRoute = ({ element: Element, allowedRoles, ...rest }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await AuthenticationAPI.getCurrentUser();
        console.log("Fetched User:", currentUser); // Log user data
        setUser(currentUser);
      } catch (error) {
        console.error("Error fetching current user:", error);
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  console.log("Loading:", loading);
  console.log("User:", user);
  console.log("Error:", error);

  if (loading) {
    return <div>Loading...</div>; // Loading spinner/component
  }

  if (error || !user) {
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" />;
  }
  return <Element {...rest} />;
};

export default ProtectedRoute;
