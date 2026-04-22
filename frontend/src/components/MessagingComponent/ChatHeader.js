import { MDBIcon } from 'mdb-react-ui-kit';
import OptimizedImage from '../common/OptimizedImage';
import { base64ToDataURL } from '../../utils/messagingUtils';

const ChatHeader = ({ user, onBack }) => {
  const fullName = `${user.firstName} ${user.lastName}`;

  return (
    <header className="chat-header">
      <button
        type="button"
        className="chat-header__back"
        onClick={onBack}
        aria-label="Back to conversations"
      >
        <MDBIcon fas icon="arrow-left" />
      </button>
      <OptimizedImage
        src={base64ToDataURL(user.profilePic, user.picType)}
        alt={fullName}
        className="chat-header__avatar"
      />
      <h2 className="chat-header__name">{fullName}</h2>
    </header>
  );
};

export default ChatHeader;
