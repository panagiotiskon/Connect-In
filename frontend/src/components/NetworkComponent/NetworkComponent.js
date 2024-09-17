import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import NavbarComponent from "../common/NavBar";
import ConnectedUsersCardComponent from "./ConnectedUsersCardComponent";
import RegisteredUsersCardComponent from "./RegisteredUsersCardComponent";
import ConnectionAPI from "../../api/ConnectionAPI";
import NotificationAPI from "../../api/NotificationAPI";
import AuthService from "../../api/AuthenticationAPI";
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

  const fetchUserData = async () => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      const currentUserId = currentUser?.id;

      if (currentUserId) {
        const connectionsResponse = await ConnectionAPI.getUserConnections(currentUserId);
        const pendingConnectionsResponse = await ConnectionAPI.getUserPendingConnections(currentUserId);

        setConnectedUsers(connectionsResponse);
        setPendingUsers(pendingConnectionsResponse);

        const combinedUsers = [...connectionsResponse, ...pendingConnectionsResponse];
        setDisplayedUsers(combinedUsers);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterUsers = async () => {
    const currentUser = await AuthService.getCurrentUser();
    const currentUserId = currentUser?.id;

    if (searchTerm.trim() === "") {
      const combinedUsers = [...connectedUsers, ...pendingUsers];
      setDisplayedUsers(combinedUsers);
      setShowRegisteredUsers(false);
    } else {
      try {
        const filteredRegisteredUsers = await ConnectionAPI.getRegisteredUsers(searchTerm, currentUserId);
        setDisplayedUsers(filteredRegisteredUsers);
        setShowRegisteredUsers(true);
      } catch (error) {
        console.error("Error fetching filtered registered users:", error);
      }
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [searchTerm, connectedUsers, pendingUsers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      setSearchTerm(e.target.value);
    }
  };

  const handleConnect = async (connectionUserId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      const currentUserId = currentUser?.id;

      if (currentUserId) {
        await ConnectionAPI.requestToConnect(currentUserId, connectionUserId);
        console.log("Connection request sent to user ID:", connectionUserId);

        await NotificationAPI.createNotification(connectionUserId, "CONNECTION", currentUserId);
        console.log("Notification sent for connection to user ID:", connectionUserId);

        await fetchUserData(); // Refresh user data after the connection request
      }
    } catch (error) {
      console.error("Error sending connection request or notification:", error);
    }
  };

  const handleMessage = async (connectedUserId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      const currentUserId = currentUser?.id;

      if (currentUserId) {
        await MessagingAPI.createConversation(currentUserId, connectedUserId);
        console.log("Conversation created between user ID:", currentUserId, "and user ID:", connectedUserId);

        navigate(`/messaging`);
      }
    } catch (error) {
      console.error("Error creating conversation or navigating to messaging page:", error);
    }
  };

  const handleShowProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const handleDeleteConnection = async (connectionUserId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      const currentUserId = currentUser?.id;

      if (currentUserId) {
        await ConnectionAPI.deleteConnection(currentUserId, connectionUserId);
        console.log("Connection deleted for user ID:", connectionUserId);

        await fetchUserData(); 
      }
    } catch (error) {
      console.error("Error deleting connection:", error);
    }
  };

  const handleDeletePendingConnection = async (connectionUserId) => {
    try {
      const currentUser = await AuthService.getCurrentUser();
      const currentUserId = currentUser?.id;

      if (currentUserId) {
        await ConnectionAPI.deleteConnection(currentUserId, connectionUserId);
        await NotificationAPI.deleteNotification(connectionUserId, currentUserId);
        await fetchUserData(); 
      }
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
              <MDBCol md="6" className="search-bar-ctm d-flex justify-content-center mx-auto"
                style={{
                  backgroundColor: 'white',
                  padding: '0',
                  boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
                }}>
                <MDBInput style={{ marginBottom: '0', padding: '10px' }}
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
                        onDeletePending={() => handleDeletePendingConnection(user.userId)}
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
