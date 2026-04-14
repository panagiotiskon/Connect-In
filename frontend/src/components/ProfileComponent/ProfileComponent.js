import { useEffect, useState, useCallback } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Toast } from 'react-bootstrap';
import NavbarComponent from '../common/NavBar';
import ProfileCard from '../common/ProfileCard';
import { useAuth } from '../../context/AuthContext';
import PersonalInfoService from '../../api/UserPersonalInformationAPI';
import './ProfileComponent.scss';
import AddEditModal from './AddEditModal';
import useProfileForm from './useProfileForm';

const ProfileComponent = () => {
  const { user: currentUser } = useAuth();
  const {
    showModal,
    selectedCard,
    modalContent,
    setModalContent,
    errorMessage,
    setErrorMessage,
    formData,
    updateFormField,
    resetFormData,
    handleModalClose,
    handleAddClick,
  } = useProfileForm();

  const [cardsContent, setCardsContent] = useState({
    'Work Experience': [],
    Education: [],
    Skills: [],
  });
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const userId = currentUser?.id;

  const fetchProfileData = useCallback(async () => {
    if (!userId) return;
    try {
      const [educationData, workExperienceData, skillData] = await Promise.all([
        PersonalInfoService.getEducation(userId),
        PersonalInfoService.getExperience(userId),
        PersonalInfoService.getSkills(userId),
      ]);

      setCardsContent({
        Education:
          educationData?.map((edu) => ({
            educationId: edu?.educationId,
            universityName: edu?.universityName,
            fieldOfStudy: edu?.fieldOfStudy,
            startDate: edu?.startDate,
            endDate: edu?.endDate,
            isPublic: edu?.isPublic,
          })) || [],
        'Work Experience':
          workExperienceData?.map((exp) => ({
            experienceId: exp?.experienceId,
            jobTitle: exp?.jobTitle,
            companyName: exp?.companyName,
            startDate: exp?.startDate,
            endDate: exp?.endDate,
            isPublic: exp?.isPublic,
          })) || [],
        Skills:
          skillData?.map((skill) => ({
            skillId: skill?.skillId,
            skillTitle: skill?.skillTitle,
            skillDescription: skill?.skillDescription,
            isPublic: skill?.isPublic,
          })) || [],
      });
    } catch (error) {
      console.error('Error fetching profile data', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchProfileData();
  }, [fetchProfileData]);

  const validateDates = () => {
    const now = new Date();
    const start = new Date(formData?.startDate);
    const end = formData?.endDate ? new Date(formData.endDate) : null;

    if (start > now) {
      setErrorMessage('Start date cannot be after the current date.');
      return false;
    }
    if (end && end > now) {
      setErrorMessage('End date cannot be after the current date.');
      return false;
    }
    if (end && start > end) {
      setErrorMessage('Start date cannot be after the end date.');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (selectedCard === 'Education') {
      if (
        !formData.universityName ||
        !formData.fieldOfStudy ||
        !formData.startDate
      ) {
        setErrorMessage('Please fill out all required fields.');
        return;
      }
      if (!validateDates()) return;

      try {
        const response = await PersonalInfoService.addEducation(userId, {
          universityName: formData.universityName,
          fieldOfStudy: formData.fieldOfStudy,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isPublic: formData.isPublic,
        });

        if (response?.status === 200) {
          const updated = await PersonalInfoService.getEducation(userId);
          setCardsContent((prev) => ({
            ...prev,
            Education:
              updated?.map((edu) => ({
                educationId: edu?.educationId,
                universityName: edu?.universityName,
                fieldOfStudy: edu?.fieldOfStudy,
                startDate: edu?.startDate,
                endDate: edu?.endDate,
                isPublic: edu?.isPublic,
              })) || [],
          }));
          setToastMessage('Successfully added Education!');
          setShowToast(true);
          resetFormData();
          handleModalClose();
        } else {
          setErrorMessage('Failed to save education.');
        }
      } catch {
        setErrorMessage('Failed to save education.');
      }
    } else if (selectedCard === 'Work Experience') {
      if (!formData.jobTitle || !formData.companyName || !formData.startDate) {
        setErrorMessage('Please fill out all required fields.');
        return;
      }
      if (!validateDates()) return;

      try {
        const response = await PersonalInfoService.addExperience(userId, {
          jobTitle: formData.jobTitle,
          companyName: formData.companyName,
          startDate: formData.startDate,
          endDate: formData.endDate,
          isPublic: formData.isPublic,
        });

        if (response?.status === 200) {
          const updated = await PersonalInfoService.getExperience(userId);
          setCardsContent((prev) => ({
            ...prev,
            'Work Experience':
              updated?.map((exp) => ({
                experienceId: exp?.experienceId,
                jobTitle: exp?.jobTitle,
                companyName: exp?.companyName,
                startDate: exp?.startDate,
                endDate: exp?.endDate,
                isPublic: exp?.isPublic,
              })) || [],
          }));
          setToastMessage('Successfully added Work Experience!');
          setShowToast(true);
          resetFormData();
          handleModalClose();
        } else {
          setErrorMessage('Failed to save work experience.');
        }
      } catch {
        setErrorMessage('Failed to save work experience.');
      }
    } else if (selectedCard === 'Skills') {
      if (!formData.skillTitle || !formData.skillDescription) {
        setErrorMessage('Please fill out all required fields.');
        return;
      }

      try {
        const response = await PersonalInfoService.addSkill(userId, {
          skillTitle: formData.skillTitle,
          skillDescription: formData.skillDescription,
          isPublic: formData.isPublic,
        });

        if (response?.status === 200) {
          const updated = await PersonalInfoService.getSkills(userId);
          setCardsContent((prev) => ({
            ...prev,
            Skills:
              updated?.map((skill) => ({
                skillId: skill?.skillId,
                skillTitle: skill?.skillTitle,
                skillDescription: skill?.skillDescription,
                isPublic: skill?.isPublic,
              })) || [],
          }));
          setToastMessage('Successfully added Skill!');
          setShowToast(true);
          resetFormData();
          handleModalClose();
        } else {
          setErrorMessage('Failed to save skill.');
        }
      } catch {
        setErrorMessage('Failed to save skill.');
      }
    }
  };

  const handleDelete = async (id, category) => {
    try {
      if (category === 'Education') {
        await PersonalInfoService.deleteEducation(userId, id);
      } else if (category === 'Work Experience') {
        await PersonalInfoService.deleteExperience(userId, id);
      } else if (category === 'Skills') {
        await PersonalInfoService.deleteSkill(userId, id);
      }

      setCardsContent((prev) => {
        let updatedContent = [];
        if (category === 'Education') {
          updatedContent = prev['Education'].filter(
            (item) => item.educationId !== id
          );
        } else if (category === 'Work Experience') {
          updatedContent = prev['Work Experience'].filter(
            (item) => item.experienceId !== id
          );
        } else if (category === 'Skills') {
          updatedContent = prev['Skills'].filter((item) => item.skillId !== id);
        }
        return { ...prev, [category]: updatedContent };
      });

      setToastMessage(`Successfully deleted ${category.slice(0, -1)}!`);
      setShowToast(true);
    } catch {
      setErrorMessage(`Failed to delete ${category.slice(0, -1)}.`);
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div>
      <NavbarComponent />

      <MDBContainer fluid className="profile-page">
        <MDBRow>
          <MDBCol md="4" className="mb-4 mb-md-0">
            <ProfileCard currentUser={currentUser} />
          </MDBCol>

          <MDBCol md="8">
            <div className="profile-sections">
              {/* Work Experience */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Work Experience</h2>
                  <button
                    className="profile-add-btn"
                    onClick={() => handleAddClick('Work Experience')}
                  >
                    + Add
                  </button>
                </div>
                <div className="profile-section-body">
                  {cardsContent['Work Experience'].length === 0 ? (
                    <p className="profile-empty-state">
                      No work experience added yet.
                    </p>
                  ) : (
                    cardsContent['Work Experience'].map((exp) => (
                      <div className="profile-entry" key={exp.experienceId}>
                        <div className="profile-entry-content">
                          <div className="profile-entry-title">
                            {exp?.jobTitle}
                          </div>
                          <div className="profile-entry-subtitle">
                            {exp?.companyName}
                          </div>
                          <div className="profile-entry-meta">
                            {exp?.startDate}
                            {exp?.endDate ? ` – ${exp.endDate}` : ' – Present'}
                          </div>
                          <span
                            className={
                              exp?.isPublic
                                ? 'profile-entry-visibility'
                                : 'profile-entry-visibility--private'
                            }
                          >
                            {exp?.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                        <button
                          className="profile-entry-delete"
                          onClick={() =>
                            handleDelete(exp?.experienceId, 'Work Experience')
                          }
                          aria-label="Delete"
                        >
                          <MDBIcon fas icon="times" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Education</h2>
                  <button
                    className="profile-add-btn"
                    onClick={() => handleAddClick('Education')}
                  >
                    + Add
                  </button>
                </div>
                <div className="profile-section-body">
                  {cardsContent.Education.length === 0 ? (
                    <p className="profile-empty-state">
                      No education added yet.
                    </p>
                  ) : (
                    cardsContent.Education.map((edu) => (
                      <div className="profile-entry" key={edu?.educationId}>
                        <div className="profile-entry-content">
                          <div className="profile-entry-title">
                            {edu?.universityName}
                          </div>
                          <div className="profile-entry-subtitle">
                            {edu?.fieldOfStudy}
                          </div>
                          <div className="profile-entry-meta">
                            {edu?.startDate}
                            {edu?.endDate ? ` – ${edu.endDate}` : ' – Present'}
                          </div>
                          <span
                            className={
                              edu?.isPublic
                                ? 'profile-entry-visibility'
                                : 'profile-entry-visibility--private'
                            }
                          >
                            {edu?.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                        <button
                          className="profile-entry-delete"
                          onClick={() =>
                            handleDelete(edu?.educationId, 'Education')
                          }
                          aria-label="Delete"
                        >
                          <MDBIcon fas icon="times" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Skills</h2>
                  <button
                    className="profile-add-btn"
                    onClick={() => handleAddClick('Skills')}
                  >
                    + Add
                  </button>
                </div>
                <div className="profile-section-body">
                  {cardsContent.Skills.length === 0 ? (
                    <p className="profile-empty-state">No skills added yet.</p>
                  ) : (
                    cardsContent.Skills.map((skill) => (
                      <div className="profile-entry" key={skill?.skillId}>
                        <div className="profile-entry-content">
                          <div className="profile-entry-title">
                            {skill?.skillTitle}
                          </div>
                          <div className="profile-entry-subtitle">
                            {skill?.skillDescription}
                          </div>
                          <span
                            className={
                              skill?.isPublic
                                ? 'profile-entry-visibility'
                                : 'profile-entry-visibility--private'
                            }
                          >
                            {skill?.isPublic ? 'Public' : 'Private'}
                          </span>
                        </div>
                        <button
                          className="profile-entry-delete"
                          onClick={() => handleDelete(skill?.skillId, 'Skills')}
                          aria-label="Delete"
                        >
                          <MDBIcon fas icon="times" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
      <AddEditModal
        showModal={showModal}
        handleModalClose={handleModalClose}
        selectedCard={selectedCard}
        errorMessage={errorMessage}
        formData={formData}
        updateFormField={updateFormField}
        modalContent={modalContent}
        setModalContent={setModalContent}
        handleSave={handleSave}
      />
      <Toast
        onClose={() => setShowToast(false)}
        show={showToast}
        delay={3000}
        autohide
        className="profile-toast"
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default ProfileComponent;
