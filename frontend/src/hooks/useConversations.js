import { useEffect, useState } from 'react';
import MessagingAPI from '../api/MessagingAPI';

const useConversations = (userId) => {
  const [conversations, setConversations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    setIsLoading(true);
    (async () => {
      try {
        const data = await MessagingAPI.getConversations(userId);
        if (!cancelled) setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) console.error('Error fetching conversations:', error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return { conversations, isLoading };
};

export default useConversations;
