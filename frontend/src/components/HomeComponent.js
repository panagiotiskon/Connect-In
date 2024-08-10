import React, { useState } from "react";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBNavbarItem,
  MDBBtn,
  MDBCardBody,
  MDBCardImage,
  MDBCard,
} from "mdb-react-ui-kit";
import ConnectInLogo from "../assets/ConnectIn.png"; // Adjust the path if needed

export default function HomeComponent() {
  const [openNavSecond, setOpenNavSecond] = useState(false);

  return (
    <>
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer
          fluid
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/* Non-clickable logo */}
          <div style={{ flex: "0 1 auto" }}>
            <img
              src={ConnectInLogo}
              alt="ConnectIn Logo"
              style={{ width: "200px", height: "auto", marginLeft: "60px" }}
            />
          </div>

          {/* Navbar toggler */}
          <MDBNavbarToggler
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setOpenNavSecond(!openNavSecond)}
            style={{ flex: "0 1 auto", marginLeft: "20px" }} // Add margin here
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>

          {/* Navbar collapse */}
          <MDBCollapse navbar open={openNavSecond}>
            <MDBNavbarNav
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "100px", // Space between icons
                alignItems: "center",
              }}
            >
              <MDBNavbarItem
                className="d-flex flex-column align-items-center me-3 me-lg-0"
                style={{ margin: "0 325px" }}
              >
                <MDBNavbarLink active aria-current="page" href="#">
                  <MDBIcon fas icon="home" size="2x" />
                </MDBNavbarLink>
                <span>Home</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center me-3 me-lg-0">
                <MDBNavbarLink href="#">
                  <MDBIcon fas icon="users" size="2x" />
                </MDBNavbarLink>
                <span>Network</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center me-3 me-lg-0">
                <MDBNavbarLink href="#">
                  <MDBIcon fas icon="suitcase" size="2x" />
                </MDBNavbarLink>
                <span>Jobs</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center me-3 me-lg-0">
                <MDBNavbarLink href="#">
                  <MDBIcon fas icon="message" size="2x" />
                </MDBNavbarLink>
                <span>Messaging</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center me-3 me-lg-0">
                <MDBNavbarLink href="#">
                  <MDBIcon fas icon="exclamation" size="2x" />
                </MDBNavbarLink>
                <span>Notifications</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center me-3 me-lg-0">
                <MDBNavbarLink href="#">
                  <MDBIcon fas icon="user-circle" size="2x" />
                </MDBNavbarLink>
                <span>Profile</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center me-3 me-lg-0">
                <MDBNavbarLink href="#">
                  <MDBIcon fas icon="cog" size="2x" />
                </MDBNavbarLink>
                <span>Settings</span>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <MDBContainer fluid className="mt-4" style={{ padding: 0 }}>
        <MDBCard className="mb-4" style={{ width: "300px", marginLeft: "0" }}>
          <MDBCardBody className="text-center">
            <MDBCardImage
              src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"
              alt="avatar"
              className="rounded-circle"
              style={{ width: "150px" }}
              fluid
            />
            <p className="text-muted mb-1">Full Stack Developer</p>
            <p className="text-muted mb-4">Bay Area, San Francisco, CA</p>
          </MDBCardBody>
        </MDBCard>
      </MDBContainer>
    </>
  );
}
