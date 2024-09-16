import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import NavbarComponent from "./common/NavBar";
import ConnectedUsersCardComponent from "./ConnectedUsersCardComponent";
import RegisteredUsersCardComponent from "./RegisteredUsersCardComponent";
import ConnectionAPI from "../api/ConnectionAPI";
import NotificationAPI from "../api/NotificationAPI"; // Import the NotificationAPI
import AuthService from "../api/AuthenticationAPI";
import MessagingAPI from "../api/MessagingAPI"; // Import the MessagingAPI
import { useNavigate } from "react-router-dom";
import PendingUsersCardComponent from "./PendingUserCardComponent";

const NetworkComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [displayedUsers, setDisplayedUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegisteredUsers, setShowRegisteredUsers] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        const currentUserId = currentUser?.id;

        if (currentUserId) {
          const connectionsResponse = await ConnectionAPI.getUserConnections(
            currentUserId
          );
          setConnectedUsers(connectionsResponse);

          const pendingConnectionsResponse =
            await ConnectionAPI.getUserPendingConnections(currentUserId);
          setPendingUsers(pendingConnectionsResponse);

          const combinedUsers = [
            ...connectionsResponse,
            ...pendingConnectionsResponse,
          ];
          setDisplayedUsers(combinedUsers);
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    const filterUsers = async () => {
      const currentUser = await AuthService.getCurrentUser();
      const currentUserId = currentUser?.id;

      if (searchTerm.trim() === "") {
        const combinedUsers = [...connectedUsers, ...pendingUsers];
        setDisplayedUsers(combinedUsers);
        setShowRegisteredUsers(false);
      } else {
        try {
          // Fetch and display filtered registered users based on search term
          const filteredRegisteredUsers =
            await ConnectionAPI.getRegisteredUsers(searchTerm, currentUserId);

          setDisplayedUsers(filteredRegisteredUsers);
          setShowRegisteredUsers(true);
        } catch (error) {
          console.error("Error fetching filtered registered users:", error);
        }
      }
    };

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
        // Send connection request
        await ConnectionAPI.requestToConnect(currentUserId, connectionUserId);
        console.log("Connection request sent to user ID:", connectionUserId);

        // Send notification with the type 'CONNECTION'
        await NotificationAPI.createNotification(
          connectionUserId,
          "CONNECTION",
          currentUserId
        );
        console.log(
          "Notification sent for connection to user ID:",
          connectionUserId
        );

        // Optionally update UI or show a success message
        setDisplayedUsers((prevUsers) =>
          prevUsers.filter((user) => user.userId !== connectionUserId)
        );
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
        // Create a conversation between currentUserId and connectedUserId
        await MessagingAPI.createConversation(currentUserId, connectedUserId);
        console.log(
          "Conversation created between user ID:",
          currentUserId,
          "and user ID:",
          connectedUserId
        );

        // Redirect to the messaging page with the selected user ID
        navigate(`/messaging`);
      }
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

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            <MDBRow className="mb-4">
              <MDBCol md="8" className="d-flex justify-content-center mx-auto">
                <MDBInput
                  label="Search users"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  onKeyDown={handleSearchKeyPress} // Trigger search on Enter key press
                  className="search-bar"
                  style={{
                    width: "100%",
                    maxWidth: "600px",
                    height: "50px",
                  }}
                />
              </MDBCol>
            </MDBRow>
            <MDBRow className="gx-3 gy-4 justify-content-start">
              {displayedUsers.length > 0 ? (
                displayedUsers.map((user) => (
                  <MDBCol
                    key={user.userId}
                    xs="12"
                    sm="6"
                    md="4"
                    lg="3"
                    xl="2"
                    className="d-flex align-items-stretch"
                  >
                    {showRegisteredUsers ? (
                      <RegisteredUsersCardComponent
                        user={{
                          id: user.userId,
                          profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          job: user.jobTitle,
                          companyName: user.companyName,
                          connections: user.connections, // Pass connections
                        }}
                        onConnect={() => handleConnect(user.userId)}
                        onShowProfile={() => handleShowProfile(user.userId)}
                      />
                    ) : user.isPending ? (
                      <PendingUsersCardComponent // Render the pending card for pending users
                        user={{
                          id: user.userId,
                          profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          job: user.jobTitle,
                          companyName: user.companyName,
                        }}
                        onShowProfile={() => handleShowProfile(user.userId)}
                      />
                    ) : (
                      <ConnectedUsersCardComponent // Render the connected users' card
                        user={{
                          id: user.userId,
                          profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                          firstName: user.firstName,
                          lastName: user.lastName,
                          job: user.jobTitle,
                          companyName: user.companyName,
                          isConnected: true, // Ensure connected users have isConnected set to true
                          connections: user.connections, // Pass connections
                        }}
                        onMessage={() => handleMessage(user.userId)}
                        onShowProfile={() => handleShowProfile(user.userId)}
                      />
                    )}
                  </MDBCol>
                ))
              ) : (
                <MDBCol xs="12" className="text-center">
                  <div>No users found</div>
                </MDBCol>
              )}
            </MDBRow>
          </>
        )}
      </MDBContainer>
    </div>
  );
};

export default NetworkComponent;
