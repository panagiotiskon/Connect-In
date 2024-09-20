import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./NavBar.scss";
import {
  MDBNavbar,
  MDBNavbarNav,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBContainer,
  MDBNavbarToggler,
} from "mdb-react-ui-kit";
import ConnectInLogo from "../../assets/ConnectIn.png";
import AuthService from "../../api/AuthenticationAPI";

const NavbarComponent = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openNavSecond, setOpenNavSecond] = useState(false);

  const isActivePage = (path) => location.pathname === path;
  const handleHomeClick = () => navigate("/home");
  const handleNetworkClick = () => navigate("/network");
  const handleJobsClick = () => navigate("/jobs");
  const handleMessagingClick = () => navigate("/messaging");
  const handleNotificationsClick = () => navigate("/notifications");
  const handleProfilePageClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/settings");

  const handleLogout = () => {
    AuthService.logout();
    navigate("/");
  };

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
        ></MDBNavbarToggler>
        <MDBCollapse navbar open={openNavSecond}>
          <MDBNavbarNav className="navbar-nav">
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleHomeClick}>
                <MDBIcon
                  fas
                  icon="home"
                  style={{
                    fontSize: "1.4rem",
                    color: isActivePage("/home") ? "black" : "gray",
                  }}
                />
              </MDBNavbarLink>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePage("/home") ? "bold" : "normal",
                }}
              >
                Home
              </span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleNetworkClick}>
                <MDBIcon
                  fas
                  icon="users"
                  style={{
                    fontSize: "1.4rem",
                    color: isActivePage("/network") ? "black" : "gray",
                  }}
                />
              </MDBNavbarLink>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePage("/network") ? "bold" : "normal",
                }}
              >
                Network
              </span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleJobsClick}>
                <MDBIcon
                  fas
                  icon="suitcase"
                  style={{
                    fontSize: "1.4rem",
                    color: isActivePage("/jobs") ? "black" : "gray",
                  }}
                />
              </MDBNavbarLink>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePage("/jobs") ? "bold" : "normal",
                }}
              >
                Jobs
              </span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleMessagingClick}>
                <MDBIcon
                  fas
                  icon="message"
                  style={{
                    fontSize: "1.4rem",
                    color: isActivePage("/messaging") ? "black" : "gray",
                  }}
                />
              </MDBNavbarLink>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePage("/messaging") ? "bold" : "normal",
                }}
              >
                Messaging
              </span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleNotificationsClick}>
              <div style={{ position: "relative", display: "inline-block" }}>

                <MDBIcon
                  fas
                  icon="bell"
                  style={{
                    fontSize: "1.4rem",
                    color: isActivePage("/notifications") ? "black" : "gray",
                  }}
                />
              </div>
              </MDBNavbarLink>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePage("/notifications")
                    ? "bold"
                    : "normal",
                }}
              >
                Notifications
              </span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleProfilePageClick}>
                <MDBIcon
                  fas
                  icon="user-circle"
                  style={{
                    fontSize: "1.4rem",
                    color: isActivePage("/profile") ? "black" : "gray",
                  }}
                />
              </MDBNavbarLink>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePage("/profile") ? "bold" : "normal", // Bold text if active
                }}
              >
                Profile
              </span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleSettingsClick}>
                <MDBIcon
                  fas
                  icon="cog"
                  style={{
                    fontSize: "1.4rem",
                    color: isActivePage("/settings") ? "black" : "gray",
                  }}
                />
              </MDBNavbarLink>
              <span
                style={{
                  fontSize: "0.9rem",
                  fontWeight: isActivePage("/settings") ? "bold" : "normal",
                }}
              >
                Settings
              </span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleLogout}>
                <MDBIcon
                  fas
                  icon="sign-out-alt"
                  style={{
                    fontSize: "1.4rem",
                    color: "red",
                  }}
                />
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem", color: "red" }}>Logout</span>
            </MDBNavbarItem>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default NavbarComponent;
