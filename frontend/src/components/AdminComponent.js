import React, { useState } from "react";
import NavBarAdminComponent from "./NavBarAdminComponent";
import FooterComponent from "./common/FooterComponent";
import {
  MDBContainer,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCardTitle,
  MDBCardText,
  MDBBtn,
  MDBCheckbox,
} from "mdb-react-ui-kit";

// Mock Users Data
const mockUsers = [
  {
    id: 1,
    firstName: "John",
    lastName: "Doe",
    profilePic: "https://randomuser.me/api/portraits/men/1.jpg",
  },
  {
    id: 2,
    firstName: "Jane",
    lastName: "Smith",
    profilePic: "https://randomuser.me/api/portraits/women/1.jpg",
  },
  {
    id: 3,
    firstName: "Emily",
    lastName: "Johnson",
    profilePic: "https://randomuser.me/api/portraits/women/2.jpg",
  },
];

export default function AdminComponent() {
  const [selectedUsers, setSelectedUsers] = useState([]);

  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  const extractUsers = (format) => {
    const usersToExtract = mockUsers.filter((user) =>
      selectedUsers.includes(user.id)
    );

    if (format === "json") {
      const json = JSON.stringify(usersToExtract, null, 2);
      console.log("JSON Format:", json);
      // Implement a download functionality here
    } else if (format === "xml") {
      const xml = usersToExtract
        .map(
          (user) => `
        <user>
          <id>${user.id}</id>
          <firstName>${user.firstName}</firstName>
          <lastName>${user.lastName}</lastName>
          <profilePic>${user.profilePic}</profilePic>
        </user>
      `
        )
        .join("");
      const xmlString = `<users>${xml}</users>`;
      console.log("XML Format:", xmlString);
      // Implement a download functionality here
    }
  };

  return (
    <div>
      <NavBarAdminComponent />
      <MDBContainer fluid className="py-5">
        {/* Center the extract users section */}
        <div className="text-center mb-4">
          <h4>Extract Selected Users</h4>
          <div className="d-flex justify-content-center gap-2">
            <MDBBtn color="primary" onClick={() => extractUsers("json")}>
              JSON Format
            </MDBBtn>
            <MDBBtn color="secondary" onClick={() => extractUsers("xml")}>
              XML Format
            </MDBBtn>
          </div>
        </div>
        {/* User cards layout */}
        <div className="d-flex flex-wrap justify-content-start">
          {mockUsers.map((user) => (
            <MDBCard key={user.id} className="m-3" style={{ width: "18rem" }}>
              <MDBCardBody>
                {/* Center the image */}
                <div className="text-center mb-3">
                  <MDBCardImage
                    src={user.profilePic}
                    alt={`${user.firstName} ${user.lastName}`}
                    className="rounded-circle"
                    style={{
                      width: "120px",
                      height: "120px",
                      objectFit: "cover",
                    }}
                    fluid
                  />
                </div>
                {/* User name */}
                <MDBCardTitle className="text-center">
                  {user.firstName} {user.lastName}
                </MDBCardTitle>
                {/* Checkbox and button aligned left */}
                <MDBCardText className="d-flex flex-column align-items-start">
                  <MDBCheckbox
                    id={`user-${user.id}`}
                    label="Select"
                    className="mb-3"
                    onChange={() => handleCheckboxChange(user.id)}
                  />
                  <MDBBtn color="primary">Show Profile</MDBBtn>
                </MDBCardText>
              </MDBCardBody>
            </MDBCard>
          ))}
        </div>
      </MDBContainer>
    </div>
  );
}
