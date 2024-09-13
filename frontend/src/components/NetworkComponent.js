import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import NavbarComponent from "./common/NavBar";
import ConnectedUsersCardComponent from "./ConnectedUsersCardComponent";
import RegisteredUsersCardComponent from "./RegisteredUsersCardComponent";
import ConnectionAPI from "../api/ConnectionAPI"; // Adjust the path as needed
import AuthService from "../api/AuthenticationAPI"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

const NetworkComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [registeredUsers, setRegisteredUsers] = useState([]);
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
          // Fetch connected users
          const connectionsResponse = await ConnectionAPI.getUserConnections(
            currentUserId
          );
          setConnectedUsers(connectionsResponse);

          // Fetch registered users (unconnected)
          const registeredResponse = await ConnectionAPI.getRegisteredUsers();
          setRegisteredUsers(registeredResponse);

          // By default, show connected users
          setDisplayedUsers(connectionsResponse);
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
        // Show connected users when search term is empty
        setDisplayedUsers(connectedUsers);
        setShowRegisteredUsers(false);
      } else {
        try {
          // Fetch and display filtered registered users based on search term
          const filteredRegisteredUsers =
            await ConnectionAPI.getRegisteredUsers(searchTerm, currentUserId);

          // Exclude users who are already connected
          const connectedUserIds = new Set(
            connectedUsers.map((user) => user.userId)
          );
          const filteredUsers = filteredRegisteredUsers.filter(
            (user) => !connectedUserIds.has(user.userId)
          );

          setDisplayedUsers(filteredUsers);
          setShowRegisteredUsers(true);
        } catch (error) {
          console.error("Error fetching filtered registered users:", error);
        }
      }
    };

    filterUsers();
  }, [searchTerm, connectedUsers]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyPress = (e) => {
    if (e.key === "Enter") {
      // Trigger search when Enter key is pressed
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

        // Optionally update UI or show a success message
        // For example, you might want to remove this user from the displayed list
        setDisplayedUsers((prevUsers) =>
          prevUsers.filter((user) => user.userId !== connectionUserId)
        );
      }
    } catch (error) {
      console.error("Error sending connection request:", error);
    }
  };

  const handleMessage = (userId) => {
    console.log("Message user ID:", userId);
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
                        }}
                        onConnect={() => handleConnect(user.userId)}
                        onShowProfile={() => handleShowProfile(user.userId)}
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
                          isConnected: true, // Ensure connected users have isConnected set to true
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
