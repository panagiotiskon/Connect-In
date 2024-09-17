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
import NavbarComponent from "../common/NavBar";
import AuthService from "../../api/AuthenticationAPI";
import ProfileCard from "../common/ProfileCard";
import PostService from "../../api/PostApi";
import FileService from "../../api/UserFilesApi"; // Import the service to fetch the images
import PersonalInfoService from "../../api/UserPersonalInformationAPI";

import "./HomeComponent.scss";

const HomeComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [posts, setPosts] = useState([]); // State to hold the posts
  const [commentInputs, setCommentInputs] = useState({}); // Track comment input for each post
  const [postsMap, setPostsMap] = useState({});
  const [reactedPostIds, setReactedPostIds] = useState([]);
  const [userComments, setUserComments] = useState({});
  const fileInputRef = useRef(null);

  const fetchPosts = async () => {
    try {
      const user = await AuthService.getCurrentUser();
      const response = await PostService.getFeed(user?.id);

      const fetchedPosts = Array.isArray(response) ? response : response?.data || [];

      const postsById = {};

      const postsWithUserPhotos = await Promise.all(
        fetchedPosts.map(async (post) => {
          // Fetch poster info
          const poster = await PersonalInfoService.getUser(post.userId);
          // Process comments
          const commentsWithPhotos = await Promise.all(
            post.comments.map(async (comment) => {
              const userImage = await FileService.getUserImages(comment.userId);
              const userProfileImage =
                userImage.length > 0
                  ? `data:${userImage[0].type};base64,${userImage[0].data}`
                  : null;

              return {
                ...comment,
                profileImage: userProfileImage,
              };
            })
          );

          const processedPost = {
            ...post,
            posterName: poster.firstName + " " + poster.lastName,
            posterImage: poster?.profilePictureData ? `data:image/jpeg;base64,${poster.profilePictureData}` : "https://via.placeholder.com/40",
            comments: commentsWithPhotos,
          };

          postsById[post.id] = processedPost;

          return processedPost;
        })
      );

      setPosts(postsWithUserPhotos);  // Still set the array of posts for UI rendering
      setPostsMap(postsById);  // Set the dictionary mapping post IDs to posts
    } catch (error) {
      console.error("Error fetching posts:", error);
      setPosts([]);
    }
  };

  const fetchReactedPostIds = async () => {
    try {
      const response = await PostService.getUserReactions(); // Fetch list of reacted post IDs
      const userReactedPostIds = response?.data || []; // Ensure data is an array
      setReactedPostIds(userReactedPostIds); // Store the list of reacted post IDs
    } catch (error) {
      console.error("Error fetching reacted post IDs:", error);
    }
  };

  const fetchUserCommentIds = async () => {
    try {
      const response = await PostService.getUserComments();
      const commentsData = response?.data || {};
      setUserComments(commentsData);
      fetchPosts();
    } catch (error) {
      console.error("Error fetching user comments:", error);
    }
  };


  useEffect(() => {
    const fetchCurrentUser = async () => {
      const user = await AuthService.getCurrentUser();
      setCurrentUser(user);

      if (user?.id) {
        const userImages = await FileService.getUserImages(user.id);
        if (userImages.length > 0) {
          const profileImageData = `data:${userImages[0].type};base64,${userImages[0].data}`;
          setProfileImage(profileImageData); // Set profile image for the user
        } else {
          setProfileImage(null); // Fallback if no image is found
        }
      }
    };
    fetchCurrentUser();
    fetchReactedPostIds();
    fetchUserCommentIds();
  }, []);

  useEffect(() => {
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
      await PostService.createPost(postContent, uploadedFile?.file);
      setPostContent("");
      setUploadedFile(null);
      fetchPosts();
    } catch (error) {
      console.error("Error submitting post:", error);
      alert("Failed to submit post.");
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment) {
      alert("Comment cannot be empty.");
      return;
    }

    try {
      const post = postsMap[postId];

      if (post) {
        await PostService.createComment(postId, comment);
        setCommentInputs((prev) => ({
          ...prev,
          [postId]: "",
        }));

        fetchPosts();

      } else {
        alert("Failed to submit comment");
        console.error("Post not found for the given postId:", postId);
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment.");
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      // Call the deletePost function with the postId
      await PostService.deletePost(postId);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post.");
    }
  };

  const handleReactionToggle = async (postId) => {
    try {
      const hasReacted = reactedPostIds.includes(postId);
      if (hasReacted) {
        await PostService.deleteReaction(postId);
        setReactedPostIds((prev) => prev.filter((id) => id !== postId)); // Remove from reacted post IDs
      } else {
        await PostService.createReaction(postId);
        setReactedPostIds((prev) => [...prev, postId]); // Add to reacted post IDs
      }
      fetchPosts();
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await PostService.deleteComment(postId, commentId);
      fetchPosts();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment.");
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
          <MDBCol md="6" className="center-column" style={{marginBottom:"1rem"}}>
            {/* Create Post Section */}
            <MDBCard className="new-post-container shadow-0">
              <MDBCardBody className="pb-2 w-100">
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
                    <MDBBtn
                      className="d-flex align-items-center me-4 image-btn"
                      onClick={handleImageClick}
                    >
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

            {/* Display Posts Section */}
            {posts.length > 0 ? (
              posts.map((post) => (
                <MDBCard key={post.id} className="mt-3 shadow-0 feed-post">
                  <MDBCardBody>
                    <div className="poster-info">
                      <img
                        src={post.posterImage}
                        className="rounded-circle"
                        height="45"
                        width="45"
                        alt="Poster Avatar"
                      />
                      <div className="poster-text"><strong>{post.posterName}</strong></div>
                      {currentUser?.id === post.userId && (
                        <MDBBtn
                          className="btn-sm delete-post-btn"
                          color="secondary"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <MDBIcon fas icon="times" />
                        </MDBBtn>
                      )}
                    </div>
                    <h5>{post.content}</h5>
                    <p className="text-muted" 
                        style={{
                          display:"flex",
                          margin:"0",
                          fontSize: "0.8rem"}}>Posted at: {new Date(post.createdAt).toLocaleString()}</p>
                    {post.file && (
                      <img
                        className="feed-post-img"
                        src={`data:${post.file.type};base64,${post.file.data}`}
                        alt="Post Media"
                        style={{ width: "100%", height: "auto", border: "1px" }}
                      />
                    )}
                    <div className="reaction-button-container">
                      <MDBBtn

                        className={reactedPostIds.includes(post.id) ? "custom-success" : "custom-primary"}
                        style={{marginTop:'1rem'}}

                        onClick={() => handleReactionToggle(post.id)}
                      >
                        {reactedPostIds.includes(post.id) ? "Reacted" : "React"}
                      </MDBBtn>
                    </div>
                    <div className="add-comment-container">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Add a comment..."
                        value={commentInputs[post.id] || ""}  // Tie input to the specific post ID
                        onChange={(e) => handleCommentInputChange(post.id, e.target.value)}
                      />
                      <MDBBtn
                        className="submit-post-btn"
                        color="primary"
                        onClick={() => handleCommentSubmit(post.id)}
                      >
                        Comment
                      </MDBBtn>
                    </div>

                    {/* Display Comments */}
                    <div className="comments-section">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="comment d-flex align-items-center mb-3">
                            <img
                              src={comment.profileImage || "https://via.placeholder.com/40"}
                              className="rounded-circle"
                              height="35"
                              width="35"
                              alt="Commenter's Avatar"
                            />
                            <div className="ms-3 comment-container">
                              <strong>{comment.username}</strong>
                              <p>{comment.content}</p>
                            </div>
                            <div className="comment-date text-muted">
                              {new Date(comment.createdAt).toLocaleString()}
                              {userComments[post.id] && userComments[post.id].includes(comment.id) && (
                                <button
                                  className="btn btn-secondary btn-sm "
                                  style={{ fontSize: '12px', padding: '2px 5px', marginLeft:'4px'}}
                                  onClick={() => handleDeleteComment(post.id, comment.id)}
                                >
                                  &#10005;
                                </button>
                              )}

                            </div>
                          </div>
                        ))
                      ) : (
                        <p>No comments yet.</p>
                      )}
                    </div>
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
