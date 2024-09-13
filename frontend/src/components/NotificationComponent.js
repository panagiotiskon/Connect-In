import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import NavbarComponent from "./common/NavBar";
import AuthService from "../api/AuthenticationAPI"; // Adjust the import path as needed
import NotificationAPI from "../api/NotificationAPI"; // Import the Notification API
import FooterComponent from "./common/FooterComponent";
import ConnectionRequest from "./ConnectionRequest"; // Import the ConnectionRequest component
import { MDBContainer, MDBRow, MDBCol } from "mdb-react-ui-kit";

export default function NotificationComponent() {
  const [connectionRequests, setConnectionRequests] = useState([]);
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

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow>
          <MDBCol md="8" className="mx-auto">
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
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
