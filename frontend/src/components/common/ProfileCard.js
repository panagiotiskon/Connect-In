import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCardImage } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import FileService from "../../api/UserFilesApi"; // Adjust the import path as needed

const ProfileCard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  // Fetch user's profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentUser) {
        try {
          const images = await FileService.getUserImages(currentUser.id);
          if (images && images.length > 0) {
            const { type, data } = images[0]; // Assume the first image is the profile image
            setProfileImage(`data:${type};base64,${data}`); // Dynamically set image type and data
          } else {
            setProfileImage("/path/to/default-image.png"); // Fallback to default if no image
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    fetchProfileImage();
  }, [currentUser]);

  // Redirect to profile page
  const handleProfileClick = () => navigate(`/profile`);
  // Redirect to connections page
  const handleConnectionsClick = () => navigate("/network");

  // Return early if currentUser is not yet loaded
  if (!currentUser) {
    return (
      <div style={{ textAlign: "center", padding: "2rem" }}>
        Loading profile...
      </div>
    );
  }

  return (
    <MDBCard
      className="mb-4"
      style={{
        width: "70%",
        height: "450px",
        margin: "5%",
        display: "flex",
      }}
    >
      <MDBCardBody
      >
        <MDBCardImage
          src={profileImage || "/path/to/default-image.png"} // Fallback image
          alt="avatar"
          className="rounded-circle"
          style={{
            width: 150, // Increase width to make the circle larger
            height: 150, // Set height to match width for a perfect circle
            objectFit: "cover", // Ensure the image covers the circle
            display: "block",
            alignSelf: "center",
            margin: "0 auto", // Center the image horizontally
            marginTop: "3rem",
            marginBottom: "3rem", // Adjust bottom margin as needed
          }}
          fluid
        />
        <p
          onClick={handleProfileClick}
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            cursor: "pointer",
            textAlign: "center", // Center the text horizontally
            font: "Segoe UI",
            marginBottom:"2rem",
          }}
        >
          {`${currentUser.firstName} ${currentUser.lastName}`}
        </p>
        <p
          onClick={handleConnectionsClick}
          style={{
            fontWeight: "bold",
            fontSize: "1.3rem",
            cursor: "pointer",
            textAlign: "center", // Center the text horizontally
            marginBottom: "1rem", // Adjust margin if needed
            font: "Segoe UI",
          }}
        >
          Your Connections
        </p>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ProfileCard;
