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
        const images = await FileService.getUserImages(currentUser.id);
        if (images.length > 0) {
          setProfileImage(`data:image/png;base64,${images[0]}`); // Set the first image
        }
      }
    };

    fetchProfileImage();
  }, [currentUser]);

  const handleProfileClick = () => navigate(`/profile`);
  const handleConnectionsClick = () => navigate("/network");

  return (
    <MDBCard
      className="mb-4"
      style={{ width: "70%", 
               height: "100%",
               margin: "5%", 
               display: "flex"
                }}
    >
      <MDBCardBody>
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
            marginBottom: "0.6rem", // Adjust margin if needed
            font: "Segoe UI" 

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
            marginBottom: "2rem", // Adjust margin if needed
          }}
        >
          Connections
        </p>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ProfileCard;
