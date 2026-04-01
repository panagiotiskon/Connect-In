import React, { useState, useEffect, useCallback } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import NavbarComponent from "../common/NavBar";
import ConnectedUsersCardComponent from "./ConnectedUsersCardComponent";
import RegisteredUsersCardComponent from "./RegisteredUsersCardComponent";
import ConnectionAPI from "../../api/ConnectionAPI";
import NotificationAPI from "../../api/NotificationAPI";
import { useAuth } from "../../context/AuthContext";
import MessagingAPI from "../../api/MessagingAPI";
import { useNavigate } from "react-router-dom";
import PendingUsersCardComponent from "./PendingUserCardComponent";
import "./NetworkComponent.scss";

const NetworkComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id;

  const fetchUserData = useCallback(async () => {
    if (!currentUserId) return;

    try {
      const connectionsResponse = await ConnectionAPI.getUserConnections(
        currentUserId
      );
      const pendingConnectionsResponse =
        await ConnectionAPI.getUserPendingConnections(currentUserId);

      setConnectedUsers(connectionsResponse);
      setPendingUsers(pendingConnectionsResponse);

      const combinedUsers = [
        ...connectionsResponse,
        ...pendingConnectionsResponse,
      ];
      setDisplayedUsers(combinedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  }, [currentUserId]);

  const filterUsers = useCallback(async () => {
    if (!currentUserId) return;

    if (searchTerm.trim() === "") {
      const combinedUsers = [...connectedUsers, ...pendingUsers];
      setDisplayedUsers(combinedUsers);
      setShowRegisteredUsers(false);
    } else {
      try {
        const filteredRegisteredUsers = await ConnectionAPI.getRegisteredUsers(
          searchTerm,
          currentUserId
        );
        setDisplayedUsers(filteredRegisteredUsers);
        setShowRegisteredUsers(true);
      } catch (error) {
        console.error("Error fetching filtered registered users:", error);
      }
    }
  }, [searchTerm, connectedUsers, pendingUsers, currentUserId]);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);

  useEffect(() => {
    filterUsers();
  }, [filterUsers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value);
    }
  };

  const handleConnect = async (connectionUserId) => {
    if (!currentUserId) return;

    try {
      await ConnectionAPI.requestToConnect(currentUserId, connectionUserId);

      await NotificationAPI.createNotification(
        connectionUserId,
        "CONNECTION",
        currentUserId
      );

      await fetchUserData();
    } catch (error) {
      console.error("Error sending connection request or notification:", error);
    }
  };

  const handleMessage = async (connectedUserId) => {
    if (!currentUserId) return;

    try {
      await MessagingAPI.createConversation(currentUserId, connectedUserId);
      navigate(`/messaging`);
    } catch (error) {
      console.error(
        "Error creating conversation or navigating to messaging page:",
        error
      );
    }
  };

  const handleShowProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleDeleteConnection = async (connectionUserId) => {
    if (!currentUserId) return;

    try {
      await ConnectionAPI.deleteConnection(currentUserId, connectionUserId);
      await fetchUserData();
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  const handleDeletePendingConnection = async (connectionUserId) => {
    if (!currentUserId) return;

    try {
      await ConnectionAPI.deleteConnection(currentUserId, connectionUserId);
      await NotificationAPI.deleteNotification(
        connectionUserId,
        currentUserId
      );
      await fetchUserData();
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="container-fluid">
        {isLoading ? (
          <div className="loading-message">Loading...</div>
        ) : (
          <>
            <MDBRow className="mb-5 pt-5">
              <MDBCol
                md="6"
                className="search-bar-ctm d-flex justify-content-center mx-auto"
                style={{
                  backgroundColor: "white",
                  padding: "0",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
                }}
              >
                <MDBInput
                  style={{ marginBottom: "0", padding: "10px" }}
                  label="Search users"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyPress}
                />
              </MDBCol>
            </MDBRow>
            <div className="card-container-network">
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <div key={user.userId} className="card-network">
                    {showRegisteredUsers ? (
                      <RegisteredUsersCardComponent
                        user={{
                          id: user.userId,
                          profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          job: user.jobTitle,
                          companyName: user.companyName,
                          connections: user.connections,
                        }}
                        onConnect={() => handleConnect(user.userId)}
                        onShowProfile={() => handleShowProfile(user.userId)}
                      />
                    ) : user.isPending ? (
                      <PendingUsersCardComponent
                        user={{
                          id: user.userId,
                          profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          job: user.jobTitle,
                          companyName: user.companyName,
                        }}
                        onShowProfile={() => handleShowProfile(user.userId)}
                        onDeletePending={() =>
                          handleDeletePendingConnection(user.userId)
                        }
                      />
                    ) : (
                      <ConnectedUsersCardComponent
                        user={{
                          id: user.userId,
                          profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          job: user.jobTitle,
                          companyName: user.companyName,
                          isConnected: true,
                          connections: user.connections,
                        }}
                        onMessage={() => handleMessage(user.userId)}
                        onShowProfile={() => handleShowProfile(user.userId)}
                        onDelete={() => handleDeleteConnection(user.userId)}
                      />
                    )}
                  </div>
                ))
              ) : (
                <div className="no-users-found">
                  <div>No users found</div>
                </div>
              )}
            </div>
          </>
        )}
      </MDBContainer>
    </div>
  );
};

export default NetworkComponent;
