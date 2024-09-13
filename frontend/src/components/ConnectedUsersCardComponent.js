import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";

const ConnectedUsersCardComponent = ({
  user,
  onConnect,
  onShowProfile,
  onMessage,
}) => {
  const cardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff", // White background color
  };

  const profileImageStyle = {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "50%",
  };

  const buttonStyle = {
    margin: "4px",
  };

  const nameStyle = {
    fontWeight: "bold",
    fontSize: "1.25rem", // Adjust the font size as needed
  };

  const jobStyle = {
    fontWeight: "bold",
    fontSize: "1rem", // Smaller than the name
  };

  const companyStyle = {
    fontSize: "0.8rem", // Smaller font size for company name
  };

  return (
    <div className="d-flex flex-column align-items-center" style={cardStyle}>
      <img
        src={user.profileImage}
        alt={`${user.firstName} ${user.lastName}`}
        style={profileImageStyle}
      />
      <h5 className="mt-3" style={nameStyle}>
        {`${user.firstName} ${user.lastName}`}
      </h5>
      {user.job && <p style={jobStyle}>{user.job}</p>}
      {user.companyName && <p style={companyStyle}>{user.companyName}</p>}
      <div className="d-flex gap-2">
        <MDBBtn
          style={{
            ...buttonStyle,
            backgroundColor: "#007bff",
            color: "#ffffff",
          }} // Primary color
          onClick={onShowProfile}
        >
          View Profile
        </MDBBtn>
        <MDBBtn
          style={{
            ...buttonStyle,
            backgroundColor: "#17a2b8",
            color: "#ffffff",
          }} // Info color
          onClick={onMessage}
        >
          Message
        </MDBBtn>
      </div>
      {user.isConnected ? (
        <MDBBtn
          style={{
            ...buttonStyle,
            backgroundColor: "#28a745",
            color: "#ffffff",
          }} // Success color
          disabled
        >
          Connected
        </MDBBtn>
      ) : (
        <MDBBtn
          style={{
            ...buttonStyle,
            backgroundColor: "#6c757d",
            color: "#ffffff",
          }} // Secondary color
          onClick={onConnect}
        >
          Connect
        </MDBBtn>
      )}
    </div>
  );
};

export default ConnectedUsersCardComponent;
