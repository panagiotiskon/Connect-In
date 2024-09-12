import React, { useEffect, useState } from "react";
import { MDBCard, MDBCardBody, MDBCardImage } from "mdb-react-ui-kit";
import FileService from "../../api/UserFilesApi"; // Import the service to fetch the images

const ViewProfileCard = ({ viewedUser }) => {
  const [profileImage, setProfileImage] = useState(null); // State to store profile image

  // Fetch user's profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (viewedUser) {
        try {
          const images = await FileService.getUserImages(viewedUser.id); // Assuming id is available in viewedUser
          if (images.length > 0) {
            const { type, data } = images[0]; // Assume the first image is the profile image
            setProfileImage(`data:${type};base64,${data}`); // Dynamically set image type and data
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    fetchProfileImage();
  }, [viewedUser]); // Dependency array ensures the effect runs when viewedUser changes

  if (!viewedUser) {
    return <div>Loading...</div>;
  }

  return (
    <MDBCard style={{ maxWidth: "22rem", marginTop: "20px" }}>
      <MDBCardImage
        src={profileImage || viewedUser.profilePictureUrl}
        alt={`${viewedUser.firstName} ${viewedUser.lastName}`}
        position="top"
        style={{
          borderRadius: "50%",
          width: "150px",
          height: "150px",
          objectFit: "cover",
          margin: "20px auto",
        }}
      />
      <MDBCardBody className="text-center">
        <h4 className="fw-bold">{`${viewedUser.firstName} ${viewedUser.lastName}`}</h4>
      </MDBCardBody>
    </MDBCard>
  );
};

export default ViewProfileCard;
