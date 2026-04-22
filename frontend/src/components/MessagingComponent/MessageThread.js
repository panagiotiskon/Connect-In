import { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import { isRenderableMessage } from '../../utils/messagingUtils';

const MessageThread = ({ messages, currentUserId }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    const node = scrollRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [messages]);

  return (
    <div ref={scrollRef} className="message-thread">
      {messages.filter(isRenderableMessage).map((message, index) => (
        <MessageBubble
          key={message.id ?? `${message.sentAt}-${index}`}
          message={message}
          isSelf={message.senderId === currentUserId}
        />
      ))}
    </div>
  );
};

export default MessageThread;
