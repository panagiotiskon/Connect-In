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
import FileService from "../../api/UserFilesApi";
import AuthService from "../../api/AuthenticationAPI";

const ViewProfileCard = ({ viewedUser, connections, onNavigateToProfile }) => {
  const [profileImage, setProfileImage] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (viewedUser) {
        try {
          const images = await FileService.getUserImages(viewedUser.id);
          if (images.length > 0) {
            const { type, data } = images[0];
            setProfileImage(`data:${type};base64,${data}`);
          } else {
            setProfileImage("/path/to/default-image.png");
          }
        } catch (error) {
          console.error("Error fetching profile image:", error);
        }
      }
    };

    const fetchCurrentUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        if (user) {
          setCurrentUser(user);
          setIsAdmin(user.role === "ROLE_ADMIN");
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchProfileImage();
    fetchCurrentUser();
  }, [viewedUser]);

  if (!viewedUser) {
    return <div>Loading...</div>;
  }

  const isCurrentUserInConnections = connections.some(
    (connection) => connection.userId === currentUser?.id
  );

  return (
    <MDBCard
      className="mb-4"
      style={{
        width: "70%",
        margin: "2rem",
        marginLeft: "2rem",
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
        {(isAdmin ||
          (isCurrentUserInConnections && connections.length > 0)) && (
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
                  backgroundColor: "#35677e",
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
                      textAlign: "start",
                      font: "Segoe UI",
                      padding: "1.1rem",
                    }}
                  >
                    <div>
                      <img
                        src={`data:${connection.profileType};base64,${connection.profilePic}`}
                        alt={`${connection.firstName} ${connection.lastName}`}
                        style={{
                          width: "30px",
                          height: "30px",
                          objectFit: "cover",
                          borderRadius: "50%",
                          marginRight: "10px",
                          backgroundColor: "#35677e",
                        }}
                      />
                    </div>
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
