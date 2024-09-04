// NetworkComponent.js
import React, { useState, useEffect } from "react";
import { MDBContainer, MDBRow, MDBCol, MDBInput } from "mdb-react-ui-kit";
import NavbarComponent from "./common/NavBar";
import UserCard from "./UserCardComponent";
import AuthService from "../api/AuthenticationAPI"; // For getting current user info
import { useNavigate } from "react-router-dom";
const mockUsers = [
  {
    id: 1,
    profileImage: "/path/to/profile-image1.png",
    firstName: "John",
    lastName: "Doe",
    job: "Software Engineer",
    isConnected: true,
  },
  {
    id: 2,
    profileImage: "/path/to/profile-image2.png",
    firstName: "Jane",
    lastName: "Smith",
    job: "Product Manager",
    isConnected: false,
  },
  {
    id: 3,
    profileImage: "/path/to/profile-image3.png",
    firstName: "Alice",
    lastName: "Johnson",
    job: "UX Designer",
    isConnected: true,
  },
  {
    id: 4,
    profileImage: "/path/to/profile-image4.png",
    firstName: "Bob",
    lastName: "Brown",
    job: "Data Scientist",
    isConnected: false,
  },
  {
    id: 5,
    profileImage: "/path/to/profile-image5.png",
    firstName: "Emily",
    lastName: "Davis",
    job: "Marketing Specialist",
    isConnected: true,
  },
  {
    id: 6,
    profileImage: "/path/to/profile-image6.png",
    firstName: "Michael",
    lastName: "Wilson",
    job: "Project Manager",
    isConnected: false,
  },
  {
    id: 7,
    profileImage: "/path/to/profile-image7.png",
    firstName: "Sarah",
    lastName: "Moore",
    job: "Graphic Designer",
    isConnected: true,
  },
  {
    id: 8,
    profileImage: "/path/to/profile-image8.png",
    firstName: "David",
    lastName: "Taylor",
    job: "Web Developer",
    isConnected: false,
  },
  {
    id: 9,
    profileImage: "/path/to/profile-image9.png",
    firstName: "Laura",
    lastName: "Martinez",
    job: "Content Writer",
    isConnected: true,
  },
  {
    id: 10,
    profileImage: "/path/to/profile-image10.png",
    firstName: "James",
    lastName: "Anderson",
    job: "Business Analyst",
    isConnected: false,
  },
  {
    id: 11,
    profileImage: "/path/to/profile-image11.png",
    firstName: "Sophia",
    lastName: "Harris",
    job: "Financial Analyst",
    isConnected: false,
  },
  {
    id: 12,
    profileImage: "/path/to/profile-image12.png",
    firstName: "Daniel",
    lastName: "Garcia",
    job: "Software Architect",
    isConnected: true,
  },
];
const NetworkComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Simulate fetching users
    setUsers(mockUsers);
    setFilteredUsers(mockUsers);
  }, []);

  useEffect(() => {
    const searchTermLower = searchTerm.toLowerCase();

    const filtered = users
      .filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        return fullName.includes(searchTermLower);
      })
      .sort((a, b) => b.isConnected - a.isConnected);

    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleConnect = (userId) => {
    console.log("Connect with user ID:", userId);
  };

  const handleShowProfile = (userId) => {
    const user = users.find((user) => user.id === userId);
    if (user) {
      const profilePath = `/profile/${user.firstName}-${user.lastName}`;
      navigate(profilePath); // Navigate to the user's profile page
    }
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
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
        <MDBRow className="gx-2">
          {filteredUsers.map((user) => (
            <MDBCol md="" key={user.id} className="p-1">
              <UserCard
                user={user}
                onConnect={() => handleConnect(user.id)}
                onShowProfile={() => handleShowProfile(user.id)}
              />
            </MDBCol>
          ))}
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default NetworkComponent;
