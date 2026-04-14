import { useEffect, useState } from 'react';
import { MDBContainer, MDBRow, MDBCol } from 'mdb-react-ui-kit';
import { useParams, useNavigate } from 'react-router-dom';
import NavbarAdminComponent from '../AdminComponent/NavBarAdminComponent';
import ProfileCard from '../common/ProfileCard';
import PersonalInfoService from '../../api/UserPersonalInformationAPI';
import { useAuth } from '../../context/AuthContext';
import NavbarComponent from '../common/NavBar';
import './ViewProfileComponent.scss';

const ViewProfileComponent = () => {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [cardsContent, setCardsContent] = useState({
    'Work Experience': [],
    Education: [],
    Skills: [],
  });
  const { user: currentUser } = useAuth();
  const isAdmin = currentUser?.role === 'ROLE_ADMIN';
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await PersonalInfoService.getUser(userId);

        if (!isAdmin && userData?.role === 'ROLE_ADMIN') {
          navigate('/unauthorized');
          return;
        }

        setUser(userData);

        const [educationData, workExperienceData, skillData] =
          await Promise.all([
            PersonalInfoService.getEducation(userId),
            PersonalInfoService.getExperience(userId),
            PersonalInfoService.getSkills(userId),
          ]);

        const formattedEducationData = educationData
          .filter((edu) => isAdmin || edu.isPublic)
          .map((edu) => ({
            universityName: edu.universityName,
            fieldOfStudy: edu.fieldOfStudy,
            startDate: edu.startDate,
            endDate: edu.endDate,
            isPublic: edu.isPublic,
          }));

        const formattedExperienceData = workExperienceData
          .filter((exp) => isAdmin || exp.isPublic)
          .map((exp) => ({
            jobTitle: exp.jobTitle,
            companyName: exp.companyName,
            startDate: exp.startDate,
            endDate: exp.endDate,
            isPublic: exp.isPublic,
          }));

        const formattedSkillData = skillData
          .filter((skill) => isAdmin || skill.isPublic)
          .map((skill) => ({
            skillTitle: skill.skillTitle,
            skillDescription: skill.skillDescription,
            isPublic: skill.isPublic,
          }));

        setCardsContent({
          'Work Experience': formattedExperienceData,
          Education: formattedEducationData,
          Skills: formattedSkillData,
        });
      } catch (error) {
        console.error('Error fetching user data', error);
      }
    };

    fetchData();
  }, [userId, navigate, isAdmin]);

  if (!user) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      {isAdmin ? <NavbarAdminComponent /> : <NavbarComponent />}

      <MDBContainer fluid className="profile-page">
        <MDBRow>
          <MDBCol md="4" className="mb-4 mb-md-0">
            <ProfileCard currentUser={user} isViewOnly={true} />
          </MDBCol>

          <MDBCol md="8">
            <div className="profile-sections">
              {/* Work Experience */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Work Experience</h2>
                </div>
                <div className="profile-section-body">
                  {cardsContent['Work Experience'].length === 0 ? (
                    <p className="profile-empty-state">
                      No work experience added yet.
                    </p>
                  ) : (
                    cardsContent['Work Experience'].map((exp) => (
                      <div
                        className="profile-entry"
                        key={exp?.jobTitle + exp?.startDate}
                      >
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
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Education */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Education</h2>
                </div>
                <div className="profile-section-body">
                  {cardsContent.Education.length === 0 ? (
                    <p className="profile-empty-state">
                      No education added yet.
                    </p>
                  ) : (
                    cardsContent.Education.map((edu) => (
                      <div
                        className="profile-entry"
                        key={edu?.universityName + edu?.startDate}
                      >
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
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Skills */}
              <div className="profile-section-card">
                <div className="profile-section-header">
                  <h2 className="profile-section-title">Skills</h2>
                </div>
                <div className="profile-section-body">
                  {cardsContent.Skills.length === 0 ? (
                    <p className="profile-empty-state">No skills added yet.</p>
                  ) : (
                    cardsContent.Skills.map((skill) => (
                      <div className="profile-entry" key={skill?.skillTitle}>
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
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default ViewProfileComponent;
