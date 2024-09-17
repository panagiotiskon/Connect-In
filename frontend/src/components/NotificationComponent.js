import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./common/NavBar";
import AuthService from "../api/AuthenticationAPI"; // Adjust the import path as needed
import NotificationAPI from "../api/NotificationAPI"; // Import the Notification API
import FooterComponent from "./common/FooterComponent";
import ConnectionRequest from "./ConnectionRequest"; // Import the ConnectionRequest component
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn, // Import MDBBtn for the delete button
} from "mdb-react-ui-kit"; // Import MDBCard and MDBIcon

export default function NotificationComponent() {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [commentsAndReactions, setCommentsAndReactions] = useState([]); // New state for comments and reactions
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);

        if (user) {
          const notifications = await NotificationAPI.getNotifications(user.id);

          // Filter for connection requests
          const connectionRequests = notifications.filter(
            (notification) => notification.notificationType === "CONNECTION"
          );
          setConnectionRequests(connectionRequests);

          // Filter for comments and reactions
          const commentsAndReactions = notifications.filter(
            (notification) =>
              notification.notificationType === "COMMENT" ||
              notification.notificationType === "REACTION"
          );
          setCommentsAndReactions(commentsAndReactions); // Set comments and reactions in state
        }
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, []);

  const handleAccept = async (userId, notificationId) => {
    try {
      await NotificationAPI.acceptNotification(currentUser.id, notificationId);
      console.log("Accepted:", userId);
      // Optionally, remove the accepted notification from the state
      setConnectionRequests((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error accepting notification:", error);
    }
  };

  const handleDecline = async (userId, notificationId) => {
    try {
      await NotificationAPI.declineNotification(currentUser.id, notificationId);
      console.log("Declined:", userId);
      // Optionally, remove the declined notification from the state
      setConnectionRequests((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error declining notification:", error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await NotificationAPI.deleteNotificationById(notificationId);
      console.log("Deleted:", notificationId);
      // Optionally, remove the deleted notification from the state
      setCommentsAndReactions((prev) =>
        prev.filter((notification) => notification.id !== notificationId)
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const renderCommentOrReactionMessage = (notification) => {
    const { firstName, lastName, userId, notificationType, id } = notification;
    const action =
      notificationType === "REACTION" ? "reacted to" : "commented on";
    const icon = notificationType === "REACTION" ? "thumbs-up" : "comment";

    return (
      <MDBCard className="mt-3 position-relative">
        <MDBCardBody className="d-flex align-items-center justify-content-between">
          <div>
            <href
              onClick={() => navigate(`/profile/${userId}`)}
              style={{
                cursor: "pointer",
                fontWeight: "bold",
                textDecoration: "none", // Ensure no underline
              }}
            >
              {firstName} {lastName}
            </href>{" "}
            {action} your post.
          </div>
          <MDBIcon fas icon={icon} size="lg" />
          <MDBIcon
            fas
            icon="times"
            size="lg"
            className="position-absolute top-0 end-0 mt-2 me-1"
            style={{ cursor: "pointer" }}
            onClick={() => handleDelete(id)}
          />
        </MDBCardBody>
      </MDBCard>
    );
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow>
          <MDBCol md="8" className="mx-auto">
            {/* Connection Requests */}
            <h2>Connection Requests</h2>
            {connectionRequests.length > 0 ? (
              connectionRequests.map((notification) => (
                <ConnectionRequest
                  key={notification.id} // Use notification id as a unique key
                  notification={notification}
                  onAccept={() =>
                    handleAccept(notification.userId, notification.id)
                  }
                  onDecline={() =>
                    handleDecline(notification.userId, notification.id)
                  }
                />
              ))
            ) : (
              <p style={{ padding: "20px", textAlign: "center" }}>
                No new connection requests
              </p>
            )}

            {/* Section for Comments and Reactions */}
            <h2 className="mt-5">Reactions and Comments</h2>
            {commentsAndReactions.length > 0 ? (
              commentsAndReactions.map((notification) => (
                <div key={notification.id} style={{ padding: "10px 0" }}>
                  {renderCommentOrReactionMessage(notification)}
                </div>
              ))
            ) : (
              <p style={{ padding: "20px", textAlign: "center" }}>
                No new reactions or comments
              </p>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
