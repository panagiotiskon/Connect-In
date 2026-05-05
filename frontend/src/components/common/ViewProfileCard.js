import {
  MDBCard,
  MDBCardBody,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
} from 'mdb-react-ui-kit';
import OptimizedImage from './OptimizedImage';
import useProfileImage from '../../hooks/useProfileImage';
import './ViewProfileCard.scss';

const ViewProfileCard = ({
  viewedUser,
  connections,
  onNavigateToProfile,
  currentUser,
}) => {
  const { profileImage } = useProfileImage(viewedUser?.id);
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';

  if (!viewedUser) {
    return <div>Loading...</div>;
  }

  const isCurrentUserInConnections = connections.some(
    (connection) => connection.userId === currentUser?.id
  );

  return (
    <MDBCard className="mb-4 view-profile-card">
      <MDBCardBody>
        <OptimizedImage
          src={profileImage}
          alt="avatar"
          className="rounded-circle view-profile-avatar"
          fallbackSrc="/profile-pic.png"
        />
        <p className="view-profile-name">
          {`${viewedUser.firstName} ${viewedUser.lastName}`}
        </p>
        {(isAdmin ||
          (isCurrentUserInConnections && connections.length > 0)) && (
          <div className="view-profile-connections-wrapper">
            <MDBDropdown>
              <MDBDropdownToggle
                tag="a"
                className="btn btn-primary mt-3 view-profile-connections-toggle"
              >
                Connections
              </MDBDropdownToggle>
              <MDBDropdownMenu>
                {connections.map((connection) => (
                  <MDBDropdownItem
                    key={connection.userId}
                    onClick={() => onNavigateToProfile(connection.userId)}
                    className="view-profile-connection-item"
                  >
                    <div>
                      <OptimizedImage
                        src={`data:${connection.profileType};base64,${connection.profilePic}`}
                        alt={`${connection.firstName} ${connection.lastName}`}
                        className="view-profile-connection-avatar"
                      />
                    </div>
                    {`${connection.firstName} ${connection.lastName}`}
                  </MDBDropdownItem>
                ))}
              </MDBDropdownMenu>
            </MDBDropdown>
          </div>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default ViewProfileCard;
