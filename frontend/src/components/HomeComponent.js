import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarToggler,
  MDBNavbarNav,
  MDBNavbarLink,
  MDBIcon,
  MDBCollapse,
  MDBNavbarItem,
  MDBCardBody,
  MDBCardImage,
  MDBCard,
  MDBTypography,
  MDBBtn,
  MDBRow,
  MDBCol,
  MDBCardText,
} from "mdb-react-ui-kit";
import ConnectInLogo from "../assets/ConnectIn.png"; // Adjust the path if needed
import AuthService from "../api/AuthenticationAPI";

const HomeComponent = () => {
  const navigate = useNavigate();
  const [openNavSecond, setOpenNavSecond] = useState(false);

  const currentUser = AuthService.getCurrentUser();
  const [comments, setComments] = useState({}); // To manage comments

  const posts = [
    {
      name: "Miley Cyrus",
      username: "@mileycyrus",
      time: "2h",
      content: "Lorem ipsum dolor, sit amet #consectetur adipisicing elit.",
      imageUrl: currentUser.photo, // Use current user's image
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
    return null;
  }

  const handleProfileClick = () =>
    navigate(`/profile/${currentUser.name}-${currentUser.surname}`);
  const handleConnectionsClick = () => navigate("/network");
  const handleHomeClick = () => window.location.reload();
  const handleNetworkClick = () => navigate("/network");
  const handleJobsClick = () => navigate("/jobs");
  const handleMessagingClick = () => navigate("/messaging");
  const handleNotificationsClick = () => navigate("/notifications");
  const handleProfilePageClick = () => navigate("/profile");
  const handleSettingsClick = () => navigate("/settings");

  const handleCommentChange = (postId, value) => {
    setComments((prev) => ({
      ...prev,
      [postId]: value,
    }));
  };

  const handleCommentSubmit = (postId) => {
    alert(`Comment submitted for post ${postId}: ${comments[postId]}`);
    // Reset comment input
    handleCommentChange(postId, "");
  };

  return (
    <>
      <MDBNavbar expand="lg" light bgColor="light">
        <MDBContainer
          fluid
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div style={{ flex: "0 1 auto" }}>
            <img
              src={ConnectInLogo}
              alt="ConnectIn Logo"
              style={{ width: "200px", height: "auto", marginLeft: "60px" }}
            />
          </div>
          <MDBNavbarToggler
            aria-expanded="false"
            aria-label="Toggle navigation"
            onClick={() => setOpenNavSecond(!openNavSecond)}
            style={{ flex: "0 1 auto", marginLeft: "20px" }} // Add margin here
          >
            <MDBIcon icon="bars" fas />
          </MDBNavbarToggler>
          <MDBCollapse navbar open={openNavSecond}>
            <MDBNavbarNav
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "100px", // Space between icons
                alignItems: "center",
              }}
            >
              <MDBNavbarItem
                className="d-flex flex-column align-items-center me-3 me-lg-0"
                style={{ margin: "0 325px" }}
              >
                <MDBNavbarLink
                  active
                  aria-current="page"
                  onClick={handleHomeClick}
                >
                  <MDBIcon fas icon="home" size="2x" />
                </MDBNavbarLink>
                <span>Home</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center">
                <MDBNavbarLink onClick={handleNetworkClick}>
                  <MDBIcon fas icon="users" size="2x" />
                </MDBNavbarLink>
                <span>Network</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center">
                <MDBNavbarLink onClick={handleJobsClick}>
                  <MDBIcon fas icon="suitcase" size="2x" />
                </MDBNavbarLink>
                <span>Jobs</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center">
                <MDBNavbarLink onClick={handleMessagingClick}>
                  <MDBIcon fas icon="message" size="2x" />
                </MDBNavbarLink>
                <span>Messaging</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center">
                <MDBNavbarLink onClick={handleNotificationsClick}>
                  <MDBIcon fas icon="exclamation" size="2x" />
                </MDBNavbarLink>
                <span>Notifications</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center">
                <MDBNavbarLink onClick={handleProfilePageClick}>
                  <MDBIcon fas icon="user-circle" size="2x" />
                </MDBNavbarLink>
                <span>Profile</span>
              </MDBNavbarItem>
              <MDBNavbarItem className="d-flex flex-column align-items-center">
                <MDBNavbarLink onClick={handleSettingsClick}>
                  <MDBIcon fas icon="cog" size="2x" />
                </MDBNavbarLink>
                <span>Settings</span>
              </MDBNavbarItem>
            </MDBNavbarNav>
          </MDBCollapse>
        </MDBContainer>
      </MDBNavbar>

      <MDBContainer fluid className="mt-4" style={{ padding: 0 }}>
        <MDBRow>
          <MDBCol md="4" className="ps-0">
            <MDBCard
              className="mb-4"
              style={{ width: "400px", marginLeft: "80px" }}
            >
              <MDBCardBody className="text-center">
                <MDBCardImage
                  src={currentUser.photo}
                  alt="avatar"
                  className="rounded-circle"
                  style={{ width: "120px", marginBottom: "1.5rem" }}
                  fluid
                />
                <p
                  onClick={handleProfileClick}
                  style={{
                    fontWeight: "bold",
                    fontSize: "1.2rem",
                    cursor: "pointer",
                  }}
                >
                  {`${currentUser.name} ${currentUser.surname}`}
                </p>
                <p
                  onClick={handleConnectionsClick}
                  style={{
                    fontWeight: "bold",
                    fontSize: "1rem",
                    cursor: "pointer",
                  }}
                >
                  Connections
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="6" style={{ marginRight: "300px" }}>
            <MDBCard className="shadow-0">
              <MDBCardBody className="border-bottom pb-2">
                <div className="d-flex">
                  <img
                    src={currentUser.photo}
                    className="rounded-circle"
                    height="50"
                    alt="Avatar"
                    loading="lazy"
                  />
                  <div className="d-flex align-items-center w-100 ps-3">
                    <div className="w-100">
                      <input
                        type="text"
                        id="form1"
                        className="form-control form-status border-0 py-1 px-0"
                        placeholder="Start a post"
                      />
                    </div>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <MDBTypography
                    listUnStyled
                    className="d-flex flex-row ps-3 pt-3"
                  >
                    <li className="d-flex align-items-center me-5">
                      <MDBIcon
                        far
                        icon="image"
                        className="pe-2"
                        style={{ fontSize: "2rem" }}
                      />
                      <span style={{ marginLeft: "0.5rem" }}>Image</span>
                    </li>
                    <li
                      className="d-flex align-items-center me-5"
                      style={{ marginRight: "2rem" }}
                    >
                      <MDBIcon
                        fas
                        icon="video"
                        className="px-2"
                        style={{ fontSize: "2rem" }}
                      />
                      <span style={{ marginLeft: "0.5rem" }}>Video</span>
                    </li>
                    <li className="d-flex align-items-center">
                      <MDBIcon
                        fas
                        icon="microphone"
                        className="px-2"
                        style={{ fontSize: "2rem" }}
                      />
                      <span style={{ marginLeft: "0.5rem" }}>Audio</span>
                    </li>
                  </MDBTypography>
                  <div className="d-flex align-items-center">
                    <MDBBtn rounded>POST</MDBBtn>
                  </div>
                </div>
              </MDBCardBody>
            </MDBCard>

            <div style={{ marginTop: "2rem" }}>
              {posts.map((post, index) => (
                <MDBCard className="mb-4" key={index}>
                  <MDBCardBody>
                    <div className="d-flex">
                      <img
                        src={post.imageUrl}
                        className="rounded-circle"
                        height="50"
                        alt="Avatar"
                        loading="lazy"
                      />
                      <div className="d-flex w-100 ps-3">
                        <div className="w-100">
                          <a href="#">
                            <h6 className="text-body">
                              {post.name}
                              <span className="small text-muted font-weight-normal mx-1">
                                {post.username}
                              </span>
                              <span className="small text-muted font-weight-normal me-1">
                                •
                              </span>
                              <span className="small text-muted font-weight-normal me-1">
                                {post.time}
                              </span>
                            </h6>
                          </a>
                          <p style={{ lineHeight: "1.2" }}>{post.content}</p>
                          {post.mediaUrl && (
                            <div className="ratio ratio-16x9 mb-3">
                              <iframe
                                src={post.mediaUrl}
                                title="YouTube video"
                                allowFullScreen
                              ></iframe>
                            </div>
                          )}
                          {post.cardImage && (
                            <MDBCard
                              className="border mb-3 shadow-0"
                              style={{ maxWidth: "540px" }}
                            ></MDBCard>
                          )}
                          <MDBTypography
                            listUnStyled
                            className="d-flex justify-content-between mb-0 pe-xl-5"
                          >
                            <MDBRow className="w-100">
                              <MDBCol>
                                <MDBBtn
                                  color="primary"
                                  size="sm"
                                  rounded
                                  onClick={() =>
                                    alert("Interested in this post!")
                                  }
                                >
                                  <MDBIcon
                                    fas
                                    icon="thumbs-up"
                                    className="me-1"
                                  />
                                  Interested
                                </MDBBtn>
                              </MDBCol>
                              <MDBCol className="text-end">
                                <MDBTypography
                                  listUnStyled
                                  className="d-flex justify-content-end mb-0"
                                >
                                  <li className="d-flex align-items-center me-4">
                                    <MDBIcon
                                      far
                                      icon="thumbs-up"
                                      className="me-2"
                                      style={{ fontSize: "1.5rem" }} // Adjust size as needed
                                    />
                                    {post.stats.likes}
                                  </li>
                                  <li className="d-flex align-items-center me-4">
                                    <MDBIcon
                                      far
                                      icon="comment"
                                      className="me-2"
                                      style={{ fontSize: "1.5rem" }} // Adjust size as needed
                                    />
                                    {post.stats.comments}
                                  </li>
                                </MDBTypography>
                              </MDBCol>
                            </MDBRow>
                          </MDBTypography>
                          <div className="mt-4 d-flex align-items-center">
                            <img
                              src={currentUser.photo}
                              className="rounded-circle"
                              height="50"
                              alt="Avatar"
                              loading="lazy"
                            />
                            <input
                              type="text"
                              placeholder="Add a comment..."
                              className="form-control"
                              value={comments[index] || ""}
                              onChange={(e) =>
                                handleCommentChange(index, e.target.value)
                              }
                              style={{ flex: 1 }} // Ensure input field takes available space
                            />
                            <MDBBtn
                              color="primary"
                              size="sm"
                              className="mt-0 ms-2"
                              rounded
                              onClick={() => handleCommentSubmit(index)}
                            >
                              Submit
                            </MDBBtn>
                          </div>
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
