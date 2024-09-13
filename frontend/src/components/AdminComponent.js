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
        const fetchedUsers = Array.isArray(response)
          ? response
          : response?.data || [];
        setUsers(fetchedUsers);
      } catch (error) {
        console.error("Failed to fetch users", error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);

  // Fetch profile images for each user
  useEffect(() => {
    const fetchProfileImages = async () => {
      try {
        const imagePromises = users.map(async (user) => {
          try {
            const images = await FileService.getUserImages(user.id);
            if (images.length > 0) {
              const { type, data } = images[0];
              return { id: user.id, image: `data:${type};base64,${data}` };
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
      } catch (error) {
        console.error("Error fetching profile images:", error);
      }
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
      const fileName = `userDetails.${format}`;
      const mimeType =
        format === "json" ? "application/json" : "application/xml";
      const content =
        format === "json"
          ? JSON.stringify(userDetails, null, 2)
          : convertToXML(userDetails);

      downloadFile(fileName, content, mimeType);
    } catch (error) {
      console.error("Error extracting users:", error);
    }
  };

  // Convert user details to XML
  const convertToXML = (data) => {
    try {
      const usersXmlData = {
        users: Object.entries(data).map(([userId, userDetails]) => ({
          user: {
            id: { id: userId },
            experiences: Array.isArray(userDetails.experiences)
              ? userDetails.experiences.map((exp) => ({
                  experience: {
                    jobTitle: exp.jobTitle || "",
                    companyName: exp.companyName || "",
                    startDate: exp.startDate || "",
                    endDate: exp.endDate || "",
                    isPublic: exp.isPublic,
                  },
                }))
              : [], // Default to an empty array if experiences is null or undefined
            skills: Array.isArray(userDetails.skills)
              ? userDetails.skills.map((skill) => ({
                  skill: {
                    skillTitle: skill.skillTitle || "",
                    skillDescription: skill.skillDescription || "",
                    isPublic: skill.isPublic,
                  },
                }))
              : [], // Default to an empty array if skills is null or undefined
            education: Array.isArray(userDetails.education)
              ? userDetails.education.map((edu) => ({
                  education: {
                    universityName: edu.universityName || "",
                    fieldOfStudy: edu.fieldOfStudy || "",
                    startDate: edu.startDate || "",
                    endDate: edu.endDate || "",
                    isPublic: edu.isPublic,
                  },
                }))
              : [], // Default to an empty array if education is null or undefined
          },
        })),
      };

      return json2xml(usersXmlData, { header: true });
    } catch (error) {
      console.error("Error converting to XML:", error);
      throw error;
    }
  };

  // Helper function to download the file
  const downloadFile = (filename, content, mimeType) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error("Error downloading file:", error);
    }
  };

  // Navigate to the selected user's profile
  const handleShowProfile = (userId) => {
    navigate(`/profile/${userId}`);
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
            .card-container {
              display: flex;
              flex-wrap: wrap;
              justify-content: center;
              gap: 1rem;
            }
            .card {
              flex: 1 0 18rem;
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
        <div className="card-container">
          {users
            .filter((user) => user.id !== adminId) // Skip the admin user
            .map((user) => (
              <MDBCard key={user.id} className="m-3 card">
                <MDBCardBody>
                  <div className="text-center mb-3">
                    <MDBCardImage
                      src={profileImages[user.id]}
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
