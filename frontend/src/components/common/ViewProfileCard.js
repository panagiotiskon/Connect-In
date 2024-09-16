import React, { useEffect, useState } from "react";
import {
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from "mdb-react-ui-kit";
import FileService from "../../api/UserFilesApi"; // Adjust the import path as needed

const ViewProfileCard = ({ viewedUser, connections, onNavigateToProfile }) => {
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (viewedUser) {
        try {
          const images = await FileService.getUserImages(viewedUser.id);
          if (images.length > 0) {
            const { type, data } = images[0];
            setProfileImage(`data:${type};base64,${data}`);
          } else {
            setProfileImage("/path/to/default-image.png"); // Fallback to default if no image
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    fetchProfileImage();
  }, [viewedUser]);

  if (!viewedUser) {
    return <div>Loading...</div>;
  }

  return (
    <MDBCard
      className="mb-4"
      style={{
        width: "70%",
        margin: "3%",
        height: "450px",
        display: "flex",
      }}
    >
      <MDBCardBody>
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
          style={{
            fontWeight: "bold",
            fontSize: "1.8rem",
            textAlign: "center",
            marginBottom: "2rem",
            font: "Segoe UI",
          }}
        >
          {`${viewedUser.firstName} ${viewedUser.lastName}`}
        </p>
        {connections && connections.length > 0 && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <MDBDropdown>
              <MDBDropdownToggle
                tag="a"
                className="btn btn-primary mt-3"
                style={{
                  fontWeight: "bold",
                  fontSize: "1rem",
                  textAlign: "center",
                  font: "Segoe UI",
                }}
              >
                Connections
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                {connections.map((connection) => (
                  <MDBDropdownItem
                    key={connection.userId}
                    onClick={() => onNavigateToProfile(connection.userId)}
                    style={{
                      fontWeight: "bold",
                      fontSize: "1rem",
                      cursor: "pointer",
                      textAlign: "center",
                      font: "Segoe UI",
                      padding: "10px",
                    }}
                  >
                    <img
                      src={`data:${connection.profileType};base64,${connection.profilePic}`}
                      alt={`${connection.firstName} ${connection.lastName}`}
                      style={{
                        width: "30px",
                        height: "30px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginRight: "10px",
                      }}
                    />
                    {`${connection.firstName} ${connection.lastName}`}
                  </MDBDropdownItem>
                ))}
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default ViewProfileCard;
