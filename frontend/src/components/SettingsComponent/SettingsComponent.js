import React, { useState } from "react";
import NavbarComponent from "../common/NavBar";
import AuthService from "../../api/AuthenticationAPI";
import { useNavigate } from "react-router-dom";

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
import SettingsPopup from "./SettingsPopup"; 

export default function SettingsComponent() {
  const navigate = useNavigate();

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
  const [popupOpen, setPopupOpen] = useState(false);
  const [popupContent, setPopupContent] = useState("");
  const [popupType, setPopupType] = useState("success");

  const newEmail = watchEmail("newEmail");
  const oldEmail = watchEmail("oldEmail");

  const validateEmailsMatch = (value) => {
    return value === newEmail || "Emails do not match";
  };

  const oldPassword = watchPassword("oldPassword");
  const newPassword = watchPassword("newPassword");

  const handlePopupClose = async () => {
    setPopupOpen(false);
    await AuthService.logout();
    navigate("/");
  };

  const validatePasswordsMatch = (value) => {
    return (
      value !== oldPassword || "New password cannot be the same as old password"
    );
  };

  const onSubmitEmail = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      await AuthService.changeEmail(data.oldEmail, data.newEmail);
      setPopupContent("Email changed successfully!");
      setPopupType("success");
      setPopupOpen(true);
      setLoading(false);
    } catch (error) {
      setMessage("Failed to change email. Please try again.");
      setLoading(false);
    }
  };

  const onSubmitPassword = async (data) => {
    setLoading(true);
    setMessage("");
    try {
      await AuthService.changePassword(data.oldPassword, data.newPassword);
      setPopupContent("Password changed successfully!");
      setPopupType("success");
      setPopupOpen(true);
      setLoading(false);
    } catch (error) {
      setMessage("Failed to change password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow className="justify-content-center">
          {/* Email Change Form */}
          <MDBCol md="3" className="mb-5 pe-3">
            <MDBCard>
              <MDBCardBody className="card-body-flex">
                <MDBCardTitle className="fs-4 fw-bold card-title mb-4">
                  Change Email
                </MDBCardTitle>
                <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
                  {/* Old Email Field */}
                  <div className="form-group mb-5">
                    <MDBInput
                      label="Old Email"
                      type="email"
                      placeholder={
                        emailErrors.oldEmail
                          ? emailErrors.oldEmail.message
                          : "Old Email"
                      }
                      {...registerEmail("oldEmail", {
                        required: "Old email is required",
                      })}
                      className={
                        emailErrors.oldEmail
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    {emailErrors.oldEmail && (
                      <div className="invalid-feedback d-block">
                        {emailErrors.oldEmail.message}
                      </div>
                    )}
                  </div>

                  {/* New Email Field */}
                  <div className="form-group mb-5">
                    <MDBInput
                      label="New Email"
                      type="email"
                      placeholder={
                        emailErrors.newEmail
                          ? emailErrors.newEmail.message
                          : "New Email"
                      }
                      {...registerEmail("newEmail", {
                        required: "New email is required",
                      })}
                      className={
                        emailErrors.newEmail
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    {emailErrors.newEmail && (
                      <div className="invalid-feedback d-block">
                        {emailErrors.newEmail.message}
                      </div>
                    )}
                  </div>

                  {/* Confirm New Email Field */}
                  <div className="form-group mb-5">
                    <MDBInput
                      label="Confirm New Email"
                      type="email"
                      placeholder={
                        emailErrors.confirmNewEmail
                          ? emailErrors.confirmNewEmail.message
                          : "Confirm New Email"
                      }
                      {...registerEmail("confirmNewEmail", {
                        required: "Confirm New Email is required",
                        validate: validateEmailsMatch,
                      })}
                      className={
                        emailErrors.confirmNewEmail
                          ? "form-control is-invalid"
                          : "form-control"
                      }
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
                        <MDBSpinner
                          className="mx-2"
                          size="sm"
                          color="secondary"
                        >
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

          <MDBCol md="3" className="mb-5 ps-3">
            <MDBCard
              className={`card-custom ${
                activeCard === "password" ? "card-active" : ""
              }`}
            >
              <MDBCardBody className="card-body-flex">
                <MDBCardTitle className="fs-4 fw-bold card-title mb-4">
                  Change Password
                </MDBCardTitle>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                  {/* Old Password Field */}
                  <div className="form-group mb-5">
                    <MDBInput
                      label="Old Password"
                      type="password"
                      placeholder={
                        passwordErrors.oldPassword
                          ? passwordErrors.oldPassword.message
                          : "Old Password"
                      }
                      {...registerPassword("oldPassword", {
                        required: "Old password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                      })}
                      className={
                        passwordErrors.oldPassword
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    {passwordErrors.oldPassword && (
                      <div className="invalid-feedback d-block">
                        {passwordErrors.oldPassword.message}
                      </div>
                    )}
                  </div>

                  {/* New Password Field */}
                  <div className="form-group mb-5">
                    <MDBInput
                      label="New Password"
                      type="password"
                      placeholder={
                        passwordErrors.newPassword
                          ? passwordErrors.newPassword.message
                          : "New Password"
                      }
                      {...registerPassword("newPassword", {
                        required: "New password is required",
                        minLength: {
                          value: 6,
                          message: "Password must be at least 6 characters",
                        },
                        validate: validatePasswordsMatch,
                      })}
                      className={
                        passwordErrors.newPassword
                          ? "form-control is-invalid"
                          : "form-control"
                      }
                    />
                    {passwordErrors.newPassword && (
                      <div className="invalid-feedback d-block">
                        {passwordErrors.newPassword.message}
                      </div>
                    )}
                  </div>

                  {/* Confirm New Password Field */}
                  <div className="form-group mb-5">
                    <MDBInput
                      label="Confirm New Password"
                      type="password"
                      placeholder={
                        passwordErrors.confirmNewPassword
                          ? passwordErrors.confirmNewPassword.message
                          : "Confirm New Password"
                      }
                      {...registerPassword("confirmNewPassword", {
                        required: "Please confirm your new password",
                        validate: (value) =>
                          value === newPassword || "Passwords do not match",
                      })}
                      className={
                        passwordErrors.confirmNewPassword
                          ? "form-control is-invalid"
                          : "form-control"
                      }
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
                        <MDBSpinner
                          className="mx-2"
                          size="sm"
                          color="secondary"
                        >
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

      {/* Render Popup */}
      <SettingsPopup
        popupOpen={popupOpen}
        popupContent={popupContent}
        popupType={popupType}
        handlePopupClose={handlePopupClose}
      />

      {message && (
        <div className="text-center mt-3">
          <div
            role="alert"
            style={{
              padding: "10px",
              border: "2px solid #f3f2ef", 
              borderRadius: "5px",
              backgroundColor: "#f3f2ef", // White background
              color: message.includes("Failed") ? "red" : "green",
              fontWeight: "bold",
            }}
          >
            {message}
          </div>
        </div>
      )}
    </div>
  );
}
