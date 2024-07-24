import React from "react";
import { useNavigate } from "react-router-dom";
import LoginComponent from "./log-in-component";
import { MDBContainer, MDBBtn } from "mdb-react-ui-kit";

const Board = () => {
  const navigate = useNavigate(); // Hook for navigation

  const navigateToSignUp = () => {
    navigate("/signup"); // Navigate to SignUp page
  };

  return (
    <MDBContainer
      fluid
      className="d-flex flex-column justify-content-center align-items-center min-vh-100"
    >
      <LoginComponent />
    </MDBContainer>
  );
};

export default Board;
