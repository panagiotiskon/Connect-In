import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminAPI from "../api/AdminAPI"; // Adjust the import path as needed
import FileService from "../api/UserFilesApi"; // Adjust the import path as needed
import NavBarAdminComponent from "./NavBarAdminComponent";
import FooterComponent from "./common/FooterComponent";
import json2xml from "json2xml";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCheckbox,
  MDBCardImage,
} from "mdb-react-ui-kit";

export default function AdminComponent() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [profileImages, setProfileImages] = useState({}); // Map to store profile images
  const adminId = 1; // Set the admin user's ID or some condition to identify admin
  const navigate = useNavigate(); // Initialize useNavigate hook

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AdminAPI.getUsers();

        if (Array.isArray(response)) {
          setUsers(response);
        } else if (response?.data && Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          console.error("Unexpected response format:", response);
          setUsers([]);
        }
      } catch (error) {
        console.error("Failed to fetch users", error);
      }
    };

    fetchUsers();
  }, []);

  // Fetch profile images for each user
  useEffect(() => {
    const fetchProfileImages = async () => {
      const imagePromises = users.map(async (user) => {
        try {
          const images = await FileService.getUserImages(user.id);
          if (images.length > 0) {
            return { id: user.id, image: `data:image/png;base64,${images[0]}` };
          }
          return { id: user.id, image: null };
        } catch (error) {
          console.error(`Error fetching images for user ${user.id}:`, error);
          return { id: user.id, image: null };
        }
      });

      const results = await Promise.all(imagePromises);
      const imagesMap = results.reduce((acc, { id, image }) => {
        acc[id] = image;
        return acc;
      }, {});
      setProfileImages(imagesMap);
    };

    if (users.length > 0) {
      fetchProfileImages();
    }
  }, [users]);

  // Handle checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  // Extract selected users' details in either JSON or XML format
  const extractUsers = async (format) => {
    if (selectedUsers.length === 0) {
      console.error("No users selected");
      return;
    }

    try {
      const userDetails = await AdminAPI.getUserDetails(selectedUsers);

      if (format === "json") {
        const json = JSON.stringify(userDetails, null, 2);
        downloadFile("userDetails.json", json, "application/json");
      } else if (format === "xml") {
        const xml = convertToXML(userDetails);
        downloadFile("userDetails.xml", xml, "application/xml");
      }
    } catch (error) {
      console.error("Error extracting users:", error);
    }
  };

  // Convert user details to XML
  const convertToXML = (data) => {
    const usersXmlData = {
      users: Object.entries(data).map(([userId, userDetails]) => ({
        user: {
          _attr: { id: userId },
          firstName: userDetails.firstName,
          lastName: userDetails.lastName,
          profilePic: userDetails.profilePic || "",
          experiences: userDetails.experiences.map((exp) => ({
            experience: {
              title: exp.title,
              company: exp.company,
              startDate: exp.startDate,
              endDate: exp.endDate || "",
            },
          })),
          skills: userDetails.skills.map((skill) => ({ skill })),
          education: userDetails.education.map((edu) => ({
            education: {
              universityName: edu.universityName,
              fieldOfStudy: edu.fieldOfStudy,
              startDate: edu.startDate,
              endDate: edu.endDate,
            },
          })),
        },
      })),
    };

    // Convert the constructed object to XML using json2xml
    return json2xml(usersXmlData, { header: true });
  };

  // Helper function to download the file
  const downloadFile = (filename, content, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // Clean up
  };

  // Navigate to the selected user's profile
  const handleShowProfile = (userId) => {
    navigate(`/profile/${userId}`); // Redirect to the user's profile page
  };

  return (
    <div>
      <NavBarAdminComponent />
      <MDBContainer fluid className="py-5">
        <style>
          {`
            .center-content {
              text-align: center;
            }
            .section-heading {
              margin-bottom: 20px;
            }
            .button-group {
              display: flex;
              justify-content: center;
              gap: 15px;
            }
          `}
        </style>
        <div className="center-content">
          <h4 className="section-heading">Extract Selected Users</h4>
          <div className="button-group">
            <MDBBtn color="primary" onClick={() => extractUsers("json")}>
              JSON Format
            </MDBBtn>
            <MDBBtn color="secondary" onClick={() => extractUsers("xml")}>
              XML Format
            </MDBBtn>
          </div>
        </div>
        {/* User cards layout */}
        <div className="d-flex flex-wrap justify-content-start">
          {users
            .filter((user) => user.id !== adminId) // Skip the admin user
            .map((user) => (
              <MDBCard key={user.id} className="m-3" style={{ width: "18rem" }}>
                <MDBCardBody>
                  <div className="text-center mb-3">
                    <MDBCardImage
                      src={
                        profileImages[user.id] ||
                        "https://via.placeholder.com/120"
                      } // Placeholder if no image
                      alt={`${user.firstName} ${user.lastName}`}
                      className="rounded-circle"
                      style={{
                        width: "120px",
                        height: "120px",
                        objectFit: "cover",
                      }}
                      fluid
                    />
                  </div>
                  <MDBCardTitle className="text-center">
                    {user.firstName} {user.lastName}
                  </MDBCardTitle>
                  <MDBCardText className="d-flex flex-column align-items-start">
                    <MDBCheckbox
                      id={`user-${user.id}`}
                      label="Select"
                      className="mb-3"
                      onChange={() => handleCheckboxChange(user.id)}
                    />
                    <MDBBtn
                      color="primary"
                      onClick={() => handleShowProfile(user.id)}
                    >
                      Show Profile
                    </MDBBtn>
                  </MDBCardText>
                </MDBCardBody>
              </MDBCard>
            ))}
        </div>
      </MDBContainer>
      <FooterComponent />
    </div>
  );
}
