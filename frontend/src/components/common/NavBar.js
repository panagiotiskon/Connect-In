import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBNavbarItem,
} from "mdb-react-ui-kit";
import ConnectInLogo from "../../assets/ConnectIn.png"; // Adjust the path if needed
import AuthService from "../../api/AuthenticationAPI";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  const handleHomeClick = () => navigate("/home");
  const handleNetworkClick = () => navigate("/network");
  const handleJobsClick = () => navigate("/jobs");
  const handleMessagingClick = () => navigate("/messaging");
  const handleNotificationsClick = () => navigate("/notifications");
  const handleProfilePageClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/settings");

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer
        fluid
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flex: "0 1 auto" }}>
          <img
            src={ConnectInLogo}
            alt="ConnectIn Logo"
            style={{ width: "200px", height: "auto", marginLeft: "60px" }}
          />
        </div>
        <MDBNavbarToggler
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpenNavSecond(!openNavSecond)}
          style={{ flex: "0 1 auto", marginLeft: "20px" }}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openNavSecond}>
          <MDBNavbarNav
            style={{
              display: "flex",
              justifyContent: "flex-end",
              gap: "100px",
              alignItems: "center",
            }}
          >
            <MDBNavbarItem
              className="d-flex flex-column align-items-center me-3 me-lg-0"
              style={{ margin: "0 325px" }}
            >
              <MDBNavbarLink
                active
                aria-current="page"
                onClick={handleHomeClick}
              >
                <MDBIcon fas icon="home" size="2x" />
              </MDBNavbarLink>
              <span>Home</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center">
              <MDBNavbarLink onClick={handleNetworkClick}>
                <MDBIcon fas icon="users" size="2x" />
              </MDBNavbarLink>
              <span>Network</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center">
              <MDBNavbarLink onClick={handleJobsClick}>
                <MDBIcon fas icon="suitcase" size="2x" />
              </MDBNavbarLink>
              <span>Jobs</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center">
              <MDBNavbarLink onClick={handleMessagingClick}>
                <MDBIcon fas icon="message" size="2x" />
              </MDBNavbarLink>
              <span>Messaging</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center">
              <MDBNavbarLink onClick={handleNotificationsClick}>
                <MDBIcon fas icon="exclamation" size="2x" />
              </MDBNavbarLink>
              <span>Notifications</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center">
              <MDBNavbarLink onClick={handleProfilePageClick}>
                <MDBIcon fas icon="user-circle" size="2x" />
              </MDBNavbarLink>
              <span>Profile</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center">
              <MDBNavbarLink onClick={handleSettingsClick}>
                <MDBIcon fas icon="cog" size="2x" />
              </MDBNavbarLink>
              <span>Settings</span>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default NavbarComponent;
