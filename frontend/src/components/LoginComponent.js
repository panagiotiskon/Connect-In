import React, { useState, useRef } from "react";
import {
  MDBContainer,
  MDBInput,
  MDBBtn,
  MDBCheckbox,
  MDBSpinner,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.scss";
import AuthService from "../api/AuthenticationAPI";
import Form from "react-validation/build/form";
import ConnectInLogo from "../assets/ConnectIn.png";
const requiredField = (value) => {
  if (!value) {
    return (
      <div className="invalid-feedback d-block">This field is required!</div>
    );
  }
};

const LoginComponent = () => {
  const form = useRef();
  const checkBtn = useRef();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const onChangeEmail = (e) => {
    const email = e.target.value;
    setEmail(email);
  };

  const onChangePassword = (e) => {
    const password = e.target.value;
    setPassword(password);
  };

  const handleLogin = (e) => {
    e.preventDefault();

    setMessage("");
    setLoading(true);

    form.current.validateAll();

    if (checkBtn.current.context._errors.length === 0) {
      AuthService.login(email, password).then(
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
    } else {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <img src={ConnectInLogo} alt="ConnectIn Logo" className="connectInLogo" />
      <h2 className="welcome-message">
        Welcome to your professional community!
      </h2>
      {
        <Form onSubmit={handleLogin} ref={form}>
          <MDBContainer>
            <MDBInput
              size="lg"
              wrapperClass="mb-4"
              label="Email address"
              id="form1"
              type="email"
              value={email}
              onChange={onChangeEmail}
              validations={{ requiredField }}
            />
            <MDBInput
              size="lg"
              wrapperClass="mb-4"
              label="Password"
              id="form2"
              type="password"
              value={password}
              onChange={onChangePassword}
              validations={{ requiredField }}
            />
            <div className="d-flex justify-content-between mx-3 mb-4">
              <MDBCheckbox
                name="flexCheck"
                value=""
                id="flexCheckDefault"
                label="Remember me"
              />
              <a href="!#">Forgot password?</a>
            </div>
            <MDBBtn size="lg" className="mb-10" disabled={loading}>
              {loading && (
                <MDBSpinner className="mx-2" size="sm" color="secondary">
                  <span className="visually-hidden"></span>
                </MDBSpinner>
              )}
              <span>Sign in</span>
            </MDBBtn>
            {message && (
              <div className="form-group">
                <div className="alert alert-danger" role="alert">
                  {message}
                </div>
              </div>
            )}
            <div
              className="text-center"
              onClick={() => {
                navigate("/register");
                window.location.reload();
              }}
            >
              <p>
                New to ConnectIn? <a href="#!">Join Now</a>
              </p>
            </div>
          </MDBContainer>
        </Form>
      }
    </div>
  );
};

export default LoginComponent;
