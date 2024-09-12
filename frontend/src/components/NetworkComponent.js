import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import NavbarComponent from "./common/NavBar";
import UserCardNetworkComponent from "./NetworkCardComponent"; // New component
import ConnectionAPI from "../api/ConnectionAPI"; // Adjust the path as needed
import AuthService from "../api/AuthenticationAPI"; // Adjust the path as needed
import { useNavigate } from "react-router-dom";

const NetworkComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchUserConnections = async () => {
      try {
        const currentUser = await AuthService.getCurrentUser();
        const currentUserId = currentUser?.id; // Get the current user ID

        if (currentUserId) {
          const response = await ConnectionAPI.getUserConnections(
            currentUserId
          );
          console.log(response); // Log the response to debug

          // Assuming response is a list of user objects
          const updatedUsers = response.map((user) => ({
            ...user,
            isConnected: true, // Set based on your logic
          }));

          setUsers(updatedUsers);
          setFilteredUsers(updatedUsers);
        }
      } catch (error) {
        console.error("Error fetching user connections:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching data
      }
    };

    fetchUserConnections();
  }, []); // Empty dependency array means this runs once on mount

  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase().trim();
    const searchTerms = searchTermLower.split(" ");

    const filtered = users
      .filter((user) => {
        if (!user || !user.firstName || !user.lastName) {
          return false; // Skip any user with missing data
        }

        const firstNameLower = user.firstName.toLowerCase();
        const lastNameLower = user.lastName.toLowerCase();

        if (searchTerms.length === 1) {
          return firstNameLower.startsWith(searchTerms[0]);
        } else if (searchTerms.length >= 2) {
          return (
            firstNameLower.startsWith(searchTerms[0]) &&
            lastNameLower.startsWith(searchTerms[1])
          );
        }
        return false;
      })
      .sort((a, b) => b.isConnected - a.isConnected); // Assuming `isConnected` is a number

    setFilteredUsers(filtered);
  }, [searchTerm, users]); // Dependencies: searchTerm and users

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleConnect = (userId) => {
    console.log("Connect with user ID:", userId);
  };

  const handleMessage = (userId) => {
    console.log("Message user ID:", userId);
  };

  const handleShowProfile = (userId) => {
    navigate(`/profile/${userId}`); // Navigate to the user's profile page using their ID
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        {isLoading ? (
          <div>Loading...</div> // Display loading indicator
        ) : (
          <>
            <MDBRow className="mb-4">
              <MDBCol md="8" className="d-flex justify-content-center mx-auto">
                <MDBInput
                  label="Search users"
                  value={searchTerm}
                  onChange={handleSearchChange}
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
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <MDBCol
                    key={user.userId}
                    xs="12"
                    sm="6"
                    md="4"
                    lg="3"
                    xl="2"
                    className="d-flex align-items-stretch"
                  >
                    <UserCardNetworkComponent
                      user={{
                        id: user.userId,
                        profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                        firstName: user.firstName,
                        lastName: user.lastName,
                        job: user.jobTitle,
                        companyName: user.companyName,
                        isConnected: user.isConnected, // Assuming isConnected is properly set
                      }}
                      onConnect={() => handleConnect(user.userId)}
                      onShowProfile={() => handleShowProfile(user.userId)}
                      onMessage={() => handleMessage(user.userId)}
                    />
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
