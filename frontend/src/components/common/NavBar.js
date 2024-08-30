import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./NavBar.scss";

import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBContainer,
  MDBNavbarToggler
} from "mdb-react-ui-kit";
import ConnectInLogo from "../../assets/ConnectIn.png"; // Adjust the path if needed
import AuthService from "../../api/AuthenticationAPI";


const NavbarComponent = () => {
  const navigate = useNavigate();
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  const handleHomeClick = () => {
    navigate("/home");
    window.location.reload();
  };
  const handleNetworkClick = () => navigate("/network");
  const handleJobsClick = () => navigate("/jobs");
  const handleMessagingClick = () => navigate("/messaging");
  const handleNotificationsClick = () => navigate("/notifications");
  const handleProfilePageClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/settings");

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer fluid className="navbar-container">
        <div>
          <img
            src={ConnectInLogo}
            alt="ConnectIn Logo"
            className="navbar-logo"
          />
        </div>
        <MDBNavbarToggler
          aria-expanded={openNavSecond}
          aria-label="Toggle navigation"
          onClick={() => setOpenNavSecond(!openNavSecond)}
          className="navbar-toggler"
        >
        </MDBNavbarToggler>
        <MDBCollapse navbar open={openNavSecond}>
          <MDBNavbarNav className="navbar-nav">
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink
                active
                aria-current="page"
                onClick={handleHomeClick}
              >
                <MDBIcon fas icon="home" size="2x" />
              </MDBNavbarLink>
              <span>Home</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleNetworkClick}>
                <MDBIcon fas icon="users" size="2x" />
              </MDBNavbarLink>
              <span>Network</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleJobsClick}>
                <MDBIcon fas icon="suitcase" size="2x" />
              </MDBNavbarLink>
              <span>Jobs</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleMessagingClick}>
                <MDBIcon fas icon="message" size="2x" />
              </MDBNavbarLink>
              <span>Messaging</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleNotificationsClick}>
                <MDBIcon fas icon="exclamation" size="2x" />
              </MDBNavbarLink>
              <span>Notifications</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleProfilePageClick}>
                <MDBIcon fas icon="user-circle" size="2x" />
              </MDBNavbarLink>
              <span>Profile</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
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