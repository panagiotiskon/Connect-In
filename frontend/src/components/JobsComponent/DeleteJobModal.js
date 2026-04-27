import ConfirmActionModal from '../common/ConfirmActionModal';

const DeleteJobModal = ({ isOpen, isLoading, onConfirm, onCancel }) => (
  <ConfirmActionModal
    isOpen={isOpen}
    title="Delete Job"
    message="Are you sure you want to delete this job posting? This action cannot be undone."
    confirmText="Delete"
    onConfirm={onConfirm}
    onCancel={onCancel}
    isLoading={isLoading}
  />
);

export default DeleteJobModal;
