import { useEffect, useRef, useState } from 'react';
import MessagingAPI from '../api/MessagingAPI';
import useEventCallback from './useEventCallback';

const POLL_INTERVAL_MS = 3000;

const useChatThread = (currentUserId, peerUserId) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isInitialFetch = useRef(false);

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
    } finally {
      if (isInitialFetch.current) {
        setIsLoading(false);
        isInitialFetch.current = false;
      }
    }
  });

  useEffect(() => {
    setMessages([]);
    if (!currentUserId || !peerUserId) return undefined;
    setIsLoading(true);
    isInitialFetch.current = true;
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

  return { messages, sendMessage, isLoading };
};

export default useChatThread;
