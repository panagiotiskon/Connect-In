import React, { useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBCardTitle,
  MDBBtn,
} from "mdb-react-ui-kit";
import { Modal, Button, Form } from "react-bootstrap";
import NavbarComponent from "./common/NavBar";
import ProfileCard from "./common/ProfileCard";
import AuthService from "../api/AuthenticationAPI";

const ProfileComponent = () => {
  const currentUser = AuthService.getCurrentUser();

  const [showModal, setShowModal] = useState(false);
  const [selectedCard, setSelectedCard] = useState("");
  const [modalContent, setModalContent] = useState("");
  const [cardsContent, setCardsContent] = useState({
    "Work Experience": [],
    Education: [],
    Skills: [],
  });

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  const handleAddClick = (card) => {
    setSelectedCard(card);
    setModalContent(""); // Clear content each time "Add" is clicked
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  const handleSave = () => {
    setCardsContent((prev) => {
      const updatedContent = [...prev[selectedCard]];
      if (updatedContent.length < 5) {
        updatedContent.push(modalContent);
      }
      return {
        ...prev,
        [selectedCard]: updatedContent,
      };
    });
    handleModalClose();
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5" style={{ padding: 0 }}>
        <MDBRow>
          {/* Profile Card Column */}
          <MDBCol md="3" className="ps-0">
            <ProfileCard currentUser={currentUser} />
          </MDBCol>

          {/* Cards Column */}
          <MDBCol md="7" className="ps-0">
            <MDBRow>
              {/* Card 1 */}
              <MDBCol md="12" className="mb-6">
                <MDBCard style={{ height: "280px" }}>
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
                        size="lg"
                        onClick={() => handleAddClick("Work Experience")}
                      >
                        + ADD
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              {/* Card 2 */}
              <MDBCol md="12" className="mb-6">
                <MDBCard style={{ height: "280px" }}>
                  <MDBCardBody className="d-flex flex-column">
                    <MDBCardTitle className="fs-4 fw-bold">
                      Education
                    </MDBCardTitle>
                    <div className="mt-2">
                      {cardsContent.Education.map((content, index) => (
                        <div key={index} className="mb-2">
                          {content}
                        </div>
                      ))}
                    </div>
                    <div className="d-flex justify-content-end mt-auto">
                      <MDBBtn
                        color="primary"
                        size="lg"
                        onClick={() => handleAddClick("Education")}
                      >
                        + ADD
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>

              {/* Card 3 */}
              <MDBCol md="12" className="mb-6">
                <MDBCard style={{ height: "280px" }}>
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
                        size="lg"
                        onClick={() => handleAddClick("Skills")}
                      >
                        + ADD
                      </MDBBtn>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>

        {/* Modal */}
        <Modal show={showModal} onHide={handleModalClose}>
          <Modal.Header closeButton>
            <Modal.Title>{selectedCard}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group controlId="formModalContent">
              <Form.Control
                as="textarea"
                rows={3}
                value={modalContent}
                onChange={(e) => setModalContent(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={handleSave}>
              Save changes
            </Button>
          </Modal.Footer>
        </Modal>
      </MDBContainer>
    </div>
  );
};

export default ProfileComponent;
