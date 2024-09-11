import React, { useState, useEffect } from "react";
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
import FileService from "../api/UserFilesApi"; // Adjust import path
import "./HomeComponent.scss";

const HomeComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [comments, setComments] = useState({});

  // Fetch current user
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  // Fetch user's profile image
  useEffect(() => {
    const fetchProfileImage = async () => {
      if (currentUser) {
        const images = await FileService.getUserImages(currentUser.id);
        if (images.length > 0) {
          setProfileImage(`data:image/png;base64,${images[0]}`);
        }
      }
    };

    if (currentUser) {
      fetchProfileImage();
    }
  }, [currentUser]);

  const posts = [
    {
      name: currentUser ? currentUser.firstName : "Loading...",
      username: currentUser ? `@${currentUser.username}` : "@username",
      time: "2h",
      content: "Lorem ipsum dolor sit amet #consectetur adipisicing elit.",
      imageUrl: profileImage || "https://via.placeholder.com/150", // Use profile image or fallback
      mediaUrl: "https://www.youtube.com/embed/vlDzYIIOYmM",
      cardImage: "https://via.placeholder.com/150",
      cardText: "Card Title",
      cardDetails: "Card details go here.",
      cardLink: "https://example.com",
      stats: { comments: 51, retweets: 7, likes: 35, shares: 10 },
    },
    // Add more posts here...
  ];

  if (!currentUser) {
    return <p>Loading...</p>;
  }

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = (postId) => {
    alert(`Comment submitted for post ${postId}: ${comments[postId]}`);
    handleCommentChange(postId, "");
  };

  const handleImageClick = () => {
    // Add functionality for the Image button
    console.log('Image button clicked');
  };

  const handleVideoClick = () => {
    // Add functionality for the Video button
    console.log('Video button clicked');
  };

  const handleAudioClick = () => {
    // Add functionality for the Audio button
    console.log('Audio button clicked');
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
                      id="form1"
                      className="form-control form-status"
                      placeholder="Create a Post"
                      style={{
                        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
                        height: "90%", // Ensures full height
                        display: "flex", // Flex display for better alignment
                        alignItems: "center", // Vertical centering
                      }}
                    />
                  </div>
                </div>
                <div className="media-options  d-flex flex-column">
                  <MDBTypography
                    listUnStyled
                    className="d-flex flex-row ps-5 pt-3 mb-3 media-upload-btn"
                  >
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
                  <MDBBtn className="submit-post-btn">POST</MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>

            {/* Render posts */}
            <div className="post-section">
              {posts.map((post, index) => (
                <MDBCard className="post-card mb-4" key={index}>
                  <MDBCardBody>
                    <div className="d-flex">
                      <img
                        src={post.imageUrl}
                        className="rounded-circle"
                        height="50"
                        alt="Avatar"
                        loading="lazy"
                      />
                      <div className="w-100 ps-3">
                        <h6>
                          {post.name} <span>{post.username}</span>
                          <span> • {post.time}</span>
                        </h6>
                        <p>{post.content}</p>
                        {post.mediaUrl && (
                          <div className="ratio ratio-16x9">
                            <iframe
                              src={post.mediaUrl}
                              title="YouTube video"
                              allowFullScreen
                            ></iframe>
                          </div>
                        )}

                        <MDBTypography listUnStyled className="reactions">
                          <div className="reaction-buttons">
                            <MDBBtn size="sm">
                              <MDBIcon fas icon="thumbs-up" className="me-1" />
                              Interested
                            </MDBBtn>
                          </div>
                        </MDBTypography>

                        <div className="comment-section">
                          <img
                            src={profileImage || "https://via.placeholder.com/150"}
                            className="rounded-circle"
                            height="50"
                            alt="Avatar"
                            loading="lazy"
                          />
                          <input
                            type="text"
                            placeholder="Add a comment..."
                            value={comments[index] || ""}
                            onChange={(e) => handleCommentChange(index, e.target.value)}
                          />
                          <MDBBtn size="sm" onClick={() => handleCommentSubmit(index)}>
                            Submit
                          </MDBBtn>
                        </div>
                      </div>
                    </div>
                  </MDBCardBody>
                </MDBCard>
              ))}
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default HomeComponent;
