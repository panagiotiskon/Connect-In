import React, { useState } from "react";
import NavbarComponent from "./common/NavBar";
import AuthService from "../api/AuthenticationAPI";
import FooterComponent from "./common/FooterComponent";
import axios from "axios";
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

export default function SettingsComponent() {
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
  const oldEmail = watchEmail("oldEmail");

  const validateEmailsMatch = (value) => {
    return value === newEmail || "Emails do not match";
  };

  const oldPassword = watchPassword("oldPassword");
  const newPassword = watchPassword("newPassword");

  const validatePasswordsMatch = (value) => {
    return (
      value !== oldPassword || "New password cannot be the same as old password"
    );
  };

  const onSubmitEmail = async (data) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await AuthService.changeEmail(
        data.oldEmail,
        data.newEmail
      );

      console.log("Email Change Response:", response);
      console.log("Response Data:", response.data);
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      setLoading(false);
      setMessage("Email changed successfully.");
    } catch (error) {
      setLoading(false);

      console.error("Email Change Error:", error.message);

      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }

      setMessage("Failed to change email. Please try again.");
    }
  };

  const onSubmitPassword = async (data) => {
    setMessage("");
    setLoading(true);

    try {
      const response = await AuthService.changePassword(
        data.oldPassword,
        data.newPassword
      );

      console.log("Password Change Response:", response);
      console.log("Response Data:", response.data);
      console.log("Response Status:", response.status);
      console.log("Response Headers:", response.headers);

      setLoading(false);
      setMessage("Password changed successfully.");
    } catch (error) {
      setLoading(false);

      console.error("Password Change Error:", error.message);

      if (error.response) {
        console.error("Error Response Data:", error.response.data);
        console.error("Error Response Status:", error.response.status);
        console.error("Error Response Headers:", error.response.headers);
      } else if (error.request) {
        console.error("Error Request:", error.request);
      } else {
        console.error("Error Message:", error.message);
      }

      setMessage("Failed to change password. Please try again.");
    }
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow className="justify-content-center">
          <MDBCol md="4" className="mb-5 pe-3">
            {" "}
            {/* Add right padding */}
            <MDBCard>
              <MDBCardBody className="card-body-flex">
                <MDBCardTitle className="fs-4 fw-bold card-title">
                  Change Email
                </MDBCardTitle>
                <form onSubmit={handleSubmitEmail(onSubmitEmail)}>
                  {/* Old Email Field */}
                  <div className="form-group mb-4">
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
                  <div className="form-group mb-4">
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
                  <div className="form-group mb-4">
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

          {/* The password change form with reordered fields */}
          <MDBCol md="4" className="mb-5 ps-3">
            <MDBCard
              className={`card-custom ${
                activeCard === "password" ? "card-active" : ""
              }`}
            >
              <MDBCardBody className="card-body-flex">
                <MDBCardTitle className="fs-4 fw-bold card-title">
                  Change Password
                </MDBCardTitle>
                <form onSubmit={handleSubmitPassword(onSubmitPassword)}>
                  {/* Old Password Field */}
                  <div className="form-group mb-4">
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
                  <div className="form-group mb-4">
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
                  <div className="form-group mb-4">
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

      {message && (
        <div className="text-center mt-3">
          <div
            role="alert"
            style={{
              padding: "10px",
              border: "2px #f3f2ef", // Black border
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
