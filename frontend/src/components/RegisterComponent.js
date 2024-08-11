import React, { useState, useRef } from "react";
import AuthService from "../api/AuthenticationAPI";
import { useNavigate } from "react-router-dom";
import ConnectInLogo from "../assets/ConnectIn.png";
import { isEmail } from "validator";
import Form from "react-validation/build/form";
import CheckButton from "react-validation/build/button";
import "./RegisterComponent.scss";
import register from "../assets/register.svg";
import PhotoUpload from "./PhotoUpload"; // Import the PhotoUpload component

import {
  MDBBtn,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
  MDBInput,
  MDBCardImage,
} from "mdb-react-ui-kit";

const requiredField = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">This field is required!</div>
    );
  }
};

const validEmail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="invalid-feedback d-block">This is not a valid email.</div>
    );
  }
};

const validName = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        Name must be between 3 and 20 characters.
      </div>
    );
  }
};

const validSurname = (value) => {
  if (value.length < 3 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        Surname must be between 3 and 20 characters.
      </div>
    );
  }
};

const validPassword = (value) => {
  if (value.length < 6 || value.length > 20) {
    return (
      <div className="invalid-feedback d-block">
        The password must be between 6 and 20 characters.
      </div>
    );
  }
};

const validPhoneNumber = (value) => {
  if (value.length !== 10) {
    return (
      <div className="invalid-feedback d-block">
        Phone number must contain 10 numbers.
      </div>
    );
  }
};

const RegisterComponent = (props) => {
  const form = useRef();
  const checkBtn = useRef();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [successful, setSuccessful] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [photo, setPhoto] = useState(null);

  const onChangeName = (e) => {
    const name = e.target.value;
    setName(name);
  };

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
    validatePasswordMatch(password, repeatPassword);
  };

  const onChangeRepeatPassword = (e) => {
    const repeatPassword = e.target.value;
    setRepeatPassword(repeatPassword);
    validatePasswordMatch(password, repeatPassword);
  };

  const validatePasswordMatch = (password, repeatPassword) => {
    if (password && repeatPassword && password !== repeatPassword) {
      setPasswordMatchError("Passwords do not match.");
    } else {
      setPasswordMatchError("");
    }
  };

  const onChangeSurname = (e) => {
    const surname = e.target.value;
    setSurname(surname);
  };

  const onChangePhoneNumber = (e) => {
    const phoneNumber = e.target.value;
    setPhoneNumber(phoneNumber);
  };

  const handleFileUpload = (file) => {
    setPhoto(file);
  };

  const handleRegister = (e) => {
    e.preventDefault();

    setMessage("");
    setSuccessful(false);

    form.current.validateAll();

    if (
      checkBtn.current &&
      checkBtn.current.context &&
      checkBtn.current.context._errors.length === 0
    ) {
      if (password !== repeatPassword) {
        setMessage("Passwords do not match.");
        setSuccessful(false);
        return;
      }

      AuthService.register(
        email,
        name,
        surname,
        password,
        phoneNumber,
        photo
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

          setMessage(resMessage);
          setSuccessful(false);
        }
      );
    }
  };

  return (
    <div className="register-wrapper">
      <img src={ConnectInLogo} alt="ConnectIn Logo" className="connectInLogo" />
      <div style={{ position: "relative" }}>
        <h2 className="register-message">
          Make the most of your professional life
        </h2>
      </div>
      <Form onSubmit={handleRegister} ref={form}>
        {!successful && (
          <>
            <MDBContainer>
              <MDBRow>
                <MDBCol
                  md="10"
                  lg="6"
                  className="order-2 order-lg-1 d-flex flex-column align-items-center"
                >
                  <div className="d-flex flex-row align-items-center mb-4 m-3">
                    <MDBIcon fas icon="envelope me-3" size="lg" />
                    <MDBInput
                      label="Your Email"
                      id="form2"
                      type="email"
                      value={email}
                      onChange={onChangeEmail}
                      validators={{ requiredField, validEmail }}
                    />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4 m-3">
                    <MDBIcon fas icon="user me-3" size="lg" />
                    <MDBInput
                      label="Your Name"
                      id="form1"
                      type="text"
                      className="w-100"
                      value={name}
                      onChange={onChangeName}
                      validators={{ requiredField, validName }}
                    />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4 m-3">
                    <MDBIcon fas icon="id-card me-3" size="lg" />
                    <MDBInput
                      label="Your Surname"
                      id="form1"
                      type="text"
                      className="w-100"
                      value={surname}
                      onChange={onChangeSurname}
                      validators={{ requiredField, validSurname }}
                    />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4 m-3">
                    <MDBIcon fas icon="lock me-3" size="lg" />
                    <MDBInput
                      label="Password"
                      id="form3"
                      type="password"
                      value={password}
                      onChange={onChangePassword}
                      validators={{ requiredField, validPassword }}
                    />
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4 position-relative m-3 ">
                    <MDBIcon fas icon="key me-3" size="lg" />
                    <MDBInput
                      label="Repeat your password"
                      id="form4"
                      type="password"
                      value={repeatPassword}
                      onChange={onChangeRepeatPassword}
                    />
                    {passwordMatchError && (
                      <div
                        className="text-danger position-absolute"
                        style={{ top: "110%", right: "45px" }}
                      >
                        {passwordMatchError}
                      </div>
                    )}
                  </div>

                  <div className="d-flex flex-row align-items-center mb-4 m-3">
                    <MDBIcon fas icon="phone me-3" size="lg" />
                    <MDBInput
                      label="Your Phone Number"
                      id="form1"
                      type="tel"
                      className="w-100"
                      value={phoneNumber}
                      onChange={onChangePhoneNumber}
                      validators={{ requiredField, validPhoneNumber }}
                    />
                  </div>

                  <PhotoUpload onFileUpload={handleFileUpload} />

                  <MDBBtn className="mb-4" size="lg">
                    Register
                  </MDBBtn>
                </MDBCol>

                <MDBCol
                  md="10"
                  lg="6"
                  className="order-1 order-lg-2 d-flex align-items-center"
                >
                  <img
                    src={register}
                    alt="register"
                    classname="register-photo"
                  />
                </MDBCol>
              </MDBRow>
            </MDBContainer>
          </>
        )}
        {message && (
          <div className="form-group">
            <div
              className={
                successful ? "alert alert-success" : "alert alert-danger"
              }
              role="alert"
            >
              {message}
            </div>
          </div>
        )}
      </Form>
    </div>
  );
};

export default RegisterComponent;
