import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBRow,
  MDBCol,
  MDBBtn,
} from "mdb-react-ui-kit";

const ConnectionRequest = ({ notification, onAccept, onDecline }) => {
  const navigate = useNavigate();

  return (
    <MDBCard className="mb-3" style={{ maxWidth: "540px" }}>
      <MDBRow className="g-0">
        <MDBCol md="12">
          <MDBCardBody>
            <MDBCardTitle
              style={{ cursor: "pointer", fontWeight: "bold" }} // Make text bold
              onClick={() => navigate(`/profile/${notification.userId}`)} // Navigate to profile
            >
              {notification.firstName} {notification.lastName} wants to connect
            </MDBCardTitle>
            <MDBBtn
              color="success"
              onClick={() => onAccept(notification.userId)}
            >
              Accept
            </MDBBtn>
            <MDBBtn
              color="danger"
              className="ms-2"
              onClick={() => onDecline(notification.userId)}
            >
              Decline
            </MDBBtn>
          </MDBCardBody>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
};

export default ConnectionRequest;
