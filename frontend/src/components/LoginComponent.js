import React, { useState } from "react";
import { MDBContainer, MDBInput, MDBBtn, MDBSpinner } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./LoginComponent.scss";
import AuthService from "../api/AuthenticationAPI";
import { useForm } from "react-hook-form";
import ConnectInLogo from "../assets/ConnectIn.png";
import FooterComponent from "./common/FooterComponent";

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
      (response) => {
        setLoading(false);
        if (response.roles[0].name === "ROLE_ADMIN") {
          navigate("/admin");
        } else if (response.roles[0].name === "ROLE_USER") {
          navigate("/home");
        } else {
          setMessage("Unexpected user role");
        }
      },
      (error) => {
        setLoading(false);
        let resMessage = "";

        if (error.response && error.response.status === 401) {
          // Customize the message for a 401 error
          resMessage = "Invalid email or password. Please try again.";
        } else {
          resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();
        }

        setMessage(resMessage);
      }
    );
  };

  return (
    <div className="login-wrapper">
      <img src={ConnectInLogo} alt="ConnectIn Logo" className="connectInLogo" />
      <div className="form-container">
        <h2 className="subheading">Welcome to your professional community! </h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <MDBContainer>
            <MDBInput
              size="lg"
              wrapperClass="mb-4 wide-input"
              label="Email address"
              id="form1"
              type="email"
              placeholder={errors.email ? errors.email.message : "Email"}
              {...register("email", { required: "Email is required" })}
              className={errors.email ? "is-invalid" : ""}
            />

            <MDBInput
              size="lg"
              wrapperClass="mb-4 wide-input"
              label="Password"
              id="form2"
              type="password"
              placeholder={
                errors.password ? errors.password.message : "Password"
              }
              {...register("password", { required: "Password is required" })}
              className={errors.password ? "is-invalid" : ""}
            />

            {/* Centered Button Container */}
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
                <span>Sign in</span>
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
            navigate("/register");
            window.location.reload();
          }}
        >
          <p className="inner-footer-text">
            New to ConnectIn?{" "}
            <a href="#!" className="link">
              Join now
            </a>
          </p>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default LoginComponent;
