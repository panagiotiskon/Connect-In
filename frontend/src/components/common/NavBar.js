import React, { useState, useEffect } from "react";
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
  MDBNavbarToggler,
  MDBBadge, // Import MDBBadge for notifications
} from "mdb-react-ui-kit";
import ConnectInLogo from "../../assets/ConnectIn.png"; // Adjust the path if needed
import AuthService from "../../api/AuthenticationAPI";
import NotificationAPI from "../../api/NotificationAPI"; // Import NotificationAPI

const NavbarComponent = () => {
  const navigate = useNavigate();
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0); // State for notification count
  const [currentUser, setCurrentUser] = useState(null); // State for current user

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchNotificationCount = async () => {
      try {
        if (currentUser && currentUser.id) {
          const count = await NotificationAPI.getNumberOfNotifications(
            currentUser.id
          );
          setNotificationCount(count);
        }
      } catch (error) {
        console.error("Error fetching notification count:", error);
      }
    };

    fetchNotificationCount();
  }, [currentUser]);

  const handleHomeClick = () => navigate("/home");
  const handleNetworkClick = () => navigate("/network");
  const handleJobsClick = () => navigate("/jobs");
  const handleMessagingClick = () => navigate("/messaging");
  const handleNotificationsClick = () => navigate("/notifications");
  const handleProfilePageClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/settings");

  const handleLogout = () => {
    AuthService.logout();
    navigate("/"); // Redirect to login page after logout
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
              <MDBNavbarLink
                active
                aria-current="page"
                onClick={handleHomeClick}
              >
                <MDBIcon fas icon="home" style={{ fontSize: "1.4rem" }} />
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem" }}>Home</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleNetworkClick}>
                <MDBIcon fas icon="users" style={{ fontSize: "1.4rem" }} />
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem" }}>Network</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleJobsClick}>
                <MDBIcon fas icon="suitcase" style={{ fontSize: "1.4rem" }} />
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem" }}>Jobs</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleMessagingClick}>
                <MDBIcon fas icon="message" style={{ fontSize: "1.4rem" }} />
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem" }}>Messaging</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink
                onClick={handleNotificationsClick}
                style={{ position: "relative", cursor: "pointer" }} // Ensure cursor is pointer
              >
                <MDBIcon
                  fas
                  icon="bell" // Changed to bell icon
                  style={{ fontSize: "1.4rem" }}
                />
                {notificationCount > 0 && (
                  <MDBBadge
                    pill
                    color="danger"
                    style={{
                      position: "absolute",
                      top: "-6px",
                      right: "-10px",
                      fontSize: "0.8rem",
                      minWidth: "20px",
                      textAlign: "center",
                    }}
                  >
                    {notificationCount}
                  </MDBBadge>
                )}
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem" }}>Notifications</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleProfilePageClick}>
                <MDBIcon
                  fas
                  icon="user-circle"
                  style={{ fontSize: "1.4rem" }}
                />
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem" }}>Profile</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleSettingsClick}>
                <MDBIcon fas icon="cog" style={{ fontSize: "1.4rem" }} />
              </MDBNavbarLink>
              <span style={{ fontSize: "0.9rem" }}>Settings</span>
            </MDBNavbarItem>
            <MDBNavbarItem className="d-flex flex-column align-items-center navbar-nav-item">
              <MDBNavbarLink onClick={handleLogout}>
                <MDBIcon
                  fas
                  icon="sign-out-alt"
                  style={{ fontSize: "1.4rem", color: "red" }}
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
