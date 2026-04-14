import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import OptimizedImage from '../common/OptimizedImage';
import './PostCard.scss';

const PostCard = ({
  post,
  currentUser,
  hasReacted,
  commentInput,
  commentError,
  userComments,
  onReactionToggle,
  onCommentInputChange,
  onCommentSubmit,
  onDeletePost,
  onDeleteComment,
}) => {
  return (
    <MDBCard data-post-id={post.id} className="post-card shadow-0">
      <MDBCardBody className="post-card-body">
        {/* Header: avatar + name + timestamp + delete */}
        <div className="post-header">
          <OptimizedImage
            src={post.posterImage}
            className="post-header-avatar"
            alt="Poster Avatar"
          />
          <div className="post-header-info">
            <span className="post-author">{post.posterName}</span>
            <span className="post-timestamp">
              {new Date(post.createdAt).toLocaleString()}
            </span>
          </div>
          {currentUser?.id === post.userId && (
            <button
              className="post-delete-btn"
              onClick={() => onDeletePost(post.id)}
              aria-label="Delete post"
            >
              <MDBIcon fas icon="times" />
            </button>
          )}
        </div>

        {/* Post text */}
        {post.content && <p className="post-content-text">{post.content}</p>}

        {/* Media */}
        {post.file && (
          <div className="post-media">
            {post.file.type.startsWith('image/') && (
              <OptimizedImage
                src={`data:${post.file.type};base64,${post.file.data}`}
                alt="Post content"
              />
            )}
            {post.file.type.startsWith('video/') && (
              <video controls>
                <source
                  src={`data:${post.file.type};base64,${post.file.data}`}
                  type={post.file.type}
                />
              </video>
            )}
            {post.file.type.startsWith('audio/') && (
              <audio controls>
                <source
                  src={`data:${post.file.type};base64,${post.file.data}`}
                  type={post.file.type}
                />
              </audio>
            )}
          </div>
        )}

        <div className="post-divider" />

        {/* Reaction */}
        <div className="post-actions">
          <button
            className={`reaction-btn${hasReacted ? ' reacted' : ''}`}
            onClick={() => onReactionToggle(post.id)}
          >
            {hasReacted ? '👌🏻 Reacted' : '👆🏻 React'}
          </button>
        </div>

        <div className="post-divider" />

        {/* Comment input */}
        <div className="comment-input-row">
          <input
            type="text"
            className={`comment-input${commentError ? ' comment-input--error' : ''}`}
            placeholder="Add a comment..."
            value={commentInput || ''}
            onChange={(e) => onCommentInputChange(post.id, e.target.value)}
          />
          <MDBBtn
            className="comment-submit-btn"
            onClick={() => onCommentSubmit(post.id)}
          >
            Comment
          </MDBBtn>
        </div>
        {commentError && <p className="comment-error">{commentError}</p>}

        {/* Comments list */}
        {post.comments?.length > 0 && (
          <div className="comments-list">
            {post.comments.map((comment) => (
              <div key={comment.commentId} className="comment-item">
                <OptimizedImage
                  src={comment.profileImage || '/593.jpg'}
                  className="comment-item-avatar"
                  alt="Commenter Avatar"
                />
                <div className="comment-bubble">
                  <span className="comment-bubble-author">
                    {comment.username}
                  </span>
                  <p className="comment-bubble-text">{comment.content}</p>
                  <div className="comment-meta">
                    <span className="comment-time">
                      {new Date(comment.createdAt).toLocaleString()}
                    </span>
                    {userComments[post.id]?.includes(comment.commentId) && (
                      <button
                        className="delete-comment-btn"
                        onClick={() =>
                          onDeleteComment(post.id, comment.commentId)
                        }
                        aria-label="Delete comment"
                      >
                        &#10005;
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default PostCard;
