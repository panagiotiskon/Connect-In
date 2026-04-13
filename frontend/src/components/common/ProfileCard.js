import { useEffect, useState } from 'react';
import { MDBIcon } from 'mdb-react-ui-kit';
import { useNavigate } from 'react-router-dom';
import FileService from '../../api/UserFilesApi';
import OptimizedImage from './OptimizedImage';
import './ProfileCard.scss';

const ProfileCard = ({ currentUser }) => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      try {
        const images = await FileService.getUserImages(currentUser.id);
        if (images?.length > 0) {
          setProfileImage(`data:${images[0].type};base64,${images[0].data}`);
        }
      } catch (e) {
        console.error('Error fetching profile image:', e);
      }
    })();
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div className="profile-card">
      <div className="profile-card__banner" />

      <div className="profile-card__body">
        <div className="profile-card__avatar-wrap">
          <OptimizedImage
            src={profileImage}
            alt="avatar"
            className="profile-card__avatar"
          />
        </div>

        <p className="profile-card__name" onClick={() => navigate('/profile')}>
          {currentUser.firstName} {currentUser.lastName}
        </p>
        <p className="profile-card__email">{currentUser.email}</p>

        <div className="profile-card__divider" />

        <div
          className="profile-card__network"
          onClick={() => navigate('/network')}
        >
          <MDBIcon fas icon="user-friends" />
          <span className="profile-card__network-label">Your Network</span>
          <MDBIcon fas icon="chevron-right" className="profile-card__network-chevron" />
        </div>

        <button
          className="profile-card__cta"
          onClick={() => navigate('/profile')}
        >
          View Profile
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
