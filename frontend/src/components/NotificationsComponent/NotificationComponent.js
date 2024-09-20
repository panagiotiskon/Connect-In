import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "../common/NavBar";
import AuthService from "../../api/AuthenticationAPI";
import NotificationAPI from "../../api/NotificationAPI";

import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBIcon,
  MDBBtn,
} from "mdb-react-ui-kit";
import './NotificationsComponent.scss'; // Import the SCSS file

export default function NotificationComponent() {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [commentsAndReactions, setCommentsAndReactions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);

        if (user) {
          const notifications = await NotificationAPI.getNotifications(user.id);

          const connectionRequests = notifications.filter(
            (notification) => notification.notificationType === "CONNECTION"
          );
          setConnectionRequests(connectionRequests);

          const commentsAndReactions = notifications.filter(
            (notification) =>
              notification.notificationType === "COMMENT" ||
              notification.notificationType === "REACTION"
          );
          setCommentsAndReactions(commentsAndReactions);
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
      <MDBCard className="notification-card">
        <MDBCardBody className="notification-card-body d-flex justify-content-between align-items-center">
          <div>
            <a
              onClick={() => navigate(`/profile/${userId}`)}
              className="notification-link"
            >
              {firstName} {lastName}
            </a>{" "}
            {action} your post.
          </div>
          <div className="d-flex">
            <MDBIcon fas icon={icon} size="md" className="me-3" />
            <MDBBtn
              className="btn-sm delete-button"
              color="secondary"
              onClick={() => handleDelete(id)}
            >
              <MDBIcon fas icon="times" />
            </MDBBtn>
          </div>
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
            <h2>Connection Requests</h2>
            {connectionRequests.length > 0 ? (
              connectionRequests.map((notification) => (
                <MDBCard key={notification.id} className="my-3 ">
                  <MDBCardBody className="d-flex justify-content-between align-items-center">
                    <div>
                      <a
                        onClick={() => navigate(`/profile/${notification.userId}`)}
                        className="notification-link"
                      >
                        <p style={{ display: "inline", fontWeight: "bold" }}>
                          {notification.firstName} {notification.lastName}
                        </p>
                      </a>{" "}
                      <span>wants to connect</span>
                    </div>
                    <div className="d-flex">
                      <MDBBtn
                        className="btn-sm accept-btn me-2"
                        style={{
                          backgroundColor: "#35677e"
                        }}
                        onClick={() =>
                          handleAccept(notification.userId, notification.id)
                        }
                      >
                        <MDBIcon fas icon="check" />
                      </MDBBtn>
                      <MDBBtn
                        className="btn-sm decline-btn"
                        color="danger"
                        onClick={() =>
                          handleDecline(notification.userId, notification.id)
                        }
                      >
                        <MDBIcon fas icon="times" />
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              ))
            ) : (
              <p className="connection-requests-message">
                No new connection requests
              </p>
            )}

            <h2 className="mt-5">Reactions and Comments</h2>
            {commentsAndReactions.length > 0 ? (
              commentsAndReactions.map((notification) => (
                <div key={notification.id} className="comments-reactions-section">
                  {renderCommentOrReactionMessage(notification)}
                </div>
              ))
            ) : (
              <p className="comments-reactions-message">
                No new reactions or comments
              </p>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
