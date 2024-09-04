// UserCard.js
import React from "react";
import { MDBCard, MDBCardBody, MDBCardImage, MDBBtn } from "mdb-react-ui-kit";

const UserCard = ({ user, onConnect, onShowProfile }) => {
  const { profileImage, firstName, lastName, job, isConnected } = user;

  return (
    <MDBCard
      className="mb-3"
      style={{ width: "350px", margin: "15px", padding: "0" }}
    >
      <MDBCardBody className="text-center d-flex flex-column align-items-center">
        {/* Profile Picture */}
        <MDBCardImage
          src={profileImage || "/path/to/default-image.png"}
          className="rounded-circle"
          style={{
            width: "120px",
            height: "120px",
            objectFit: "cover",
            marginBottom: "1rem",
          }}
          fluid
        />
        {/* Name and Surname */}
        <p
          className="mt-2"
          style={{
            fontWeight: "bold",
            fontSize: "1.4rem",
            marginBottom: "0.5rem",
          }}
        >
          {`${firstName} ${lastName}`}
        </p>
        {/* Job Title */}
        <p style={{ marginBottom: "1rem" }}>{job}</p>
        {/* Action Button */}
        {isConnected ? (
          <MDBBtn color="primary" onClick={onShowProfile}>
            Show Profile
          </MDBBtn>
        ) : (
          <MDBBtn color="success" onClick={onConnect}>
            Connect
          </MDBBtn>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default UserCard;
