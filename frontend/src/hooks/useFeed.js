import { useCallback, useEffect, useState } from 'react';
import PostService from '../api/PostApi';
import { processPost } from '../utils/postUtils';

const fetchFeed = async (userId, sortingMethod) => {
  const response =
    sortingMethod === 'date'
      ? await PostService.getFeed(userId)
      : await PostService.getRecommendedPosts(userId);

  return Array.isArray(response)
    ? response
    : response?.items || response?.data || [];
};

const useFeed = (userId, sortingMethod) => {
  const [posts, setPosts] = useState([]);
  const [postsMap, setPostsMap] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return undefined;
    let cancelled = false;
    setLoading(true);
    fetchFeed(userId, sortingMethod)
      .then((fetched) => {
        if (cancelled) return;
        const processed = fetched.map(processPost);
        setPosts(processed);
        setPostsMap(Object.fromEntries(processed.map((p) => [p.id, p])));
      })
      .catch((error) => {
        if (cancelled) return;
        console.error('Error fetching posts:', error);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [userId, sortingMethod]);

  const updatePost = useCallback((postId, updater) => {
    setPosts((prev) =>
      prev.map((post) => (post.id === postId ? updater(post) : post))
    );
    setPostsMap((prev) => {
      const existing = prev[postId];
      if (!existing) return prev;
      return { ...prev, [postId]: updater(existing) };
    });
  }, []);

  const removePost = useCallback((postId) => {
    setPosts((prev) => prev.filter((post) => post.id !== postId));
    setPostsMap((prev) => {
      if (!(postId in prev)) return prev;
      const next = { ...prev };
      delete next[postId];
      return next;
    });
  }, []);

  const prependPost = useCallback((rawPost) => {
    const processed = processPost(rawPost);
    setPosts((prev) => [processed, ...prev]);
    setPostsMap((prev) => ({ ...prev, [processed.id]: processed }));
  }, []);

  const restorePostAt = useCallback((index, post) => {
    setPosts((prev) => {
      const next = [...prev];
      next.splice(index, 0, post);
      return next;
    });
    setPostsMap((prev) => ({ ...prev, [post.id]: post }));
  }, []);

  return {
    posts,
    postsMap,
    loading,
    updatePost,
    removePost,
    prependPost,
    restorePostAt,
  };
};

export default useFeed;
