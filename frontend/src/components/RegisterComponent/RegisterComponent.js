import React, { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../../api/AuthenticationAPI";
import ConnectInLogo from "../../assets/ConnectIn.png";
import PhotoUpload from "./PhotoUpload";
import FooterComponent from "../common/FooterComponent";
import "./RegisterComponent.scss";

const RegisterComponent = () => {
  const {
    register: formRegister,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [photoError, setPhotoError] = useState("");
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);

  const onSubmit = (data) => {
    setMessage("");
    setPhotoError("");
    setLoading(true);

    if (data.password !== data.repeatPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    if (!photo) {
      setPhotoError("Photo is required.");
      setLoading(false);
      return;
    }

    AuthService.register(
      data.email,
      data.name,
      data.surname,
      data.password,
      data.phoneNumber,
      photo
    )
      .then(() => {
        navigate("/home");
        window.location.reload();
      })
      .catch((error) => {
        let resMessage;

        if (error.response && error.response.status === 401) {
          resMessage =
            "A user with this email already exists, try logging instead.";
        } else {
          resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }

        setLoading(false);
        setMessage(resMessage);
      });
  };

  const handleFileUpload = (file) => {
    setPhoto(file);
  };

  return (
    <div className="register-wrapper">
      <img src={ConnectInLogo} alt="ConnectIn Logo" className="connectInLogo" />
      <div className="form-container">
        <h2 className="subheading">Make the most of your professional life</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <MDBContainer>
            <div className="form-group mb-5">
              <MDBInput
                size="lg"
                label="Email address"
                id="form2"
                type="email"
                placeholder={errors.email ? errors.email.message : "Email"}
                {...formRegister("email", { required: "Email is required" })}
                className={errors.email ? "is-invalid" : ""}
              />
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email.message}
                </div>
              )}
            </div>

            <div className="form-group mb-5">
              <MDBInput
                size="lg"
                label="First Name"
                id="form1"
                type="text"
                placeholder={errors.name ? errors.name.message : "First Name"}
                {...formRegister("name", {
                  required: "First name is required",
                  minLength: {
                    value: 3,
                    message: "First name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "First name must be less than 20 characters long",
                  },
                })}
                className={errors.name ? "is-invalid" : ""}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name.message}
                </div>
              )}
            </div>

            <div className="form-group mb-5">
              <MDBInput
                size="lg"
                label="Last Name"
                id="form1"
                type="text"
                placeholder={
                  errors.surname ? errors.surname.message : "Last Name"
                }
                {...formRegister("surname", {
                  required: "Last name is required",
                  minLength: {
                    value: 3,
                    message: "Last name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Last name must be less than 20 characters long",
                  },
                })}
                className={errors.surname ? "is-invalid" : ""}
              />
              {errors.surname && (
                <div className="invalid-feedback d-block">
                  {errors.surname.message}
                </div>
              )}
            </div>

            <div className="form-group mb-5">
              <MDBInput
                size="lg"
                label="Password"
                id="form3"
                type="password"
                placeholder={
                  errors.password ? errors.password.message : "Password"
                }
                {...formRegister("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Password must be less than 20 characters long",
                  },
                })}
                className={errors.password ? "is-invalid" : ""}
              />
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password.message}
                </div>
              )}
            </div>

            <div className="form-group mb-5">
              <MDBInput
                size="lg"
                label="Repeat Password"
                id="form4"
                type="password"
                placeholder="Repeat Password"
                {...formRegister("repeatPassword", {
                  required: "Please confirm your password",
                })}
                className={
                  watch("password") !== watch("repeatPassword")
                    ? "is-invalid"
                    : ""
                }
              />
              {watch("password") !== watch("repeatPassword") && (
                <div className="invalid-feedback d-block">
                  Passwords do not match.
                </div>
              )}
            </div>

            <div className="form-group mb-5">
              <MDBInput
                size="lg"
                label="Phone Number"
                id="form1"
                type="tel"
                placeholder={
                  errors.phoneNumber
                    ? errors.phoneNumber.message
                    : "Phone Number"
                }
                {...formRegister("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must contain 10 digits",
                  },
                })}
                className={errors.phoneNumber ? "is-invalid" : ""}
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback d-block">
                  {errors.phoneNumber.message}
                </div>
              )}
            </div>

            <div className="form-group mb-5">
              <PhotoUpload onFileUpload={handleFileUpload} />
              {photoError && (
                <div
                  style={{ marginTop: "8px" }}
                  className="invalid-feedback d-block"
                >
                  {photoError}
                </div>
              )}
            </div>

            <div className="text-center">
              <MDBBtn
                type="submit"
                size="lg"
                className="sign-in-button"
                disabled={loading}
              >
                {loading && (
                  <MDBSpinner className="mx-2" size="sm" color="secondary">
                    <span className="visually-hidden"></span>
                  </MDBSpinner>
                )}
                <span>Register</span>
              </MDBBtn>
            </div>

            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
          </MDBContainer>
        </form>

        <div
          className="text-center"
          onClick={() => {
            navigate("/");
            window.location.reload();
          }}
        >
          <p className="inner-footer-text">
            Already have an account?{" "}
            <a href="#!" className="link">
              Sign in
            </a>
          </p>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default RegisterComponent;
