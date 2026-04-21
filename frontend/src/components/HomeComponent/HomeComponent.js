import { useState, useEffect, useRef, useCallback } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import NavbarComponent from '../common/NavBar';
import ProfileCard from '../common/ProfileCard';
import CreatePostCard from './CreatePostCard';
import SortingCard from '../common/SortingCard';
import PostCard from './PostCard';
import SkeletonCard from '../common/SkeletonCard';
import { useAuth } from '../../context/AuthContext';
import PostService from '../../api/PostApi';
import FileService from '../../api/UserFilesApi';
import PersonalInfoService from '../../api/UserPersonalInformationAPI';
import NotificationAPI from '../../api/NotificationAPI';
import useProfileImage from '../../hooks/useProfileImage';
import './HomeComponent.scss';

const HomeComponent = () => {
  const { user: currentUser } = useAuth();
  const { profileImage } = useProfileImage(currentUser?.id);
  const [postContent, setPostContent] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [posts, setPosts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [postsMap, setPostsMap] = useState({});
  const [reactedPostIds, setReactedPostIds] = useState([]);
  const [userComments, setUserComments] = useState({});
  const [sortingMethod, setSortingMethod] = useState('date');
  const [commentErrors, setCommentErrors] = useState({});
  const [postError, setPostError] = useState(null);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const observerRef = useRef(null);

  const fetchPosts = useCallback(async () => {
    if (!currentUser) return;
    setLoadingPosts(true);
    try {
      const response =
        sortingMethod === 'date'
          ? await PostService.getFeed(currentUser.id)
          : await PostService.getRecommendedPosts(currentUser.id);

      const fetchedPosts = Array.isArray(response)
        ? response
        : response?.items || response?.data || [];

      const postsById = {};

      const postsWithUserPhotos = await Promise.all(
        fetchedPosts.map(async (post) => {
          const poster = await PersonalInfoService.getUser(post.userId);
          const commentsWithPhotos = await Promise.all(
            post.comments.map(async (comment) => {
              const userImage = await FileService.getUserImages(comment.userId);
              const userProfileImage =
                userImage.length > 0
                  ? `data:${userImage[0].type};base64,${userImage[0].data}`
                  : null;
              return { ...comment, profileImage: userProfileImage };
            })
          );

          const processedPost = {
            ...post,
            posterName: poster.firstName + ' ' + poster.lastName,
            posterImage: poster?.profilePictureData
              ? `data:image/jpeg;base64,${poster.profilePictureData}`
              : '/593.jpg',
            comments: commentsWithPhotos,
          };

          postsById[post.id] = processedPost;
          return processedPost;
        })
      );

      setPosts(postsWithUserPhotos);
      setPostsMap(postsById);
    } catch (error) {
      console.error('Error fetching posts:', error);
      setPosts([]);
    } finally {
      setLoadingPosts(false);
    }
  }, [currentUser, sortingMethod]);

  useEffect(() => {
    if (posts.length === 0) return;

    observerRef.current = new IntersectionObserver(
      async (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const postId = entry.target.getAttribute('data-post-id');
            if (postId) {
              try {
                await PostService.viewPosts(currentUser.id, postId);
              } catch (error) {
                console.error('Error viewing post:', error);
              }
            }
          }
        }
      },
      { root: null, rootMargin: '0px', threshold: 0.5 }
    );

    document.querySelectorAll('[data-post-id]').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [currentUser, posts]);

  useEffect(() => {
    if (currentUser) fetchPosts();
  }, [currentUser, sortingMethod, fetchPosts]);

  useEffect(() => {
    if (!currentUser?.id) return;
    let cancelled = false;
    (async () => {
      const [reactions, comments] = await Promise.all([
        PostService.getUserReactions(currentUser.id),
        PostService.getUserComments(currentUser.id),
      ]);
      if (cancelled) return;
      setReactedPostIds(reactions?.data || []);
      setUserComments(comments?.data || {});
    })();
    return () => {
      cancelled = true;
    };
  }, [currentUser]);

  const handlePostSubmit = async () => {
    if (!postContent.trim() && !uploadedFile) {
      setPostError('Post content or media is required.');
      return;
    }
    setPostError(null);
    try {
      await PostService.createPost(
        currentUser.id,
        postContent,
        uploadedFile?.file
      );
      setPostContent('');
      setUploadedFile(null);
      fetchPosts();
    } catch (error) {
      console.error('Error submitting post:', error);
    }
  };

  const handleCommentInputChange = (postId, value) => {
    setCommentInputs((prev) => ({ ...prev, [postId]: value }));
    if (value.trim()) {
      setCommentErrors((prev) => ({ ...prev, [postId]: null }));
    }
  };

  const handleCommentSubmit = async (postId) => {
    const comment = commentInputs[postId];
    if (!comment?.trim()) {
      setCommentErrors((prev) => ({
        ...prev,
        [postId]: 'Comment cannot be empty.',
      }));
      return;
    }
    setCommentErrors((prev) => ({ ...prev, [postId]: null }));
    try {
      const post = postsMap[postId];
      if (!post) {
        console.error('Post not found for the given postId:', postId);
        return;
      }
      const commentId = await PostService.createComment(
        currentUser.id,
        postId,
        comment
      );
      setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
      setUserComments((prev) => ({
        ...prev,
        [postId]: [...(prev[postId] || []), commentId.data],
      }));
      fetchPosts();
      if (post.userId !== currentUser.id) {
        await NotificationAPI.createNotification(
          post.userId,
          'COMMENT',
          currentUser.id,
          commentId.data
        );
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      alert('Failed to submit comment.');
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await PostService.deletePost(currentUser.id, postId);
      fetchPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Failed to delete post.');
    }
  };

  const handleReactionToggle = async (postId) => {
    try {
      const hasReacted = reactedPostIds.includes(postId);
      const post = postsMap[postId];
      if (hasReacted) {
        await PostService.deleteReaction(currentUser.id, postId);
        setReactedPostIds((prev) => prev.filter((id) => id !== postId));
        await NotificationAPI.deleteNotificationByObjectId(postId);
      } else {
        await PostService.createReaction(currentUser.id, postId);
        setReactedPostIds((prev) => [...prev, postId]);
        if (post.userId !== currentUser.id) {
          await NotificationAPI.createNotification(
            post.userId,
            'REACTION',
            currentUser.id,
            postId
          );
        }
      }
      fetchPosts();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  const handleDeleteComment = async (postId, commentId) => {
    try {
      await PostService.deleteComment(currentUser.id, postId, commentId);
      await NotificationAPI.deleteNotificationByObjectId(commentId);
      await fetchPosts();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment.');
    }
  };

  return (
    <>
      <NavbarComponent />
      <MDBContainer fluid className="home-container">
        <MDBRow>
          <MDBCol md="4" className="left-column">
            <ProfileCard
              currentUser={currentUser}
              profileImage={profileImage}
            />
          </MDBCol>
          <MDBCol
            md="8"
            className="center-column"
            style={{ marginBottom: '1rem' }}
          >
            <CreatePostCard
              profileImage={profileImage}
              postContent={postContent}
              setPostContent={(val) => {
                setPostContent(val);
                if (val.trim()) setPostError(null);
              }}
              uploadedFile={uploadedFile}
              setUploadedFile={(val) => {
                setUploadedFile(val);
                if (val) setPostError(null);
              }}
              postError={postError}
              onSubmit={handlePostSubmit}
            />
            <SortingCard
              sortingMethod={sortingMethod}
              onSortChange={setSortingMethod}
            />
            {loadingPosts ? (
              <SkeletonCard count={3} />
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  currentUser={currentUser}
                  hasReacted={reactedPostIds.includes(post.id)}
                  commentInput={commentInputs[post.id]}
                  commentError={commentErrors[post.id]}
                  userComments={userComments}
                  onReactionToggle={handleReactionToggle}
                  onCommentInputChange={handleCommentInputChange}
                  onCommentSubmit={handleCommentSubmit}
                  onDeletePost={handleDeletePost}
                  onDeleteComment={handleDeleteComment}
                />
              ))
            ) : (
              <p>No posts available.</p>
            )}
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </>
  );
};

export default HomeComponent;
