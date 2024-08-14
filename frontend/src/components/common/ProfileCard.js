// ProfileCard.js
import React from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBBtn,
} from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";

const ProfileCard = ({ currentUser }) => {
  const navigate = useNavigate();

  const handleProfileClick = () =>
    navigate(`/profile/${currentUser.name}-${currentUser.surname}`);
  const handleConnectionsClick = () => navigate("/network");

  return (
    <MDBCard className="mb-4" style={{ width: "500px" }}>
      <MDBCardBody className="text-center">
        <MDBCardImage
          src={currentUser.photo}
          alt="avatar"
          className="rounded-circle"
          style={{ width: "120px", marginBottom: "1.5rem" }}
          fluid
        />
        <p
          onClick={handleProfileClick}
          style={{
            fontWeight: "bold",
            fontSize: "1.2rem",
            cursor: "pointer",
          }}
        >
          {`${currentUser.firstName} ${currentUser.lastName}`}
        </p>
        <p
          onClick={handleConnectionsClick}
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
            cursor: "pointer",
          }}
        >
          Connections
        </p>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ProfileCard;
