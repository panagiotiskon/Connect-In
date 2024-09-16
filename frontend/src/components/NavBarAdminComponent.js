import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarNav,
  MDBIcon,
  MDBCollapse,
  MDBBtn,
} from "mdb-react-ui-kit";
import ConnectInLogo from "../assets/ConnectIn.png"; // Adjust the path if needed
import AuthService from "../api/AuthenticationAPI"; // Import the AuthenticationAPI service
import "../components/NavBarAdminComponent.scss"

const NavBarAdminComponent = () => {
  const navigate = useNavigate();

  // Handle logout and redirect to login page
  const handleLogoutClick = () => {
    AuthService.logout(); // Call the logout method to clear the user data
    navigate("/"); // Redirect to login page
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer fluid className="navbar-container">
        {/* Logo Section */}
        <img
          src={ConnectInLogo}
          alt="ConnectIn Logo"
          className="navbar-logo"
        />
        <MDBCollapse  className="navbar-collapse">
          <MDBNavbarNav className="navbar-nav">
            <MDBBtn
              color="danger"
              className="d-flex align-items-center "
              onClick={handleLogoutClick} 
            >
              <MDBIcon fas icon="sign-out-alt" className="me-2" />
              Logout
            </MDBBtn>
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default NavBarAdminComponent;