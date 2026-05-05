import { MDBModal } from 'mdb-react-ui-kit';
import Spinner from './Spinner';
import './ConfirmActionModal.scss';

const ConfirmActionModal = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  isLoading = false,
}) => {
  return (
    <MDBModal open={isOpen} onClose={onCancel} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content modal-shell confirm-modal">
          <div className="modal-header confirm-modal__header">
            <h5 className="modal-title confirm-modal__title">{title}</h5>
            <button
              className="btn-close confirm-modal__close"
              onClick={onCancel}
              disabled={isLoading}
              aria-label="Close"
            />
          </div>

          <div className="modal-body confirm-modal__body">
            <p className="confirm-modal__message">{message}</p>
          </div>

          <div className="modal-footer confirm-modal__footer">
            <button
              className="confirm-modal__btn confirm-modal__btn--cancel"
              onClick={onCancel}
              disabled={isLoading}
            >
              {cancelText}
            </button>

            <button
              className="confirm-modal__btn confirm-modal__btn--confirm"
              onClick={onConfirm}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner />
                  <span>Loading…</span>
                </>
              ) : (
                confirmText
              )}
            </button>
          </div>
        </div>
      </div>
    </MDBModal>
  );
};

export default ConfirmActionModal;
