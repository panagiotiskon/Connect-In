import { useEffect, useState } from 'react';
import MessagingAPI from '../api/MessagingAPI';

const useConversations = (userId) => {
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    (async () => {
      try {
        const data = await MessagingAPI.getConversations(userId);
        if (!cancelled) setConversations(Array.isArray(data) ? data : []);
      } catch (error) {
        if (!cancelled) console.error('Error fetching conversations:', error);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  return conversations;
};

export default useConversations;
