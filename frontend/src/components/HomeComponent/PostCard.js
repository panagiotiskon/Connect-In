import { useState } from 'react';
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import OptimizedImage from '../common/OptimizedImage';
import ConfirmActionModal from '../common/ConfirmActionModal';
import './PostCard.scss';

const PostCard = ({
  post = {},
  currentUser,
  hasReacted = false,
  commentInput = '',
  commentError = null,
  userComments = {},
  onReactionToggle = () => {},
  onCommentInputChange = () => {},
  onCommentSubmit = () => {},
  onDeletePost = () => {},
  onDeleteComment = () => {},
}) => {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const {
    id,
    userId,
    posterImage,
    posterName,
    createdAt,
    content,
    file,
    comments,
  } = post;

  return (
    <>
    <ConfirmActionModal
      isOpen={showDeleteModal}
      title="Delete Post"
      message="Are you sure you want to delete this post? This action cannot be undone."
      confirmText="Delete"
      onConfirm={() => { setShowDeleteModal(false); onDeletePost(id); }}
      onCancel={() => setShowDeleteModal(false)}
    />
    <MDBCard data-post-id={id} className="post-card shadow-0">
      <MDBCardBody className="post-card-body">
        {/* Header: avatar + name + timestamp + delete */}
        <div className="post-header">
          <OptimizedImage
            src={posterImage}
            className="post-header-avatar"
            alt="Poster Avatar"
          />
          <div className="post-header-info">
            <span className="post-author">{posterName}</span>
            <span className="post-timestamp">
              {createdAt && new Date(createdAt).toLocaleString()}
            </span>
          </div>
          {currentUser?.id === userId && (
            <button
              className="post-delete-btn"
              onClick={() => setShowDeleteModal(true)}
              aria-label="Delete post"
            >
              <MDBIcon fas icon="times" />
            </button>
          )}
        </div>

        {/* Post text */}
        {content && <p className="post-content-text">{content}</p>}

        {/* Media */}
        {file && (
          <div className="post-media">
            {file?.type?.startsWith('image/') && (
              <OptimizedImage
                src={`data:${file.type};base64,${file.data}`}
                alt="Post content"
              />
            )}
            {file?.type?.startsWith('video/') && (
              <video controls>
                <source
                  src={`data:${file.type};base64,${file.data}`}
                  type={file.type}
                />
              </video>
            )}
            {file?.type?.startsWith('audio/') && (
              <audio controls>
                <source
                  src={`data:${file.type};base64,${file.data}`}
                  type={file.type}
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
            onClick={() => onReactionToggle(id)}
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
            onChange={(e) => onCommentInputChange(id, e.target.value)}
          />
          <MDBBtn
            className="comment-submit-btn"
            onClick={() => onCommentSubmit(id)}
          >
            Comment
          </MDBBtn>
        </div>
        {commentError && <p className="comment-error">{commentError}</p>}

        {/* Comments list */}
        {comments?.length > 0 && (
          <div className="comments-list">
            {comments.map((comment) => {
              const { commentId, username, profileImage, content, createdAt } =
                comment;
              return (
                <div key={commentId} className="comment-item">
                  <OptimizedImage
                    src={profileImage || '/593.jpg'}
                    className="comment-item-avatar"
                    alt="Commenter Avatar"
                  />
                  <div className="comment-bubble">
                    <span className="comment-bubble-author">{username}</span>
                    <p className="comment-bubble-text">{content}</p>
                    <div className="comment-meta">
                      <span className="comment-time">
                        {createdAt && new Date(createdAt).toLocaleString()}
                      </span>
                      {userComments[id]?.includes(commentId) && (
                        <button
                          className="delete-comment-btn"
                          onClick={() => onDeleteComment(id, commentId)}
                          aria-label="Delete comment"
                        >
                          &#10005;
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </MDBCardBody>
    </MDBCard>
    </>
  );
};

export default PostCard;
