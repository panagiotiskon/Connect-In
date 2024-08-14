import React, { useState } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import AuthService from "../api/AuthenticationAPI";
import ConnectInLogo from "../assets/ConnectIn.png";
import register from "../assets/register.svg";
import PhotoUpload from "./PhotoUpload";
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
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null); // State to handle photo

  const onSubmit = (data) => {
    setMessage("");
    setLoading(true);

    if (data.password !== data.repeatPassword) {
      setMessage("Passwords do not match.");
      setLoading(false);
      return;
    }

    AuthService.register(
      data.email,
      data.name,
      data.surname,
      data.password,
      data.phoneNumber,
      photo // Include the photo in the registration data
    ).then(
      () => {
        navigate("/home");
        window.location.reload();
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        setLoading(false);
        setMessage(resMessage);
      }
    );
  };

  const handleFileUpload = (file) => {
    setPhoto(file); // Set the photo when successfully uploaded
  };

  return (
    <div className="register-wrapper">
      <img src={ConnectInLogo} alt="ConnectIn Logo" className="connectInLogo" />
      <h2 className="register-message">
        Make the most of your professional life
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBContainer>
          <MDBRow>
            <MDBCol
              md="10"
              lg="6"
              className="order-2 order-lg-1 d-flex flex-column align-items-center"
            >
              <MDBInput
                size="lg"
                wrapperClass="mb-4"
                label="Your Email"
                id="form2"
                type="email"
                {...formRegister("email", { required: "Email is required" })}
              />
              {errors.email && (
                <div className="invalid-feedback d-block">
                  {errors.email.message}
                </div>
              )}

              <MDBInput
                size="lg"
                wrapperClass="mb-4"
                label="Your Name"
                id="form1"
                type="text"
                {...formRegister("name", {
                  required: "Name is required",
                  minLength: {
                    value: 3,
                    message: "Name must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Name must be less than 20 characters long",
                  },
                })}
              />
              {errors.name && (
                <div className="invalid-feedback d-block">
                  {errors.name.message}
                </div>
              )}

              <MDBInput
                size="lg"
                wrapperClass="mb-4"
                label="Your Surname"
                id="form1"
                type="text"
                {...formRegister("surname", {
                  required: "Surname is required",
                  minLength: {
                    value: 3,
                    message: "Surname must be at least 3 characters long",
                  },
                  maxLength: {
                    value: 20,
                    message: "Surname must be less than 20 characters long",
                  },
                })}
              />
              {errors.surname && (
                <div className="invalid-feedback d-block">
                  {errors.surname.message}
                </div>
              )}

              <MDBInput
                size="lg"
                wrapperClass="mb-4"
                label="Password"
                id="form3"
                type="password"
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
              />
              {errors.password && (
                <div className="invalid-feedback d-block">
                  {errors.password.message}
                </div>
              )}

              <MDBInput
                size="lg"
                wrapperClass="mb-4"
                label="Repeat your password"
                id="form4"
                type="password"
                {...formRegister("repeatPassword", {
                  required: "Please confirm your password",
                })}
              />
              {watch("password") !== watch("repeatPassword") && (
                <div className="invalid-feedback d-block">
                  Passwords do not match.
                </div>
              )}

              <MDBInput
                size="lg"
                wrapperClass="mb-4"
                label="Your Phone Number"
                id="form1"
                type="tel"
                {...formRegister("phoneNumber", {
                  required: "Phone number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Phone number must contain 10 digits",
                  },
                })}
              />
              {errors.phoneNumber && (
                <div className="invalid-feedback d-block">
                  {errors.phoneNumber.message}
                </div>
              )}

              {/* PhotoUpload component */}
              <PhotoUpload onFileUpload={handleFileUpload} />

              <MDBBtn
                type="submit"
                size="lg"
                className="mb-4"
                disabled={loading}
              >
                {loading && (
                  <MDBSpinner className="mx-2" size="sm" color="secondary">
                    <span className="visually-hidden"></span>
                  </MDBSpinner>
                )}
                <span>Register</span>
              </MDBBtn>

              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </MDBCol>

            <MDBCol
              md="10"
              lg="6"
              className="order-1 order-lg-2 d-flex align-items-center"
            >
              <img src={register} alt="register" className="register-photo" />
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </form>
    </div>
  );
};

export default RegisterComponent;
