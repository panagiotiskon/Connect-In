import React, { useState } from "react";
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
import { useForm } from "react-hook-form";
import ConnectInLogo from "../assets/ConnectIn.png";

const LoginComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const onSubmit = (data) => {
    setMessage("");
    setLoading(true);

    AuthService.login(data.email, data.password).then(
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

  return (
    <div className="login-wrapper">
      <img src={ConnectInLogo} alt="ConnectIn Logo" className="connectInLogo" />
      <h2 className="welcome-message">
        Welcome to your professional community!
      </h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <MDBContainer>
          <MDBInput
            size="lg"
            wrapperClass="mb-4"
            label="Email address"
            id="form1"
            type="email"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email && (
            <div className="invalid-feedback d-block">
              {errors.email.message}
            </div>
          )}

          <MDBInput
            size="lg"
            wrapperClass="mb-4"
            label="Password"
            id="form2"
            type="password"
            {...register("password", { required: "Password is required" })}
          />
          {errors.password && (
            <div className="invalid-feedback d-block">
              {errors.password.message}
            </div>
          )}

          <div className="d-flex justify-content-between mx-5 mb-5">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label="Remember me"
            />
            <a href="#!" style={{ marginLeft: "40px" }}>
              Forgot password?
            </a>
          </div>
          <MDBBtn type="submit" size="lg" className="mb-10" disabled={loading}>
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
      </form>
    </div>
  );
};

export default LoginComponent;
