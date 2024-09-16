import { useNavigate, useLocation } from "react-router-dom";
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
  const location = useLocation();

  const handleLogoutClick = () => {
    AuthService.logout();
    navigate("/");
  };

  const handleGoBackClick = () => {
    navigate("/admin");
  }

  const isProfilePage = location.pathname.startsWith("/profile");

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer fluid className="navbar-container">
        {/* Logo Section */}
        <img
          src={ConnectInLogo}
          alt="ConnectIn Logo"
          className="navbar-logo"
        />
        <MDBCollapse className="navbar-collapse">
          <MDBNavbarNav className="navbar-nav">
            {isProfilePage && (
              <MDBBtn
                color="secondary"
                className="d-flex align-items-center me-2"
                onClick={handleGoBackClick}
              >
                <MDBIcon fas icon="arrow-left" className="me-2" />
                Go Back
              </MDBBtn>
            )}
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