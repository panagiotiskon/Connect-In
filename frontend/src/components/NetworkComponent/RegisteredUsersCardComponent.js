import React from "react";
import { MDBBtn } from "mdb-react-ui-kit";
import "./NetworkUserCards.scss";

const RegisteredUsersCardComponent = ({ user, onConnect, onShowProfile }) => {
  return (
    <div className="card-network">
      <img
        src={user.profileImage}
        alt={`${user.firstName} ${user.lastName}`}
        className="profile-image-network"
      />
      <h5 className="card-title-network">{`${user.firstName} ${user.lastName}`}</h5>
      {user.job && <p className="card-subtitle-network">{user.job}</p>}
      {user.companyName && <p className="card-company-network">{user.companyName}</p>}
      <div className="button-container-network">
        <MDBBtn className="view-network-button mdb-btn-network view-profile-btn-network" onClick={onShowProfile}>
          View Profile
        </MDBBtn>
        <MDBBtn className="mdb-btn-network connect-btn-network" onClick={onConnect}>
          Connect
        </MDBBtn>
      </div>
    </div>
  );
};

export default RegisteredUsersCardComponent;
