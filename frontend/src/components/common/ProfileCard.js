import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCardImage } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import FileService from "../../api/UserFilesApi";

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

  const handleProfileClick = () => navigate(`/profile`);
  const handleConnectionsClick = () => navigate("/network");

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
        height: "500px",
        marginTop: "7%",
        margin: "12%",
        display: "flex",
      }}
    >
      <MDBCardBody
      >
        <MDBCardImage
          src={profileImage || "/path/to/default-image.png"}
          alt="avatar"
          className="rounded-circle"
          style={{
            width: 150,
            height: 150,
            objectFit: "cover",
            display: "block",
            alignSelf: "center",
            margin: "0 auto",
            marginTop: "3rem",
            marginBottom: "3rem",
          }}
          fluid
        />
        <p
          onClick={handleProfileClick}
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            cursor: "pointer",
            textAlign: "center",
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
            textAlign: "center",
            marginBottom: "1rem",
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
