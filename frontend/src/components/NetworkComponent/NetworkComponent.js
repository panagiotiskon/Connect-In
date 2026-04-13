import { useCallback, useState } from 'react';
import { MDBContainer } from 'mdb-react-ui-kit';
import NavbarComponent from '../common/NavBar';
import ConnectedUsersCardComponent from './ConnectedUsersCardComponent';
import RegisteredUsersCardComponent from './RegisteredUsersCardComponent';
import ConnectionAPI from '../../api/ConnectionAPI';
import NotificationAPI from '../../api/NotificationAPI';
import { useAuth } from '../../context/AuthContext';
import MessagingAPI from '../../api/MessagingAPI';
import { useNavigate } from 'react-router-dom';
import PendingUsersCardComponent from './PendingUserCardComponent';
import { useSearchUsers } from '../../hooks/useSearchUsers';
import ConfirmActionModal from '../common/ConfirmActionModal';
import './NetworkComponent.scss';

const NetworkComponent = () => {
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const currentUserId = currentUser?.id;

  // type: 'connection' | 'pending'
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    type: null,
    targetUserId: null,
    isLoading: false,
  });

  const {
    searchTerm,
    displayedUsers,
    isLoading,
    isSearchActive,
    handleSearchChange,
    mutateConnections,
    mutatePending,
    mutateSearch,
  } = useSearchUsers(currentUserId);

  const handleConnect = useCallback(
    async (connectionUserId) => {
      if (!currentUserId) return;

      try {
        await ConnectionAPI.requestToConnect(currentUserId, connectionUserId);
        await NotificationAPI.createNotification(
          connectionUserId,
          'CONNECTION',
          currentUserId
        );
        mutateSearch();
        mutatePending();
      } catch (error) {
        console.error(
          'Error sending connection request or notification:',
          error
        );
      }
    },
    [currentUserId, mutateSearch, mutatePending]
  );

  const handleMessage = useCallback(
    async (connectedUserId) => {
      if (!currentUserId) return;

      try {
        await MessagingAPI.createConversation(currentUserId, connectedUserId);
        navigate(`/messaging`);
      } catch (error) {
        console.error(
          'Error creating conversation or navigating to messaging page:',
          error
        );
      }
    },
    [currentUserId, navigate]
  );

  const handleShowProfile = useCallback(
    (userId) => {
      navigate(`/profile/${userId}`);
    },
    [navigate]
  );

  const openDeleteModal = useCallback((connectionUserId) => {
    setDeleteModal({
      isOpen: true,
      type: 'connection',
      targetUserId: connectionUserId,
      isLoading: false,
    });
  }, []);

  const openPendingDeleteModal = useCallback((connectionUserId) => {
    setDeleteModal({
      isOpen: true,
      type: 'pending',
      targetUserId: connectionUserId,
      isLoading: false,
    });
  }, []);

  const closeDeleteModal = useCallback(() => {
    setDeleteModal({
      isOpen: false,
      type: null,
      targetUserId: null,
      isLoading: false,
    });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!currentUserId || !deleteModal.targetUserId) return;

    setDeleteModal((prev) => ({ ...prev, isLoading: true }));
    try {
      await ConnectionAPI.deleteConnection(
        currentUserId,
        deleteModal.targetUserId
      );

      if (deleteModal.type === 'pending') {
        await NotificationAPI.deleteNotification(
          deleteModal.targetUserId,
          currentUserId
        );
        mutatePending();
      } else {
        mutateConnections();
      }

      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting connection:', error);
      setDeleteModal((prev) => ({ ...prev, isLoading: false }));
    }
  }, [
    currentUserId,
    deleteModal.targetUserId,
    deleteModal.type,
    mutateConnections,
    mutatePending,
    closeDeleteModal,
  ]);

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="network-container">
        {/* Search Bar */}
        <div className="search-section">
          <div className="search-bar-wrapper">
            <input
              type="text"
              className="search-input-modern"
              placeholder="Search users by name, job title, or company..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
            {isSearchActive && isLoading && (
              <div className="search-loading">Searching...</div>
            )}
          </div>
        </div>

        {/* User Cards Grid */}
        <div className="card-container-network">
          {isLoading ? (
            <div className="loading-container">
              <div>Loading users...</div>
            </div>
          ) : displayedUsers.length > 0 ? (
            displayedUsers.map((user) => (
              <div key={user.userId} className="card-network">
                {isSearchActive ? (
                  <RegisteredUsersCardComponent
                    user={{
                      id: user.userId,
                      profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      job: user.jobTitle,
                      companyName: user.companyName,
                    }}
                    onConnect={() => handleConnect(user.userId)}
                    onShowProfile={() => handleShowProfile(user.userId)}
                  />
                ) : user.isPending ? (
                  <PendingUsersCardComponent
                    user={{
                      id: user.userId,
                      profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      job: user.jobTitle,
                      companyName: user.companyName,
                    }}
                    onShowProfile={() => handleShowProfile(user.userId)}
                    onDeletePending={() => openPendingDeleteModal(user.userId)}
                  />
                ) : (
                  <ConnectedUsersCardComponent
                    user={{
                      id: user.userId,
                      profileImage: `data:${user.profileType};base64,${user.profilePic}`,
                      firstName: user.firstName,
                      lastName: user.lastName,
                      job: user.jobTitle,
                      companyName: user.companyName,
                    }}
                    onMessage={() => handleMessage(user.userId)}
                    onShowProfile={() => handleShowProfile(user.userId)}
                    onDelete={() => openDeleteModal(user.userId)}
                  />
                )}
              </div>
            ))
          ) : (
            <div className="no-users-found">
              <div>
                {isSearchActive
                  ? 'No users found matching your search'
                  : 'No connections yet. Start connecting with users!'}
              </div>
            </div>
          )}
        </div>
      </MDBContainer>

      <ConfirmActionModal
        isOpen={deleteModal.isOpen}
        title={
          deleteModal.type === 'pending'
            ? 'Cancel Request'
            : 'Remove Connection'
        }
        message={
          deleteModal.type === 'pending'
            ? 'Are you sure you want to cancel this connection request?'
            : 'Are you sure you want to remove this connection?'
        }
        confirmText="Confirm"
        cancelText="Cancel"
        onConfirm={confirmDelete}
        onCancel={closeDeleteModal}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
};

export default NetworkComponent;
