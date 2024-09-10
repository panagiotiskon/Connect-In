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
import EducationService from "../api/UserPersonalInformationAPI";

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
          const educationData = await EducationService.getEducation(user.id);
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
        }
      } catch (error) {
        console.error("Error fetching user or education data", error);
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
        console.log("Attempting to add education for user:", currentUser.id);
        console.log("Education Details:", educationDTO);

        const response = await EducationService.addEducation(
          currentUser.id,
          educationDTO
        );

        console.log("Received response from addEducation:", response);
        if (response.status === 200) {
          console.log("Education successfully saved to the backend.");

          setCardsContent((prev) => {
            const updatedContent = [...prev[selectedCard]];

            const educationEntry = {
              universityName,
              fieldOfStudy,
              startDate,
              endDate,
              isPublic,
            };

            console.log("New education entry to add:", educationEntry);

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

          console.log("Education card content updated successfully.");

          setUniversityName("");
          setFieldOfStudy("");
          setStartDate("");
          setEndDate("");
          setIsPublic(true);
          handleModalClose();

          console.log("Education form fields cleared.");
        } else {
          console.error(
            "Failed to save education. Response status:",
            response.status
          );
          setErrorMessage("Failed to save education.");
        }
      } catch (error) {
        console.error("Error occurred while adding education:", error);
        setErrorMessage("Failed to save education.");
      }

      setModalContent("");
      handleModalClose();
    }
  };

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5" style={{ padding: 0 }}>
        <MDBRow>
          {/* Profile Card Column */}
          <MDBCol md="4" className="ps-0">
            <ProfileCard currentUser={currentUser} />
          </MDBCol>

          {/* Cards Column */}
          <MDBCol md="7" className="ps-0">
            <MDBRow>
              {/* Card 1 - Work Experience */}
              <MDBCol md="12" className="mb-6">
                <MDBCard style={{ height: "330px" }}>
                  <MDBCardBody className="d-flex flex-column">
                    <MDBCardTitle className="fs-4 fw-bold">
                      Work Experience
                    </MDBCardTitle>
                    <div className="mt-2">
                      {cardsContent["Work Experience"].map((content, index) => (
                        <div key={index} className="mb-2">
                          {content}
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
              </MDBCol>

              {/* Card 2 - Education */}
              <MDBCol md="12" className="mb-6">
                <MDBCard style={{ height: "330px" }}>
                  <MDBCardBody className="d-flex flex-column">
                    <MDBCardTitle className="fs-4 fw-bold">
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
              </MDBCol>

              {/* Card 3 - Skills */}
              <MDBCol md="12" className="mb-6">
                <MDBCard style={{ height: "330px" }}>
                  <MDBCardBody className="d-flex flex-column">
                    <MDBCardTitle className="fs-4 fw-bold">Skills</MDBCardTitle>
                    <div className="mt-2">
                      {cardsContent.Skills.map((content, index) => (
                        <div key={index} className="mb-2">
                          {content}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end mt-auto">
                      <MDBBtn
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
            </MDBRow>

            {/* Modal */}
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
