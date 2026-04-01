import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import NavbarComponent from "../common/NavBar";
import { useAuth } from "../../context/AuthContext";
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
import './NotificationsComponent.scss';

export default function NotificationComponent() {
  const [connectionRequests, setConnectionRequests] = useState([]);
  const [commentsAndReactions, setCommentsAndReactions] = useState([]);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!currentUser) return;

      try {
        const notifications = await NotificationAPI.getNotifications(currentUser.id);

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
      } catch (error) {
        console.error("Error fetching notifications:", error);
      }
    };

    fetchNotifications();
  }, [currentUser]);

  const handleAccept = async (userId, notificationId) => {
    try {
      await NotificationAPI.acceptNotification(currentUser.id, notificationId);
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
            <Link
              to={`/profile/${userId}`}
              className="notification-link"
            >
              {firstName} {lastName}
            </Link>{" "}
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
                      <Link
                        to={`/profile/${notification.userId}`}
                        className="notification-link"
                      >
                        <p style={{ display: "inline", fontWeight: "bold" }}>
                          {notification.firstName} {notification.lastName}
                        </p>
                      </Link>{" "}
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
