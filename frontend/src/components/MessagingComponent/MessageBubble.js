import { memo } from 'react';
import OptimizedImage from '../common/OptimizedImage';
import { base64ToDataURL, formatMessageTime } from '../../utils/messagingUtils';

const MessageBubble = ({ message, isSelf }) => {
  const className = isSelf
    ? 'message-bubble message-bubble--self'
    : 'message-bubble';

  return (
    <div className={className}>
      {!isSelf && (
        <OptimizedImage
          src={base64ToDataURL(message.profilePicture, message.picType)}
          alt=""
          className="message-bubble__avatar"
        />
      )}
      <div className="message-bubble__content">
        <p className="message-bubble__text">{message.message}</p>
        <span className="message-bubble__time">
          {formatMessageTime(message.sentAt)}
        </span>
      </div>
    </div>
  );
};

export default memo(MessageBubble);
