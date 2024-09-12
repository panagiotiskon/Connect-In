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
import PostService from "../api/PostApi"; 

import "./HomeComponent.scss";


const HomeComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [posts, setPosts] = useState([]); // State to hold the posts

  const fileInputRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    // Fetch posts from the backend when component mounts
    const fetchPosts = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        const fetchedPosts = await PostService.getFeed(user?.id); // Fetch posts from backend
        setPosts(fetchedPosts); // Set posts to the state
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };

    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser]);

  const handleImageClick = () => {
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
    setUploadedFile(null);
  };

  const handlePostSubmit = async () => {
    if (!postContent && !uploadedFile) {
      alert("Post content or image is required.");
      return;
    }

    try {
      await AuthService.createPost(postContent, uploadedFile?.file);
      alert("Post submitted successfully!");
      setPostContent("");
      setUploadedFile(null);

      // Refetch posts after submitting
      const fetchedPosts = await PostService.getFeed(currentUser?.id);
      setPosts(fetchedPosts);
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
            {/* Create Post Section */}
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
                      value={postContent}
                      onChange={(e) => setPostContent(e.target.value)}
                    />
                  </div>
                </div>

                <div className="media-options d-flex flex-column">
                  <MDBTypography
                    listUnStyled
                    className="d-flex flex-row ps-5 pt-3 mb-3 media-upload-btn"
                  >
                    <MDBBtn className="d-flex align-items-center me-4 image-btn" onClick={handleImageClick}>
                      <MDBIcon far icon="image" className="me-2" />
                      <span>Image</span>
                    </MDBBtn>
                    <MDBBtn className="d-flex align-items-center me-4 video-btn">
                      <MDBIcon fas icon="video" className="me-2" />
                      <span>Video</span>
                    </MDBBtn>
                    <MDBBtn className="d-flex align-items-center audio-btn">
                      <MDBIcon fas icon="microphone" className="me-2" />
                      <span>Audio</span>
                    </MDBBtn>
                  </MDBTypography>

                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />

                  {uploadedFile && (
                    <div className="image-preview-container">
                      <img
                        src={uploadedFile.previewUrl}
                        alt="Preview"
                        className="img-thumbnail mt-2"
                        width={120}
                      />
                      <MDBBtn className="remove-image-btn" color="danger" onClick={handleRemoveImage}>
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

            {/* Display Posts Section */}
            {posts.length > 0 ? (
              posts.map((post) => (
                <MDBCard key={post.id} className="mt-3 shadow-0">
                  <MDBCardBody>
                    <h5>{post.content}</h5>
                    <p>Created at: {new Date(post.createdAt).toLocaleString()}</p>
                    {post.file && (
                      <img
                        src={post.file}
                        alt="Post Media"
                        style={{ width: "100%", height: "auto" }}
                      />
                    )}
                    {/* Display comments, reactions, etc */}
                  </MDBCardBody>
                </MDBCard>
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default HomeComponent;
