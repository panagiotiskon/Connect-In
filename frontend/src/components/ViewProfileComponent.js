import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
} from "mdb-react-ui-kit";
import { useParams, useNavigate } from "react-router-dom";
import NavbarAdminComponent from "./NavBarAdminComponent";
import ViewProfileCard from "./common/ViewProfileCard";
import PersonalInfoService from "../api/UserPersonalInformationAPI";
import AuthenticationAPI from "../api/AuthenticationAPI";

const ViewProfileComponent = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [cardsContent, setCardsContent] = useState({
    "Work Experience": [],
    Education: [],
    Skills: [],
  });
  const [isAdmin, setIsAdmin] = useState(false); // State to check if the current user is admin
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const currentUser = await AuthenticationAPI.getCurrentUser();
        if (currentUser?.role === "ROLE_ADMIN") {
          setIsAdmin(true);
        }
      } catch (error) {
        console.error("Error fetching logged-in user", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await PersonalInfoService.getUser(userId);

        if (!isAdmin && userData?.role === "ROLE_ADMIN") {
          navigate("/unauthorized");
          return;
        }

        setUser(userData);

        const educationData = await PersonalInfoService.getEducation(userId);
        const formattedEducationData = educationData
          .filter((edu) => isAdmin || edu.isPublic) // Show private data if admin
          .map((edu) => ({
            universityName: edu.universityName,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            isPublic: edu.isPublic,
          }));

        const workExperienceData = await PersonalInfoService.getExperience(
          userId
        );
        const formattedExperienceData = workExperienceData
          .filter((exp) => isAdmin || exp.isPublic) // Show private data if admin
          .map((exp) => ({
            jobTitle: exp.jobTitle,
            companyName: exp.companyName,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isPublic: exp.isPublic,
          }));

        const skillData = await PersonalInfoService.getSkills(userId);
        const formattedSkillData = skillData
          .filter((skill) => isAdmin || skill.isPublic) // Show private data if admin
          .map((skill) => ({
            skillTitle: skill.skillTitle,
            skillDescription: skill.skillDescription,
            isPublic: skill.isPublic,
          }));

        setCardsContent({
          "Work Experience": formattedExperienceData,
          Education: formattedEducationData,
          Skills: formattedSkillData,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchData();
  }, [userId, navigate, isAdmin]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarAdminComponent />
      <MDBContainer fluid className="home-container">
        <MDBRow>
          <MDBCol md="4" className="left-column"
          >
            <ViewProfileCard viewedUser={user}/>
          </MDBCol>

          <MDBCol md="8" className="center-column">
            <MDBRow>
              {["Work Experience", "Education", "Skills"].map(
                (section, index) => (
                  <MDBCol md="9" key={index} className="center-column mb-4">
                    <MDBCard className="new-post-container">
                      <MDBCardBody className="mt-2 pb-2 border-bottom w-100">
                        <MDBCardTitle className="fs-4 ps-2 fw-bold">
                          {section}
                        </MDBCardTitle>
                        <div
                          style={{
                            overflowY: "auto",
                            maxHeight: "200px",
                            padding: "10px 0",
                          }}
                        >
                          {cardsContent[section].map((item, idx) => (
                            <div key={idx} style={{ padding: "10px 0" }}>
                              <div
                                style={{ fontSize: "20px", fontWeight: "bold" }}
                              >
                                {section === "Skills"
                                  ? item.skillTitle
                                  : item.jobTitle || item.universityName}
                              </div>
                              <div
                                style={{ fontSize: "14px", fontWeight: "500" }}
                              >
                                {section === "Skills"
                                  ? item.skillDescription
                                  : item.companyName || item.fieldOfStudy}
                              </div>
                              {section !== "Skills" && (
                                <div
                                  style={{ fontSize: "12px", color: "#666" }}
                                >
                                  {item.startDate}{" "}
                                  {item.endDate
                                    ? ` - ${item.endDate}`
                                    : " - Present"}
                                </div>
                              )}
                              <div style={{ fontSize: "12px", color: "#999" }}>
                                {item.isPublic ? "Public" : "Private"}
                              </div>
                            </div>
                          ))}
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                )
              )}
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ViewProfileComponent;
