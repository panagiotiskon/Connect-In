import React from "react";
import { MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import "./NetworkUserCards.scss";

const ConnectedUsersCardComponent = ({ user, onConnect, onShowProfile, onMessage, onDelete }) => {
  return (

    <div className="card-network">
        <MDBBtn
          className="d-flex btn-sm delete-connection-btn2"
          color="secondary"
          onClick={onDelete}
        >
          <MDBIcon fas icon="times" />
        </MDBBtn>
      <img
        src={user.profileImage}
        alt={`${user.firstName} ${user.lastName}`}
        className="profile-image-network"
      />
      <h5 className="card-title-network">{`${user.firstName} ${user.lastName}`}</h5>
      {user.job && <p className="card-subtitle-network">{user.job}</p>}
      {user.companyName && <p className="card-company-network">{user.companyName}</p>}
      <div className="button-container-network">
        <MDBBtn className="mdb-btn-network view-profile-btn-network" onClick={onShowProfile}>
          View Profile
        </MDBBtn>
        <MDBBtn className="mdb-btn-network message-btn-network" onClick={onMessage}>
          Message
        </MDBBtn>
      </div>
      {user.isConnected ? (
        <MDBBtn className="mdb-btn-network connected-btn-network" disabled>
          Connected
        </MDBBtn>
      ) : (
        <MDBBtn className="mdb-btn-network connect-btn-network" onClick={onConnect}>
          Connect
        </MDBBtn>
      )}
    </div>
  );
};

export default ConnectedUsersCardComponent;
