import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./common/NavBar";
import AuthService from "../api/AuthenticationAPI"; // Adjust the import path as needed
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardImage,
  MDBBtn,
} from "mdb-react-ui-kit";

// Mock users list
const mockUsers = [
  AuthService.getCurrentUser(),
  AuthService.getCurrentUser(),
  AuthService.getCurrentUser(),
];

// Mock notifications list
const mockNotifications = [
  {
    id: 1,
    type: "like",
    message: "Stelios liked your post",
    postTitle: "Post 1 Title",
  },
  {
    id: 2,
    type: "comment",
    message: "Maria commented on your post",
    postTitle: "Post 2 Title",
  },
  // Add more notifications as needed
];

const ConnectionRequest = ({ user, onAccept, onDecline }) => {
  const navigate = useNavigate();

  return (
    <MDBCard className="mb-3" style={{ maxWidth: "540px" }}>
      <MDBRow className="g-0">
        <MDBCol md="4">
          <MDBCardImage
            src={user.photo}
            alt={`${user.name} ${user.surname}`}
            className="img-fluid rounded-start"
            style={{ width: "100px", height: "120px", objectFit: "cover" }}
          />
        </MDBCol>
        <MDBCol md="8">
          <MDBCardBody>
            <MDBCardTitle
              style={{ cursor: "pointer" }}
              onClick={() => navigate(`/profile/${user.email}`)}
            >
              {user.name} {user.surname}
            </MDBCardTitle>
            <MDBBtn color="success" onClick={() => onAccept(user.email)}>
              Accept
            </MDBBtn>
            <MDBBtn
              color="danger"
              className="ms-2"
              onClick={() => onDecline(user.email)}
            >
              Decline
            </MDBBtn>
          </MDBCardBody>
        </MDBCol>
      </MDBRow>
    </MDBCard>
  );
};

const PostNotification = ({ notification }) => (
  <MDBCard className="mb-3" style={{ maxWidth: "540px" }}>
    <MDBCardBody>
      <MDBCardTitle>{notification.message}</MDBCardTitle>
      <p>
        <strong>Post:</strong> {notification.postTitle}
      </p>
    </MDBCardBody>
  </MDBCard>
);

export default function NotificationComponent() {
  const [users, setUsers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch current user or connection requests
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      // Simulate fetching connection requests and notifications from the current user
      // Replace mockUsers and mockNotifications with actual data fetching logic as needed
      setUsers(mockUsers);
      setNotifications(mockNotifications);
    } else {
      // Handle case where no user is logged in
      console.error("No user is logged in");
    }
  }, []);

  const handleAccept = (userId) => {
    // Logic to handle accepting a request
    console.log("Accepted:", userId);
  };

  const handleDecline = (userId) => {
    // Logic to handle declining a request
    console.log("Declined:", userId);
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow>
          <MDBCol md="8" className="mx-auto">
            <h2>Connection Requests</h2>
            {users.length > 0 ? (
              users.map((user) => (
                <ConnectionRequest
                  key={user.email} // Assuming email is unique, change to user.id if available
                  user={user}
                  onAccept={handleAccept}
                  onDecline={handleDecline}
                />
              ))
            ) : (
              <p style={{ padding: "20px", textAlign: "center" }}>
                No new connection requests
              </p>
            )}

            <h2 className="mt-5">Post Notifications</h2>
            {notifications.length > 0 ? (
              notifications.map((notification) => (
                <PostNotification
                  key={notification.id}
                  notification={notification}
                />
              ))
            ) : (
              <p style={{ padding: "20px", textAlign: "center" }}>
                No new post notifications
              </p>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
