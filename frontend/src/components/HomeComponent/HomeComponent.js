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
import FileService from "../../api/UserFilesApi";
import PersonalInfoService from "../../api/UserPersonalInformationAPI";
import NotificationAPI from "../../api/NotificationAPI";
import "./HomeComponent.scss";

const HomeComponent = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({}); // Track comment input for each post
  const [postsMap, setPostsMap] = useState({});
  const [reactedPostIds, setReactedPostIds] = useState([]);
  const [userComments, setUserComments] = useState({});
  const [sortingMethod, setSortingMethod] = useState("date");
  const fileInputRef = useRef(null);
  const observerRef = useRef(null);

  const fetchPosts = async () => {
    if (currentUser) {
      try {
        const response =
          sortingMethod === "date"
            ? await PostService.getFeed(currentUser.id)
            : await PostService.getRecommendedPosts(currentUser.id);

        const fetchedPosts = Array.isArray(response)
          ? response
          : response?.data || [];
        const postsById = {};

        const postsWithUserPhotos = await Promise.all(
          fetchedPosts.map(async (post) => {
            const poster = await PersonalInfoService.getUser(post.userId);
            const commentsWithPhotos = await Promise.all(
              post.comments.map(async (comment) => {
                const userImage = await FileService.getUserImages(
                  comment.userId
                );
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
              posterName: `${poster.firstName} ${poster.lastName}`,
              posterImage: poster?.profilePictureData
                ? `data:image/jpeg;base64,${poster.profilePictureData}`
                : null,
            };
            postsById[post.id] = processedPost;

            return processedPost;
          })
        );

        setPosts(postsWithUserPhotos);
        setPostsMap(postsById);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setPosts([]);
      }
    }
  };

  useEffect(() => {
    if (posts.length > 0) {
      const observerCallback = async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute("data-post-id");
            if (postId) {
              try {
                await PostService.viewPosts(currentUser.id, postId);
                console.log(`Post ${postId} viewed by user ${currentUser.id}`);
              } catch (error) {
                console.error("Error viewing post:", error);
              }
            }
          }
        }
      };

      const observerOptions = {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      };

      observerRef.current = new IntersectionObserver(
        observerCallback,
        observerOptions
      );

      const postCards = document.querySelectorAll("[data-post-id]");
      postCards.forEach((postCard) => {
        observerRef.current.observe(postCard);
      });

      return () => {
        if (observerRef.current) {
          observerRef.current.disconnect();
        }
      };
    }
  }, [currentUser, posts]);

  useEffect(() => {
    if (currentUser) {
      fetchPosts();
    }
  }, [currentUser, sortingMethod]);

  const handleSortChange = (method) => {
    setSortingMethod(method);
  };

  const fetchReactedPostIds = async () => {
    try {
      const response = await PostService.getUserReactions();
      const userReactedPostIds = response?.data || [];
      setReactedPostIds(userReactedPostIds);
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
          setProfileImage(profileImageData);
        } else {
          setProfileImage(null);
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
      setUploadedFile({ file, previewUrl: fileUrl, type: file.type });
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
        const commentId = await PostService.createComment(postId, comment);
        console.log(commentId.data, "eeeeee");
        setCommentInputs((prev) => ({
          ...prev,
          [postId]: "",
        }));

        fetchPosts();

        if (post.userId !== currentUser.id) {
          await NotificationAPI.createNotification(
            post.userId,
            "COMMENT",
            currentUser.id,
            commentId.data
          );
        }
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
      const post = postsMap[postId];

      if (hasReacted) {
        await PostService.deleteReaction(postId);
        setReactedPostIds((prev) => prev.filter((id) => id !== postId)); // Remove from reacted post IDs
        await NotificationAPI.deleteNotificationByObjectId(postId);
      } else {
        await PostService.createReaction(postId);
        setReactedPostIds((prev) => [...prev, postId]);
        if (post.userId !== currentUser.id) {
          await NotificationAPI.createNotification(
            post.userId,
            "REACTION",
            currentUser.id,
            postId
          );
        }
      }
      fetchPosts();
    } catch (error) {
      console.error("Error handling reaction:", error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await PostService.deleteComment(postId, commentId);
      await NotificationAPI.deleteNotificationByObjectId(commentId);
      await fetchPosts();
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
            <ProfileCard
              currentUser={currentUser}
              profileImage={profileImage}
            />
            <div className="mt-4">
              <MDBTypography tag="h6" className="mb-3">
                Sort By:
              </MDBTypography>
              <div className="d-flex align-items-center mb-2">
                <input
                  type="radio"
                  id="date"
                  name="sorting"
                  className="me-2"
                  onClick={() => handleSortChange("date")}
                />
                <label htmlFor="date" className="mb-0">
                  Date Created
                </label>
              </div>
              <div className="d-flex align-items-center">
                <input
                  type="radio"
                  id="relevance"
                  name="sorting"
                  className="me-2"
                  onClick={() => handleSortChange("relevance")}
                />
                <label htmlFor="relevance" className="mb-0">
                  Relevance
                </label>
              </div>
            </div>
          </MDBCol>
          <MDBCol
            md="6"
            className="center-column"
            style={{ marginBottom: "1rem" }}
          >
            <MDBCard className="new-post-container shadow-0">
              <MDBCardBody className="pb-2 w-100">
                <div className="d-flex new-post-input-container">
                  <img
                    src={profileImage}
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
                    <MDBBtn
                      className="d-flex align-items-center me-4 video-btn"
                      onClick={handleImageClick}
                    >
                      <MDBIcon fas icon="video" className="me-2" />
                      <span>Video</span>
                    </MDBBtn>
                    <MDBBtn
                      className="d-flex align-items-center audio-btn"
                      onClick={handleImageClick}
                    >
                      <MDBIcon fas icon="microphone" className="me-2" />
                      <span>Audio</span>
                    </MDBBtn>
                  </MDBTypography>

                  <input
                    type="file"
                    accept="image/*,video/*,audio/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                  {uploadedFile && (
                    <div className="media-preview-container">
                      {uploadedFile.type.startsWith("image/") && (
                        <img
                          src={uploadedFile.previewUrl}
                          alt="Preview"
                          className="img-thumbnail mt-2"
                          width={120}
                        />
                      )}
                      {uploadedFile.type.startsWith("video/") && (
                        <video controls width="100%">
                          <source
                            src={uploadedFile.previewUrl}
                            type={uploadedFile.type}
                          />
                          Your browser does not support the video tag.
                        </video>
                      )}
                      {uploadedFile.type.startsWith("audio/") && (
                        <audio controls>
                          <source
                            src={uploadedFile.previewUrl}
                            type={uploadedFile.type}
                          />
                          Your browser does not support the audio element.
                        </audio>
                      )}
                      <MDBBtn
                        style={{
                          padding: "10px",
                          maxHeight: "1.9rem",
                          textAlign: "center",
                          marginLeft: "0.6rem",
                        }}
                        className="remove-media-btn"
                        color="danger"
                        onClick={handleRemoveImage}
                      >
                        <MDBIcon style={{ display: "flex" }} fas icon="times" />
                      </MDBBtn>
                    </div>
                  )}

                  <MDBBtn
                    className="submit-post-btn"
                    onClick={handlePostSubmit}
                  >
                    POST
                  </MDBBtn>
                </div>
              </MDBCardBody>
            </MDBCard>
            {posts.length > 0 ? (
              posts.map((post) => (
                <MDBCard
                  key={post.id}
                  data-post-id={post.id}
                  className="mt-3 shadow-0 feed-post"
                >
                  <MDBCardBody>
                    <div className="poster-info">
                      <img
                        src={post.posterImage}
                        className="rounded-circle"
                        height="45"
                        width="45"
                        alt="Poster Avatar"
                      />
                      <div className="poster-text">
                        <strong>{post.posterName}</strong>
                      </div>
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

                    {post.file && (
                      <div className="post-media-container">
                        {post.file.type.startsWith("image/") && (
                          <img
                            src={`data:${post.file.type};base64,${post.file.data}`}
                            alt="Post Image"
                            style={{
                              width: "100%",
                              height: "auto",
                              border: "1px solid #ddd",
                            }}
                          />
                        )}

                        {post.file.type.startsWith("video/") && (
                          <video controls width="100%" className="post-video">
                            <source
                              src={`data:${post.file.type};base64,${post.file.data}`}
                              type={post.file.type}
                            />
                            Your browser does not support the video tag.
                          </video>
                        )}

                        {post.file.type.startsWith("audio/") && (
                          <audio controls className="post-audio">
                            <source
                              src={`data:${post.file.type};base64,${post.file.data}`}
                              type={post.file.type}
                            />
                            Your browser does not support the audio element.
                          </audio>
                        )}
                      </div>
                    )}
                    <p
                      className="text-muted"
                      style={{
                        display: "flex",
                        margin: "0",
                        fontSize: "0.8rem",
                      }}
                    >
                      Posted at: {new Date(post.createdAt).toLocaleString()}
                    </p>
                    <div className="reaction-button-container">
                      <MDBBtn
                        className={
                          reactedPostIds.includes(post.id)
                            ? "custom-success"
                            : "custom-primary"
                        }
                        style={{ marginTop: "1rem" }}
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
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          handleCommentInputChange(post.id, e.target.value)
                        }
                      />
                      <MDBBtn
                        className="submit-post-btn"
                        color="primary"
                        onClick={() => handleCommentSubmit(post.id)}
                      >
                        Comment
                      </MDBBtn>
                    </div>

                    <div className="comments-section">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div
                            key={comment.commentId}
                            className="comment d-flex align-items-center mb-3"
                          >
                            <img
                              src={comment.profileImage}
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
                              {userComments[post.id] &&
                                userComments[post.id].includes(
                                  comment.commentId
                                ) && (
                                  <button
                                    className="btn btn-secondary btn-sm "
                                    style={{
                                      fontSize: "12px",
                                      padding: "2px 5px",
                                      marginLeft: "4px",
                                    }}
                                    onClick={() =>
                                      handleDeleteComment(
                                        post.id,
                                        comment.commentId
                                      )
                                    }
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
