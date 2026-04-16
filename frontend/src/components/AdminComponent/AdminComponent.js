import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAPI from '../../api/AdminAPI';
import NavBarAdminComponent from './NavBarAdminComponent';
import { MDBContainer, MDBBtn } from 'mdb-react-ui-kit';
import AdminUserCard from './AdminUserCard';
import { convertToXML } from './xmlConverter';

import './AdminComponent.scss';

export default function AdminComponent() {
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await AdminAPI.getUsers();
        const fetchedUsers = Array.isArray(response)
          ? response
          : response?.data || [];
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Failed to fetch users', error);
        setUsers([]);
      }
    };

    fetchUsers();
  }, []);


  // Handle checkbox change
  const handleCheckboxChange = (userId) => {
    setSelectedUsers((prevSelectedUsers) =>
      prevSelectedUsers.includes(userId)
        ? prevSelectedUsers.filter((id) => id !== userId)
        : [...prevSelectedUsers, userId]
    );
  };

  // Extract selected users' details
  const extractUsers = async (format) => {
    if (selectedUsers.length === 0) {
      alert('Please Select Users');
      return;
    }

    try {
      const userDetails = await AdminAPI.getUserDetails(selectedUsers);
      const fileName = `userDetails.${format}`;
      const mimeType =
        format === 'json' ? 'application/json' : 'application/xml';
      const content =
        format === 'json'
          ? JSON.stringify(userDetails, null, 2)
          : convertToXML(userDetails);

      downloadFile(fileName, content, mimeType);
    } catch (error) {
      console.error('Error extracting users:', error);
    }
  };

  // Helper function to download the file
  const downloadFile = (filename, content, mimeType) => {
    try {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url); // Clean up
    } catch (error) {
      console.error('Error downloading file:', error);
    }
  };

  const handleShowProfile = (userId) => {
    navigate(`/profile/${userId}`);
  };

  return (
    <div
      style={{
        backgroundColor: '#f3f2ef',
        minHeight: '100vh',
      }}
    >
      <NavBarAdminComponent />
      <MDBContainer fluid className="py-5">
        <div className="center-content">
          <h4 className="section-heading">Extract Selected Users</h4>
          <div className="button-group">
            <MDBBtn
              className="btn-custom "
              onClick={() => extractUsers('json')}
            >
              JSON Format
            </MDBBtn>
            <MDBBtn
              className="btn-custom btn-custom2"
              onClick={() => extractUsers('xml')}
            >
              XML Format
            </MDBBtn>
          </div>
        </div>
        {/* User cards layout */}
        <div className="card-container-admin d-flex flex-wrap justify-content-center">
          {users.map((user) => (
            <AdminUserCard
              key={user.id}
              user={user}
              isSelected={selectedUsers.includes(user.id)}
              onSelect={() => handleCheckboxChange(user.id)}
              onViewProfile={() => handleShowProfile(user.id)}
            />
          ))}
        </div>
      </MDBContainer>
    </div>
  );
}
