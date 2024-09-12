import React, { useState, useEffect, useRef } from "react";
import {
  MDBContainer,
  MDBCardBody,
  MDBCard,
  MDBTypography,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";
import NavbarComponent from "./common/NavBar";
import AuthService from "../api/AuthenticationAPI";
import ProfileCard from "../components/common/ProfileCard";
import "./HomeComponent.scss";

const HomeComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null); // To store the user's profile image (or a placeholder)
  const [postContent, setPostContent] = useState(""); // For the text content of the post
  const [uploadedFile, setUploadedFile] = useState(null); // To store the uploaded image file

  const fileInputRef = useRef(null); // Ref to trigger file input

  useEffect(() => {

    const fetchCurrentUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  const handleImageClick = () => {
    // Trigger file input when the Image button is clicked
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files ? event.target.files[0] : null;
    if (file) {
      const fileUrl = URL.createObjectURL(file);
      setUploadedFile({ file, previewUrl: fileUrl });
    }
  };

  const handleRemoveImage = () => {
    setUploadedFile(null); // Clear the image preview and file
  };
  const handleVideoClick = () => {
    // Add functionality for the Video button
    console.log('Video button clicked');
  };

  const handleAudioClick = () => {
    // Add functionality for the Audio button
    console.log('Audio button clicked');
  };

  const handlePostSubmit = async () => {
    if (!postContent && !uploadedFile) {
      alert("Post content or image is required.");
      return;
    }

    try {
      // Use the createPost method from AuthService
      await AuthService.createPost(postContent, uploadedFile?.file); // Send content and photo
      alert("Post submitted successfully!");

      // Clear the input fields after successful post
      setPostContent("");
      setUploadedFile(null);
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post.");
    }
  };

  return (
      <>
        <NavbarComponent />
        <MDBContainer fluid className="home-container">
          <MDBRow>
            <MDBCol md="4" className="left-column">
              <ProfileCard currentUser={currentUser} profileImage={profileImage} />
            </MDBCol>
            <MDBCol md="6" className="center-column">
              <MDBCard className="new-post-container shadow-0">
                <MDBCardBody className="border-bottom pb-2 w-100">
                  <div className="d-flex new-post-input-container">
                    <img
                        src={profileImage || "https://via.placeholder.com/150"}
                        className="rounded-circle"
                        height="60"
                        width={60}
                        alt="Avatar"
                        loading="lazy"
                    />
                    <div className="w-100 ps-3 ">
                      <input
                          type="text"
                          className="form-control form-status"
                          placeholder="Create a Post"
                          value={postContent} // Bind to state
                          onChange={(e) => setPostContent(e.target.value)} // Update state on change
                      />
                    </div>
                  </div>

                  <div className="media-options d-flex flex-column">
                    <MDBTypography
                        listUnStyled
                        className="d-flex flex-row ps-5 pt-3 mb-3 media-upload-btn"
                    >
                    {/* Image Button */}
                    <MDBBtn className="d-flex align-items-center me-4 image-btn" onClick={handleImageClick}>
                      <MDBIcon far icon="image" className="me-2" />
                      <span>Image</span>
                    </MDBBtn>
                    <MDBBtn className="d-flex align-items-center me-4 video-btn" onClick={handleVideoClick}>
                      <MDBIcon fas icon="video" className="me-2" />
                      <span>Video</span>
                    </MDBBtn>
                    <MDBBtn className="d-flex align-items-center audio-btn" onClick={handleAudioClick}>
                      <MDBIcon fas icon="microphone" className="me-2" />
                      <span>Audio</span>
                    </MDBBtn>
                    </MDBTypography>

                    {/* Hidden file input */}
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef} // Reference to file input
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                    />

                    {/* Display image preview if an image is selected */}
                    {uploadedFile && (
                        <div className="image-preview-container">
                          <img
                              src={uploadedFile.previewUrl}
                              alt="Preview"
                              className="img-thumbnail mt-2"
                              width={120}
                          />
                          {/* Remove Image Button */}
                          <MDBBtn
                              className="remove-image-btn"
                              color="danger"
                              onClick={handleRemoveImage}
                          >
                            <MDBIcon fas icon="times" />
                          </MDBBtn>
                        </div>
                    )}

                    <MDBBtn className="submit-post-btn" onClick={handlePostSubmit}>
                      POST
                    </MDBBtn>
                  </div>
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </>
  );
};

export default HomeComponent;
