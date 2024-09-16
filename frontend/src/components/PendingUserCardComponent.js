import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";

const PendingUsersCardComponent = ({ user, onShowProfile }) => {
  const cardStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    padding: "16px",
    textAlign: "center",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
  };

  const profileImageStyle = {
    width: "120px",
    height: "120px",
    objectFit: "cover",
    borderRadius: "50%",
  };

  const buttonStyle = {
    margin: "4px",
    backgroundColor: "#6c757d",
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
          }}
          onClick={onShowProfile}
        >
          View Profile
        </MDBBtn>
        <MDBBtn
          style={buttonStyle}
          disabled // Disable the button to indicate pending status
        >
          Pending
        </MDBBtn>
      </div>
    </div>
  );
};

export default PendingUsersCardComponent;
