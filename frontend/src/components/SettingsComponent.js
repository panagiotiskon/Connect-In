import React from "react";
import NavbarComponent from "./common/NavBar";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBInput,
  MDBBtn,
} from "mdb-react-ui-kit";

export default function SettingsComponent() {
  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow>
          {/* Change Email Card */}
          <MDBCol md="6" className="mb-5" style={{ paddingLeft: "80px" }}>
            <MDBCard
              style={{
                minHeight: "350px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Increased height */}
              <MDBCardBody style={{ flex: 1 }}>
                <MDBCardTitle className="fs-4 fw-bold">
                  Change Email
                </MDBCardTitle>
                <form>
                  <MDBInput
                    label="New Email"
                    type="email"
                    className="mb-3"
                    required
                  />
                  <MDBInput
                    label="Current Password"
                    type="password"
                    className="mb-3"
                    required
                  />
                </form>
              </MDBCardBody>
              <MDBBtn
                color="primary"
                type="submit"
                size="lg"
                style={{ margin: "16px" }}
              >
                Save Changes
              </MDBBtn>
            </MDBCard>
          </MDBCol>

          {/* Change Password Card */}
          <MDBCol md="5" className="mb-5" style={{ paddingLeft: "100px" }}>
            <MDBCard
              style={{
                minHeight: "350px",
                display: "flex",
                flexDirection: "column",
              }}
            >
              {/* Increased height */}
              <MDBCardBody style={{ flex: 1 }}>
                <MDBCardTitle className="fs-4 fw-bold">
                  Change Password
                </MDBCardTitle>
                <form>
                  <MDBInput
                    label="New Password"
                    type="password"
                    className="mb-3"
                    required
                  />
                  <MDBInput
                    label="Old Password"
                    type="password"
                    className="mb-3"
                    required
                  />
                  <MDBInput
                    label="Confirm Old Password"
                    type="password"
                    className="mb-3"
                    required
                  />
                </form>
              </MDBCardBody>
              <MDBBtn
                color="primary"
                type="submit"
                size="lg"
                style={{ margin: "16px" }}
              >
                Save Changes
              </MDBBtn>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
