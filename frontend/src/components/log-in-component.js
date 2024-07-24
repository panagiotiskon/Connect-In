import React from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import {
  MDBContainer,
  MDBCol,
  MDBRow,
  MDBBtn,
  MDBInput,
  MDBCheckbox,
} from "mdb-react-ui-kit";

function App() {
  const navigate = useNavigate(); // Create navigate function

  const handleRegisterClick = () => {
    navigate("/signup"); // Navigate to SignUp page
  };

  return (
    <MDBContainer fluid className="p-3 my-5 h-custom">
      <MDBRow>
        <MDBCol col="10" md="6">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp"
            className="img-fluid"
            alt="Sample image"
          />
        </MDBCol>

        <MDBCol col="4" md="6">
          <div className="text-center mb-4">
            <div className="text-center mb-4" style={{ margin: "20px 0" }}>
              <h2
                className="fw-bold"
                style={{ color: "#333", fontSize: "2.5rem" }}
              >
                Log In
              </h2>
            </div>
          </div>
          <MDBInput
            wrapperClass="mb-4"
            label={
              <span style={{ fontSize: "1.4rem", color: "black" }}>
                Email address
              </span>
            }
            id="formControlLg"
            type="email"
            size="lg"
            labelStyle={{ color: "black" }}
          />
          <MDBInput
            wrapperClass="mb-4"
            label={
              <span style={{ fontSize: "1.4rem", color: "black" }}>
                Password
              </span>
            }
            id="formControlLg"
            type="password"
            size="lg"
            labelStyle={{ color: "black" }}
          />

          <div className="d-flex justify-content-between mb-4">
            <MDBCheckbox
              name="flexCheck"
              value=""
              id="flexCheckDefault"
              label={
                <span style={{ fontSize: "1.22rem", color: "black" }}>
                  Remember me
                </span>
              }
              labelStyle={{ color: "black" }}
            />
            <a href="#!">Forgot password?</a>
          </div>

          <div className="text-center text-md-start mt-4 pt-2">
            <MDBBtn className="mb-0 px-5" size="lg">
              Login
            </MDBBtn>
            <p
              className="small fw-bold mt-2 pt-1 mb-2"
              style={{ color: "black" }}
            >
              Don't have an account?{" "}
              <a
                href="#!"
                className="link-danger"
                onClick={handleRegisterClick}
              >
                Register
              </a>
            </p>
          </div>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}

export default App;
