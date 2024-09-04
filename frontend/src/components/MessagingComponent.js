import React from "react";
import NavbarComponent from "./common/NavBar";
import FooterComponent from "./common/FooterComponent";
import AuthService from "../api/AuthenticationAPI";
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

// Mocking AuthService
const getCurrentUser = () => {
  return AuthService.getCurrentUser();
};

export default function ChatComponent() {
  const currentUser = getCurrentUser();

  // Mocking three different chat users
  const chatUsers = [
    {
      id: 1,
      name: "Marie Horwitz",
      avatar:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp",
      lastMessage: "Hello, Are you there?",
      lastMessageTime: "Just now",
      unreadCount: 3,
      messages: [
        {
          sender: "Marie Horwitz",
          text: "Hello, Are you there?",
          time: "12:00 PM | Aug 13",
        },
        {
          sender: currentUser.name,
          text: "Yes, I'm here!",
          time: "12:01 PM | Aug 13",
        },
      ],
    },
    {
      id: 2,
      name: "John Doe",
      avatar:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava2-bg.webp",
      lastMessage: "When will we meet?",
      lastMessageTime: "5 mins ago",
      unreadCount: 1,
      messages: [
        {
          sender: "John Doe",
          text: "When will we meet?",
          time: "12:05 PM | Aug 13",
        },
        {
          sender: currentUser.name,
          text: "Let's meet at 2 PM.",
          time: "12:06 PM | Aug 13",
        },
      ],
    },
    {
      id: 3,
      name: "Anna Smith",
      avatar:
        "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3-bg.webp",
      lastMessage: "See you tomorrow!",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      messages: [
        {
          sender: "Anna Smith",
          text: "See you tomorrow!",
          time: "11:00 AM | Aug 13",
        },
        {
          sender: currentUser.name,
          text: "Looking forward to it!",
          time: "11:01 AM | Aug 13",
        },
      ],
    },
  ];

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
                  <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
                    <div className="p-3">
                      <MDBInputGroup className="rounded mb-3">
                        <input
                          className="form-control rounded"
                          placeholder="Search"
                          type="search"
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
                          {chatUsers.map((user) => (
                            <li className="p-2 border-bottom" key={user.id}>
                              <a
                                href="#!"
                                className="d-flex justify-content-between"
                              >
                                <div className="d-flex flex-row">
                                  <div>
                                    <img
                                      src={user.avatar}
                                      alt="avatar"
                                      className="d-flex align-self-center me-3"
                                      width="60"
                                    />
                                    <span className="badge bg-success badge-dot"></span>
                                  </div>
                                  <div className="pt-1">
                                    <p className="fw-bold mb-0">{user.name}</p>
                                    <p className="small text-muted">
                                      {user.lastMessage}
                                    </p>
                                  </div>
                                </div>
                                <div className="pt-1">
                                  <p className="small text-muted mb-1">
                                    {user.lastMessageTime}
                                  </p>
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
                    <div
                      style={{
                        position: "relative",
                        height: "400px",
                        overflowY: "auto",
                      }}
                      className="pt-3 pe-3"
                    >
                      {/* Mock messages for the first chat user (You can change this to dynamically load messages based on selected chat) */}
                      {chatUsers[0].messages.map((message, index) => (
                        <div
                          key={index}
                          className={`d-flex flex-row justify-content-${
                            message.sender === currentUser.name
                              ? "end"
                              : "start"
                          }`}
                        >
                          <img
                            src={
                              message.sender === currentUser.name
                                ? currentUser.avatar
                                : chatUsers[0].avatar
                            }
                            alt="avatar"
                            style={{ width: "45px", height: "100%" }}
                          />
                          <div>
                            <p
                              className="small p-2 ms-3 mb-1 rounded-3"
                              style={{
                                backgroundColor:
                                  message.sender === currentUser.name
                                    ? "#d1e7dd"
                                    : "#f5f6f7",
                              }}
                            >
                              {message.text}
                            </p>
                            <p className="small ms-3 mb-3 rounded-3 text-muted">
                              {message.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-muted d-flex justify-content-start align-items-center pe-2 pt-4 mx-6">
                      <img
                        src={currentUser.avatar}
                        alt="avatar 3"
                        style={{ width: "40px", height: "100%" }}
                      />
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        id="exampleFormControlInput2"
                        placeholder="Type message"
                      />
                      <a className="ms-1 text-muted" href="#!">
                        <MDBIcon fas icon="paperclip" />
                      </a>
                      <a className="ms-3 text-muted" href="#!">
                        <MDBIcon fas icon="smile" />
                      </a>
                      <a className="ms-3" href="#!">
                        <MDBIcon fas icon="paper-plane" />
                      </a>
                    </div>
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
