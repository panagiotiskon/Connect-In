import React, { useState } from "react";
import AuthService from "../services/auth-service";
import logo from "file:///home/stelios/Desktop/Project_tedi/Pepe-In/frontend/Screenshot_from_2024-07-16_16-23-12__1_-removebg-preview.png";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBBtn,
  MDBInput,
} from "mdb-react-ui-kit";

const SignUpComponent = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [error, setError] = useState(null);
  const [passwordError, setPasswordError] = useState(null);

  const handleSignUp = async () => {
    if (password !== repeatPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    setPasswordError(null); // Clear any previous password errors

    try {
      const result = await AuthService.signUp({
        username,
        password,
        email,
        name,
        photo,
      });
      console.log("User signed up:", result);
      // Redirect or update UI as needed
    } catch (error) {
      console.error("Sign up failed:", error);
      setError("Sign up failed. Please try again.");
    }
  };

  const handleRepeatPasswordChange = (e) => {
    const repeatPasswordValue = e.target.value;
    setRepeatPassword(repeatPasswordValue);

    if (password !== repeatPasswordValue) {
      setPasswordError("Passwords do not match");
    } else {
      setPasswordError(null);
    }
  };

  return (
    <MDBContainer className="mt-5">
      <MDBRow className="align-items-center mb-4">
        <MDBCol size="12" className="d-flex align-items-center">
          <div className="logo-container d-flex align-items-center">
            <img src={logo} alt="Logo" className="logo" />
          </div>
        </MDBCol>
      </MDBRow>
      <h2 className="mb-4">Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <MDBInput
        wrapperClass="mb-4"
        label="Username"
        id="username"
        type="text"
        size="lg"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <MDBInput
        wrapperClass="mb-4"
        label="Password"
        id="password"
        type="password"
        size="lg"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <MDBInput
        wrapperClass="mb-4"
        label="Repeat Password"
        id="repeatPassword"
        type="password"
        size="lg"
        value={repeatPassword}
        onChange={handleRepeatPasswordChange}
        placeholder="Repeat Password"
      />
      {passwordError && <div className="text-danger">{passwordError}</div>}
      <MDBInput
        wrapperClass="mb-4"
        label="Email"
        id="email"
        type="email"
        size="lg"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <MDBInput
        wrapperClass="mb-4"
        label="Name"
        id="name"
        type="text"
        size="lg"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Name"
      />
      <MDBInput
        wrapperClass="mb-4"
        label="Photo URL"
        id="photo"
        type="text"
        size="lg"
        value={photo}
        onChange={(e) => setPhoto(e.target.value)}
        placeholder="Photo URL"
      />
      <MDBBtn className="mb-0 px-5" size="lg" onClick={handleSignUp}>
        Sign Up
      </MDBBtn>
    </MDBContainer>
  );
};

export default SignUpComponent;
