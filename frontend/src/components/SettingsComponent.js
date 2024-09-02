import React, { useEffect, useState } from "react";
import NavbarComponent from "./common/NavBar";
import AuthService from "../api/AuthenticationAPI";
import axios from 'axios'
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBInput,
  MDBBtn,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useForm } from "react-hook-form";
import "./SettingsComponent.scss";
import { useNavigate } from "react-router-dom";

export default function SettingsComponent() {


  const navigate = useNavigate();
  const[isAuthenticated,setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        // Call the getCurrentUser function to check user authentication
        await AuthService.getCurrentUser();
        setIsAuthenticated(true);
      } catch (error) {
        // Check if the error response status is 401
        if (error.response && error.response.status === 401) {
          setIsAuthenticated(false);
          navigate("/");
        } else {
          console.error('Error checking authentication status:', error);
        }
      }
    };

    checkAuthStatus();
  }, [navigate]);

  const {
    register: registerEmail,
    handleSubmit: handleSubmitEmail,
    formState: { errors: emailErrors },
    watch: watchEmail,
  } = useForm();

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    formState: { errors: passwordErrors },
    watch: watchPassword,
  } = useForm();
  const [activeCard, setActiveCard] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const newEmail = watchEmail("newEmail");
  const confirmNewEmail = watchEmail("confirmNewEmail");

  const validateEmailsMatch = (value) => {
    return value === newEmail || "Emails do not match";
  };

  const newPassword = watchPassword("newPassword");

  const onSubmitEmail = async (data) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/change-email", {
        newEmail: data.newEmail,
      });
      setLoading(false);
      setMessage("Email changed successfully.");
    } catch (error) {
      setLoading(false);
      setMessage("Failed to change email. Please try again.");
      console.error("Email Change Error:", error);
    }
  };

  const onSubmitPassword = async (data) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await axios.post("/change-password", {
        newPassword: data.newPassword,
        oldPassword: data.oldPassword,
      });
      setLoading(false);
      setMessage("Password changed successfully.");
    } catch (error) {
      setLoading(false);
      setMessage("Failed to change password. Please try again.");
      console.error("Password Change Error:", error);
    }
  };

  if (!isAuthenticated) {
    // Prevent rendering if user is not authenticated
    return null;
  }

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow className="justify-content-center">
          <MDBCol md="4" className="mb-5 pe-3"> {/* Add right padding */}
            <MDBCard>
              <MDBCardBody className="card-body-flex">
                <MDBCardTitle className="fs-4 fw-bold card-title">Change Email</MDBCardTitle>
                <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
                  <div className="form-group mb-4">
                    <MDBInput
                      label="New Email"
                      type="email"
                      placeholder={emailErrors.newEmail ? emailErrors.newEmail.message : "New Email"}
                      {...registerEmail("newEmail", {
                        required: "New email is required",
                      })}
                      className={emailErrors.newEmail ? "form-control is-invalid" : "form-control"}
                    />
                    {emailErrors.newEmail && (
                      <div className="invalid-feedback d-block">
                        {emailErrors.newEmail.message}
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-4">
                    <MDBInput
                      label="Confirm New Email"
                      type="email"
                      placeholder={emailErrors.confirmNewEmail ? emailErrors.confirmNewEmail.message : "Confirm New Email"}
                      {...registerEmail("confirmNewEmail", {
                        required: "Confirm New Email is required",
                        validate: validateEmailsMatch,
                      })}
                      className={emailErrors.confirmNewEmail ? "form-control is-invalid" : "form-control"}
                    />
                    {emailErrors.confirmNewEmail && (
                      <div className="invalid-feedback d-block">
                        {emailErrors.confirmNewEmail.message}
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <MDBBtn
                      type="submit"
                      size="lg"
                      className="btn-custom"
                      onClick={() => setActiveCard("email")}
                      disabled={loading}
                    >
                      {loading && (
                        <MDBSpinner className="mx-2" size="sm" color="secondary">
                          <span className="visually-hidden">Loading...</span>
                        </MDBSpinner>
                      )}
                      <span>Save Changes</span>
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="4" className="mb-5 ps-3"> {/* Add left padding */}
            <MDBCard className={`card-custom ${activeCard === "password" ? "card-active" : ""}`}>
              <MDBCardBody className="card-body-flex">
                <MDBCardTitle className="fs-4 fw-bold card-title">Change Password</MDBCardTitle>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                  <div className="form-group mb-4">
                    <MDBInput
                      label="New Password"
                      type="password"
                      placeholder={passwordErrors.newPassword ? passwordErrors.newPassword.message : "New Password"}
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={passwordErrors.newPassword ? "form-control is-invalid" : "form-control"}
                    />
                    {passwordErrors.newPassword && (
                      <div className="invalid-feedback d-block">
                        {passwordErrors.newPassword.message}
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-4">
                    <MDBInput
                      label="Old Password"
                      type="password"
                      placeholder={passwordErrors.oldPassword ? passwordErrors.oldPassword.message : "Old Password"}
                      {...registerPassword("oldPassword", {
                        required: "Old password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={passwordErrors.oldPassword ? "form-control is-invalid" : "form-control"}
                    />
                    {passwordErrors.oldPassword && (
                      <div className="invalid-feedback d-block">
                        {passwordErrors.oldPassword.message}
                      </div>
                    )}
                  </div>

                  <div className="form-group mb-4">
                    <MDBInput
                      label="Confirm New Password"
                      type="password"
                      placeholder={passwordErrors.confirmNewPassword ? passwordErrors.confirmNewPassword.message : "Confirm New Password"}
                      {...registerPassword("confirmNewPassword", {
                        required: "Please confirm your new password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                      className={passwordErrors.confirmNewPassword ? "form-control is-invalid" : "form-control"}
                    />
                    {passwordErrors.confirmNewPassword && (
                      <div className="invalid-feedback d-block">
                        {passwordErrors.confirmNewPassword.message}
                      </div>
                    )}
                  </div>

                  <div className="text-center">
                    <MDBBtn
                      type="submit"
                      size="lg"
                      className="btn-custom"
                      onClick={() => setActiveCard("password")}
                      disabled={loading}
                    >
                      {loading && (
                        <MDBSpinner className="mx-2" size="sm" color="secondary">
                          <span className="visually-hidden">Loading...</span>
                        </MDBSpinner>
                      )}
                      <span>Save Changes</span>
                    </MDBBtn>
                  </div>
                </form>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>

      {message && (
        <div className="text-center mt-3">
          <div className="alert alert-info" role="alert">
            {message}
          </div>
        </div>
      )}

      <footer className="footer">
        <p className="footer-text"> &copy; Panagiotis Kontoeidis & Stelios Dimitriadis </p>
      </footer>
    </div>
  );
}
