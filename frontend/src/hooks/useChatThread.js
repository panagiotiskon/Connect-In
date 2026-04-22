import { useEffect, useState } from 'react';
import MessagingAPI from '../api/MessagingAPI';
import useEventCallback from './useEventCallback';

const POLL_INTERVAL_MS = 3000;

const useChatThread = (currentUserId, peerUserId) => {
  const [messages, setMessages] = useState([]);

  const fetchMessages = useEventCallback(async () => {
    if (!currentUserId || !peerUserId) return;
    try {
      const data = await MessagingAPI.getConversation(
        currentUserId,
        peerUserId
      );
      setMessages(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching conversation messages:', error);
    }
  });

  useEffect(() => {
    setMessages([]);
    if (!currentUserId || !peerUserId) return undefined;
    fetchMessages();
    const id = setInterval(fetchMessages, POLL_INTERVAL_MS);
    return () => clearInterval(id);
  }, [currentUserId, peerUserId, fetchMessages]);

  const sendMessage = useEventCallback(async (text) => {
    const content = text?.trim();
    if (!content || !currentUserId || !peerUserId) return;
    try {
      await MessagingAPI.sendMessage(currentUserId, peerUserId, content);
      await fetchMessages();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  });

  return { messages, sendMessage };
};

export default useChatThread;
