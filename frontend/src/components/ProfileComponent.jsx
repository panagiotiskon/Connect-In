import React, { useEffect, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Modal, Button, Form, Alert, Toast } from "react-bootstrap";
import NavbarComponent from "./common/NavBar";
import ProfileCard from "./common/ProfileCard";
import AuthService from "../api/AuthenticationAPI";
import PersonalInfoService from "../api/UserPersonalInformationAPI";

const ProfileComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [cardsContent, setCardsContent] = useState({
    "Work Experience": [],
    Education: [],
    Skills: [],
  });
  const [skillTitle, setSkillTittle] = useState("");
  const [skillDescription, setSkillDescription] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [universityName, setUniversityName] = useState("");
  const [fieldOfStudy, setFieldOfStudy] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isPublic, setIsPublic] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Fetch user and education data on component load
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching current user...");
        const user = await AuthService.getCurrentUser();
        console.log("Current user fetched:", user);
        setCurrentUser(user);

        if (user) {
          console.log("Fetching education data for user ID:", user.id);
          const educationData = await PersonalInfoService.getEducation(user.id);
          console.log("Education data fetched:", educationData);

          const formattedEducationData = educationData.map((edu) => ({
            universityName: edu.universityName,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            isPublic: edu.isPublic,
          }));

          setCardsContent((prev) => ({
            ...prev,
            Education: formattedEducationData,
          }));

          const workExperienceData = await PersonalInfoService.getExperience(
            user.id
          );
          const formattedExperienceData = workExperienceData.map((exp) => ({
            jobTitle: exp.jobTitle,
            companyName: exp.companyName,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isPublic: exp.isPublic,
          }));
          setCardsContent((prev) => ({
            ...prev,
            "Work Experience": formattedExperienceData,
          }));

          const SkillData = await PersonalInfoService.getSkills(user.id);
          const formattedSkillData = SkillData.map((skill) => ({
            skillTitle: skill.skillTitle,
            skillDescription: skill.skillDescription,
            isPublic: skill.isPublic,
          }));

          setCardsContent((prev) => ({
            ...prev,
            Skills: formattedSkillData,
          }));
        }
      } catch (error) {
        console.error(
          "Error fetching user, education, or experience data",
          error
        );
      }
    };

    fetchData();
  }, []);

  const handleAddClick = (card) => {
    setSelectedCard(card);
    setModalContent("");
    setShowModal(true);
    setErrorMessage("");
  };

  const handleModalClose = () => {
    setShowModal(false);
    setErrorMessage("");
  };

  const validateDates = () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : null;

    if (start > now) {
      setErrorMessage("Start date cannot be after the current date.");
      return false;
    }
    if (end && end > now) {
      setErrorMessage("End date cannot be after the current date.");
      return false;
    }
    if (end && start > end) {
      setErrorMessage("Start date cannot be after the end date.");
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (selectedCard === "Education") {
      if (!universityName || !fieldOfStudy || !startDate) {
        setErrorMessage("Please fill out all required fields.");
        return;
      }

      if (!validateDates()) return;

      const educationDTO = {
        universityName,
        fieldOfStudy,
        startDate,
        endDate,
        isPublic,
      };

      try {
        const response = await PersonalInfoService.addEducation(
          currentUser.id,
          educationDTO
        );

        if (response.status === 200) {
          setCardsContent((prev) => {
            const updatedContent = [...prev[selectedCard]];
            const educationEntry = {
              universityName,
              fieldOfStudy,
              startDate,
              endDate,
              isPublic,
            };

            if (updatedContent.length < 5) {
              updatedContent.push(educationEntry);
            }

            return {
              ...prev,
              [selectedCard]: updatedContent,
            };
          });

          setToastMessage("Successfully added Education!");
          setShowToast(true);

          setUniversityName("");
          setFieldOfStudy("");
          setStartDate("");
          setEndDate("");
          setIsPublic(true);
          handleModalClose();
        } else {
          setErrorMessage("Failed to save education.");
        }
      } catch (error) {
        setErrorMessage("Failed to save education.");
      }
    } else if (selectedCard === "Work Experience") {
      // Handle Work Experience saving
      if (!jobTitle || !companyName || !startDate) {
        setErrorMessage("Please fill out all required fields.");
        return;
      }

      if (!validateDates()) return;

      const experienceDTO = {
        jobTitle,
        companyName,
        startDate,
        endDate,
        isPublic,
      };

      try {
        const response = await PersonalInfoService.addExperience(
          currentUser.id,
          experienceDTO
        );

        if (response.status === 200) {
          setCardsContent((prev) => {
            const updatedContent = [...prev[selectedCard]];
            const experienceEntry = {
              jobTitle,
              companyName,
              startDate,
              endDate,
              isPublic,
            };

            if (updatedContent.length < 5) {
              updatedContent.push(experienceEntry);
            }

            return {
              ...prev,
              [selectedCard]: updatedContent,
            };
          });

          setToastMessage("Successfully added Work Experience!");
          setShowToast(true);

          setJobTitle("");
          setCompanyName("");
          setStartDate("");
          setEndDate("");
          setIsPublic(true);
          handleModalClose();
        } else {
          setErrorMessage("Failed to save work experience.");
        }
      } catch (error) {
        setErrorMessage("Failed to save work experience.");
      }
    } else if (selectedCard === "Skills") {
      if (!skillTitle || !skillDescription) {
        setErrorMessage("Please fill out all required fields.");
        return;
      }

      const skillDTO = {
        skillTitle,
        skillDescription,
        isPublic,
      };

      try {
        const response = await PersonalInfoService.addSkill(
          currentUser.id,
          skillDTO
        );

        if (response.status === 200) {
          setCardsContent((prev) => {
            const updatedContent = [...prev[selectedCard]];
            const skillEntry = {
              skillTitle,
              skillDescription,
              isPublic,
            };

            if (updatedContent.length < 5) {
              updatedContent.push(skillEntry);
            }

            return {
              ...prev,
              [selectedCard]: updatedContent,
            };
          });

          setToastMessage("Successfully added Skill!");
          setShowToast(true);

          handleModalClose();
        } else {
          setErrorMessage("Failed to save skill.");
        }
      } catch (error) {
        setErrorMessage("Failed to save skill.");
      }
    }
  };
  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarComponent />
      <MDBContainer
        fluid
        className="home-container"
      >
        <MDBRow>
          <MDBCol md="4" className="left-column">
            <ProfileCard currentUser={currentUser} />
          </MDBCol>

          <MDBCol md="6" className="center-column">
              {/* Card 1 - Work Experience */}
              <MDBCol md="9" className="center-column">
                <MDBCard className= "new-post-container">
                  <MDBCardBody className="border-bottom w-100">
                    <MDBCardTitle className="fs-4 ps-2 fw-bold">
                      Work Experience
                    </MDBCardTitle>
                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "200px", // Adjust the height to fit your design
                        padding: "10px 0",
                      }}
                    >
                      {cardsContent["Work Experience"].map((exp, index) => (
                        <div key={index} style={{ padding: "10px 0" }}>
                          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                            {exp.jobTitle}
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {exp.companyName}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {exp.startDate}{" "}
                            {exp.endDate ? ` - ${exp.endDate}` : " - Present"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#999" }}>
                            {exp.isPublic ? "Public" : "Private"}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="d-flex justify-content-end mt-auto">
                      <MDBBtn
                        color="primary"
                        size="md"
                        onClick={() => handleAddClick("Work Experience")}
                      >
                        + ADD
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>

                <MDBCard className="new-post-container mt-4">
                  <MDBCardBody className="border-bottom  w-100">
                    <MDBCardTitle  className="fs-4 fw-bold">
                      Education
                    </MDBCardTitle>
                    <div
                      style={{
                        overflowY: "auto",
                        maxHeight: "200px",
                        padding: "10px 0",
                      }}
                    >
                      {cardsContent.Education.map((edu, index) => (
                        <div key={index} style={{ padding: "10px 0" }}>
                          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                            {edu.universityName}
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {edu.fieldOfStudy}
                          </div>
                          <div style={{ fontSize: "12px", color: "#666" }}>
                            {edu.startDate}{" "}
                            {edu.endDate ? ` - ${edu.endDate}` : " - Present"}
                          </div>
                          <div style={{ fontSize: "12px", color: "#999" }}>
                            {edu.isPublic ? "Public" : "Private"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end mt-auto">
                      <MDBBtn
                        color="primary"
                        size="md"
                        onClick={() => handleAddClick("Education")}
                      >
                        + ADD
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>

              {/* Card 3 - Skills */}
                <MDBCard  className="new-post-container mt-4">
                  <MDBCardBody className="border-bottom pb-2 w-100">
                    <MDBCardTitle className="fs-4 fw-bold">Skills</MDBCardTitle>
                    <div
                      style={{
                        overflowY: "auto",
                        height:"30%",
                        maxHeight: "200px",
                        padding: "10px 0",
                      }}
                    >
                      {cardsContent.Skills.map((skill, index) => (
                        <div key={index} style={{ padding: "10px 0" }}>
                          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
                            {skill.skillTitle}
                          </div>
                          <div style={{ fontSize: "14px", fontWeight: "500" }}>
                            {skill.skillDescription}
                          </div>
                          <div style={{ fontSize: "12px", color: "#999" }}>
                            {skill.isPublic ? "Public" : "Private"}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end mt-auto">
                      <MDBBtn
                        className="add-button"
                        color="primary"
                        size="md"
                        onClick={() => handleAddClick("Skills")}
                      >
                        + ADD
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

            <Modal show={showModal} onHide={handleModalClose}>
              <Modal.Header closeButton>
                <Modal.Title>{selectedCard}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {selectedCard === "Education" ? (
                  <>
                    <Form.Group controlId="formUniversityName">
                      <Form.Label>University Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={universityName}
                        onChange={(e) => setUniversityName(e.target.value)}
                        placeholder="Enter university name"
                        isInvalid={!universityName && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group controlId="formFieldOfStudy" className="mt-3">
                      <Form.Label>Field of Study</Form.Label>
                      <Form.Control
                        type="text"
                        value={fieldOfStudy}
                        onChange={(e) => setFieldOfStudy(e.target.value)}
                        placeholder="Enter field of study"
                        isInvalid={!fieldOfStudy && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group controlId="formStartDate" className="mt-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        isInvalid={!startDate && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group controlId="formEndDate" className="mt-3">
                      <Form.Label>End Date (optional)</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formIsPublic" className="mt-3">
                      <Form.Check
                        type="checkbox"
                        label="Public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                    </Form.Group>
                  </>
                ) : selectedCard === "Work Experience" ? (
                  <>
                    <Form.Group controlId="formJobTitle">
                      <Form.Label>Job Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={jobTitle}
                        onChange={(e) => setJobTitle(e.target.value)}
                        placeholder="Enter job title"
                        isInvalid={!jobTitle && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group controlId="formCompanyName" className="mt-3">
                      <Form.Label>Company Name</Form.Label>
                      <Form.Control
                        type="text"
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        isInvalid={!companyName && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group controlId="formStartDate" className="mt-3">
                      <Form.Label>Start Date</Form.Label>
                      <Form.Control
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        isInvalid={!startDate && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group controlId="formEndDate" className="mt-3">
                      <Form.Label>End Date (optional)</Form.Label>
                      <Form.Control
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </Form.Group>

                    <Form.Group controlId="formIsPublic" className="mt-3">
                      <Form.Check
                        type="checkbox"
                        label="Public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                    </Form.Group>
                  </>
                ) : selectedCard === "Skills" ? (
                  <>
                    <Form.Group controlId="formSkillTitle">
                      <Form.Label>Skill Title</Form.Label>
                      <Form.Control
                        type="text"
                        value={skillTitle}
                        onChange={(e) => setSkillTittle(e.target.value)}
                        placeholder="Enter skill title"
                        isInvalid={!skillTitle && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group
                      controlId="formSkillDescription"
                      className="mt-3"
                    >
                      <Form.Label>Skill Description</Form.Label>
                      <Form.Control
                        type="text"
                        value={skillDescription}
                        onChange={(e) => setSkillDescription(e.target.value)}
                        placeholder="Enter skill description"
                        isInvalid={!skillDescription && errorMessage}
                      />
                    </Form.Group>

                    <Form.Group controlId="formIsPublic" className="mt-3">
                      <Form.Check
                        type="checkbox"
                        label="Public"
                        checked={isPublic}
                        onChange={(e) => setIsPublic(e.target.checked)}
                      />
                    </Form.Group>
                  </>
                ) : (
                  <Form.Group controlId="formModalContent">
                    <Form.Label>{selectedCard} Details</Form.Label>
                    <Form.Control
                      type="text"
                      value={modalContent}
                      onChange={(e) => setModalContent(e.target.value)}
                      placeholder="Enter details"
                      isInvalid={!modalContent && errorMessage}
                    />
                  </Form.Group>
                )}
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleModalClose}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSave}>
                  Save Changes
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Toast Notification */}
            <Toast
              onClose={() => setShowToast(false)}
              show={showToast}
              delay={3000}
              autohide
              style={{
                position: "fixed",
                bottom: "20px",
                right: "20px",
                zIndex: 1050,
                backgroundColor: "#28a745", // Green background
                color: "#fff", // White text
              }}
            >
              <Toast.Body>{toastMessage}</Toast.Body>
            </Toast>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ProfileComponent;

