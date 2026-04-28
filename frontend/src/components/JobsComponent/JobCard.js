import { MDBIcon } from 'mdb-react-ui-kit';
import OptimizedImage from '../common/OptimizedImage';
import useProfileImage from '../../hooks/useProfileImage';

export const formatDate = (date) => (date ? new Date(date).toLocaleDateString() : '—');

export const groupApplicationsByJob = (applications) => {
  const appMap = {};
  (applications || []).forEach(({ jobPostId, userId, fullName }) => {
    if (!appMap[jobPostId]) appMap[jobPostId] = new Map();
    appMap[jobPostId].set(userId, { userId, fullName });
  });
  return Object.fromEntries(
    Object.entries(appMap).map(([id, map]) => [id, Array.from(map.values())])
  );
};

export const ApplicantRow = ({ applicant, onClick }) => {
  const { profileImage } = useProfileImage(applicant.userId);
  return (
    <div
      className={`jobs-applicant-row${!applicant.userId ? ' jobs-applicant-row--disabled' : ''}`}
      onClick={onClick}
    >
      <OptimizedImage
        src={profileImage}
        alt={applicant.fullName}
        className="jobs-applicant-avatar"
        fallbackSrc="/593.jpg"
      />
      <span className="jobs-applicant-name">{applicant.fullName}</span>
      {applicant.userId && (
        <MDBIcon fas icon="arrow-right" className="jobs-applicant-arrow" />
      )}
    </div>
  );
};

export const DeleteButton = ({ onClick, label }) => (
  <button className="jobs-entry-delete" onClick={onClick} aria-label={label}>
    <MDBIcon fas icon="times" />
  </button>
);

const JobCard = ({ job, showCreatedBy = false, badge, actions, children, ...props }) => (
  <div className="jobs-entry" {...props}>
    <div className="jobs-entry-content">
      {badge ? (
        <div className="jobs-entry-title-row">
          <span className="jobs-entry-title">{job.jobTitle}</span>
          {badge}
        </div>
      ) : (
        <div className="jobs-entry-title">{job.jobTitle}</div>
      )}
      <div className="jobs-entry-subtitle">{job.companyName}</div>
      <div className="jobs-entry-meta">
        {formatDate(job.createdAt)}
        {showCreatedBy && <>{' · '}By {job.createdBy}</>}
      </div>
      <div className="jobs-entry-description">{job.jobDescription}</div>
      {children}
    </div>
    <div className="jobs-entry-actions">{actions}</div>
  </div>
);

export default JobCard;
