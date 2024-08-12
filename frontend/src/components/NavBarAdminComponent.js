import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBIcon,
  MDBCollapse,
  MDBBtn,
} from "mdb-react-ui-kit";
import ConnectInLogo from "../assets/ConnectIn.png"; // Adjust the path if needed
import AuthService from "../api/AuthenticationAPI";

const NavBarAdminComponent = () => {
  const navigate = useNavigate();
  const [openNavSecond, setOpenNavSecond] = useState(false);
  const currentUser = AuthService.getCurrentUser();

  const handleLogoutClick = () => {
    navigate("/logout");
  };

  return (
    <MDBNavbar expand="lg" light bgColor="light">
      <MDBContainer
        fluid
        className="d-flex justify-content-between align-items-center"
      >
        {/* Logo Section */}
        <img
          src={ConnectInLogo}
          alt="ConnectIn Logo"
          style={{ width: "200px", height: "auto", marginLeft: "60px" }}
        />

        {/* Toggler for small screens */}
        <MDBNavbarToggler
          aria-expanded="false"
          aria-label="Toggle navigation"
          onClick={() => setOpenNavSecond(!openNavSecond)}
        >
          <MDBIcon icon="bars" fas />
        </MDBNavbarToggler>

        {/* Collapsible Section */}
        <MDBCollapse navbar open={openNavSecond}>
          <MDBNavbarNav className="w-100 d-flex justify-content-end">
            {/* Logout Button Section */}
            <MDBBtn
              color="danger"
              className="d-flex align-items-center"
              style={{ marginLeft: "1500px" }}
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
