import { useRef } from 'react';
import { MDBCard, MDBCardBody, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import OptimizedImage from '../common/OptimizedImage';
import './CreatePostCard.scss';

const CreatePostCard = ({
  profileImage,
  postContent,
  setPostContent,
  uploadedFile,
  setUploadedFile,
  onSubmit,
  postError,
  submitting = false,
}) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile({ file, previewUrl: URL.createObjectURL(file), type: file.type });
    }
  };

  return (
    <MDBCard className="create-post-card shadow-0">
      <MDBCardBody className="create-post-body">

        {/* Avatar + text input */}
        <div className="create-post-top">
          <OptimizedImage
            src={profileImage}
            className="create-post-avatar"
            alt="Avatar"
          />
          <input
            type="text"
            className={`create-post-input${postError ? ' create-post-input--error' : ''}`}
            placeholder="What's on your mind?"
            value={postContent}
            maxLength={256}
            onChange={(e) => setPostContent(e.target.value)}
          />
        </div>
        {postContent?.length > 0 && (
          <p className={`create-post-char-count${postContent.length >= 256 ? ' at-limit' : postContent.length >= 220 ? ' near-limit' : ''}`}>
            {256 - postContent.length} / 256
          </p>
        )}
        {postError && <p className="create-post-error">{postError}</p>}

        {/* Media preview */}
        {uploadedFile && (
          <div className="media-preview-wrapper">
            {uploadedFile.type.startsWith('image/') && (
              <img src={uploadedFile.previewUrl} alt="Preview" />
            )}
            {uploadedFile.type.startsWith('video/') && (
              <video controls>
                <source src={uploadedFile.previewUrl} type={uploadedFile.type} />
              </video>
            )}
            {uploadedFile.type.startsWith('audio/') && (
              <audio controls>
                <source src={uploadedFile.previewUrl} type={uploadedFile.type} />
              </audio>
            )}
            <button
              className="remove-media-overlay"
              onClick={() => setUploadedFile(null)}
              aria-label="Remove media"
            >
              <MDBIcon fas icon="times" />
            </button>
          </div>
        )}

        <div className="create-post-divider" />

        {/* Media type buttons + POST */}
        <div className="create-post-actions">
          <input
            type="file"
            accept="image/*,video/*,audio/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <button
            className="media-type-btn image-type"
            onClick={() => fileInputRef.current.click()}
          >
            <MDBIcon far icon="image" />
            <span>Image</span>
          </button>
          <button
            className="media-type-btn video-type"
            onClick={() => fileInputRef.current.click()}
          >
            <MDBIcon fas icon="video" />
            <span>Video</span>
          </button>
          <button
            className="media-type-btn audio-type"
            onClick={() => fileInputRef.current.click()}
          >
            <MDBIcon fas icon="microphone" />
            <span>Audio</span>
          </button>

          <MDBBtn
            className="create-post-submit"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? 'Posting…' : 'Post'}
          </MDBBtn>
        </div>

      </MDBCardBody>
    </MDBCard>
  );
};

export default CreatePostCard;
