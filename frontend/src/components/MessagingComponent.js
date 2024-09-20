import React, { useState, useEffect, useRef } from "react";
import NavbarComponent from "./common/NavBar";
import MessagingAPI from "../api/MessagingAPI";
import AuthService from "../api/AuthenticationAPI";
import FileService from "../api/UserFilesApi";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBTypography,
  MDBIcon,
  MDBInputGroup,
} from "mdb-react-ui-kit";

const base64ToDataURL = (base64String, picType) =>
  `data:${picType};base64,${base64String}`;

export default function ChatComponent() {
  const [conversations, setConversations] = useState([]);
  const [filteredConversations, setFilteredConversations] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [conversationMessages, setConversationMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [profileImage, setProfileImage] = useState("");
  const [pollingIntervalId, setPollingIntervalId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const messageContainerRef = useRef(null);

  useEffect(() => {
    const fetchCurrentUserAndConversations = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);

        if (user) {
          const data = await MessagingAPI.getConversations(user.id);
          setConversations(data);
          setFilteredConversations(data);
        }
      } catch (error) {
        console.error("Error fetching current user or conversations:", error);
      }
    };

    fetchCurrentUserAndConversations();
  }, []);

  useEffect(() => {
    if (selectedUser && currentUser) {
      const fetchMessages = async () => {
        try {
          const messages = await MessagingAPI.getConversation(
            currentUser.id,
            selectedUser.userId
          );
          setConversationMessages(messages);
        } catch (error) {
          console.error("Error fetching conversation messages:", error);
        }
      };

      const intervalId = setInterval(fetchMessages, 3000);
      setPollingIntervalId(intervalId);

      return () => clearInterval(intervalId);
    }
  }, [selectedUser, currentUser]);

  useEffect(() => {
    const fetchProfileImage = async () => {
      if (selectedUser) {
        try {
          const images = await FileService.getUserImages(currentUser.id);
          if (images.length > 0) {
            const { type, data } = images[0];
            setProfileImage(`data:${type};base64,${data}`);
          }
        } catch (error) {
          console.error("Error fetching user images:", error);
        }
      }
    };

    fetchProfileImage();
  }, [selectedUser]);

  const sendMessage = async () => {
    if (messageInput.trim() !== "" && currentUser && selectedUser) {
      try {
        // Send message via API
        await MessagingAPI.sendMessage(
          currentUser.id,
          selectedUser.userId,
          messageInput
        );

        setMessageInput("");
        const updatedMessages = await MessagingAPI.getConversation(
          currentUser.id,
          selectedUser.userId
        );
        setConversationMessages(updatedMessages);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    if (currentUser) {
      try {
        const messages = await MessagingAPI.getConversation(
          currentUser.id,
          user.userId
        );
        setConversationMessages(messages);
      } catch (error) {
        console.error("Error fetching conversation messages:", error);
        setConversationMessages([]);
      }
    }
  };

  useEffect(() => {
    const filterConversations = () => {
      const lowercasedSearchTerm = searchTerm.toLowerCase();
      const filtered = conversations.filter((user) => {
        const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
        const [firstNameSearch, lastNameSearch] =
          lowercasedSearchTerm.split(" ");
        if (lastNameSearch) {
          return (
            user.firstName.toLowerCase().startsWith(firstNameSearch) &&
            user.lastName.toLowerCase().startsWith(lastNameSearch)
          );
        }
        return (
          user.firstName.toLowerCase().startsWith(lowercasedSearchTerm) ||
          user.lastName.toLowerCase().startsWith(lowercasedSearchTerm)
        );
      });
      setFilteredConversations(filtered);
    };

    filterConversations();
  }, [searchTerm, conversations]);

  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [conversationMessages]);

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="py-5">
        <MDBRow>
          <MDBCol md="12">
            <MDBCard
              id="chat3"
              style={{ borderRadius: "20px", height: "550px" }}
            >
              <MDBCardBody>
                <MDBRow>
                  <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0"
                    style ={{
                      border: "1px solid #ccc",
                      borderRadius: "6px",
                    }}>
                    <div className="p-3">
                      <MDBInputGroup className="rounded mb-3">
                        <input
                          className="form-control rounded"
                          placeholder="Search"
                          type="search"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span
                          className="input-group-text border-0"
                          id="search-addon"
                        >
                          <MDBIcon fas icon="search" />
                        </span>
                      </MDBInputGroup>

                      <div
                        style={{
                          position: "relative",
                          height: "400px",
                          overflowY: "auto",
                        }}
                      >
                        <MDBTypography listUnStyled className="mb-0">
                          {filteredConversations.map((user) => (
                            <li
                              className="p-2 border-bottom"
                              key={user.userId}
                              onClick={() => handleUserClick(user)}
                            >
                              <a
                                href="#!"
                                className="d-flex justify-content-between"
                              >
                                <div className="d-flex flex-row">
                                  <div>
                                    <img
                                      src={base64ToDataURL(
                                        user.profilePic,
                                        user.picType
                                      )}
                                      alt="avatar"
                                      className="d-flex align-self-center me-3"
                                      width="60"
                                    />
                                  </div>
                                  <div className="pt-1">
                                    <p className="fw-bold mb-0">
                                      {user.firstName} {user.lastName}
                                    </p>
                                  </div>
                                </div>
                                <div className="pt-1 text-end">
                                  {user.unreadCount > 0 && (
                                    <span className="badge bg-danger rounded-pill float-end">
                                      {user.unreadCount}
                                    </span>
                                  )}
                                </div>
                              </a>
                            </li>
                          ))}
                        </MDBTypography>
                      </div>
                    </div>
                  </MDBCol>
                  <MDBCol md="6" lg="7" xl="8">
                    {selectedUser ? (
                      <div>
                        <div
                          ref={messageContainerRef}
                          style={{
                            position: "relative",
                            height: "400px",
                            overflowY: "auto",
                          }}
                          className="pt-3 pe-3"
                        >
                          {conversationMessages.map((message, index) => {
                            if (
                              !message ||
                              !message.message ||
                              !message.profilePicture ||
                              !message.picType
                            ) {
                              return null;
                            }

                            const isCurrentUser =
                              message.senderId === currentUser.id;

                            return (
                              <div
                                key={index}
                                className={`d-flex flex-row ${
                                  isCurrentUser
                                    ? "justify-content-end"
                                    : "justify-content-start"
                                } mb-2`}
                                style={{ alignItems: "flex-start" }}
                              >
                                {!isCurrentUser && (
                                  <img
                                    src={base64ToDataURL(
                                      message.profilePicture,
                                      message.picType
                                    )}
                                    alt="avatar"
                                    style={{
                                      width: "45px",
                                      height: "auto",
                                      marginRight: "10px",
                                    }}
                                  />
                                )}
                                <div
                                  style={{
                                    maxWidth: "70%",
                                    wordWrap: "break-word",
                                    whiteSpace: "pre-wrap",
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: isCurrentUser
                                      ? "flex-end"
                                      : "flex-start",
                                  }}
                                >
                                  <p
                                    className={`small p-2 mb-1 rounded-3`}
                                    style={{
                                      backgroundColor: isCurrentUser
                                        ? "#d1e7dd"
                                        : "#f5f6f7",
                                      textAlign: isCurrentUser
                                        ? "left"
                                        : "right",
                                      margin: 0,
                                    }}
                                  >
                                    {message.message}
                                  </p>
                                  <p
                                    className="small text-muted"
                                    style={{
                                      margin: 0,
                                      alignSelf: isCurrentUser
                                        ? "flex-end"
                                        : "flex-start",
                                    }}
                                  >
                                    {new Date(
                                      message.sentAt
                                    ).toLocaleTimeString()}
                                  </p>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                        <div className="text-muted d-flex justify-content-start align-items-center pe-2 pt-4 mx-6">
                          <img
                            src={profileImage}
                            alt="avatar 3"
                            style={{
                              width: "50px",
                              padding: "5px",
                              marginTop: "-15px",
                            }}
                          />
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="exampleFormControlInput2"
                            placeholder="Type message"
                            value={messageInput}
                            onChange={(e) => setMessageInput(e.target.value)}
                          />
                          <a
                            className="ms-1 text-muted"
                            href="#!"
                            onClick={sendMessage}
                            style={{ marginTop: "-15px" }}
                          >
                            <MDBIcon fas icon="paper-plane" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center text-muted">
                        <p>Select a user to start chatting</p>
                      </div>
                    )}
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
}
