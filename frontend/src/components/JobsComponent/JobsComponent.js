import { memo, useState, useRef, useEffect, useCallback } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import NavbarComponent from '../common/NavBar';
import ProfileCard from '../common/ProfileCard';
import SortingCard from '../common/SortingCard';
import CreateJobModal from './CreateJobModal';
import SkeletonCard from '../common/SkeletonCard';
import Spinner from '../common/Spinner';
import ConfirmActionModal from '../common/ConfirmActionModal';
import OptimizedImage from '../common/OptimizedImage';
import { useAuth } from '../../context/AuthContext';
import JobAPI from '../../api/JobAPI';
import { useNavigate } from 'react-router-dom';
import useProfileImage from '../../hooks/useProfileImage';
import './JobsComponent.scss';

const DELETE_JOB = 'delete-job';
const WITHDRAW_APPLICATION = 'withdraw-application';

const CONFIRM_COPY = {
  [DELETE_JOB]: {
    title: 'Delete Job',
    message: 'Are you sure you want to delete this job posting?',
    confirmText: 'Delete',
  },
  [WITHDRAW_APPLICATION]: {
    title: 'Withdraw Application',
    message: 'Are you sure you want to withdraw your application?',
    confirmText: 'Withdraw',
  },
};

const ApplicantRow = memo(({ applicant, onClick }) => {
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
});

const JobsComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openApplicantsId, setOpenApplicantsId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [applyingJobId, setApplyingJobId] = useState(null);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const { user: currentUser } = useAuth();
  const [sortingMethod, setSortingMethod] = useState('date');
  const navigate = useNavigate();
  const observerRef = useRef(null);

  const fetchJobsByDate = useCallback(async () => {
    if (currentUser) {
      try {
        const response = await JobAPI.getJobPosts(currentUser.id);
        setJobs(response || []);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        setJobs([]);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    const fetchJobs = async () => {
      if (currentUser) {
        setLoadingJobs(true);
        try {
          if (sortingMethod === 'date') {
            const response = await JobAPI.getJobPosts(currentUser.id);
            setJobs(response || []);
          } else if (sortingMethod === 'relevance') {
            const response = await JobAPI.getRecommendedJobs(currentUser.id);
            setJobs(response || []);
          }
        } catch (error) {
          console.error('Error fetching jobs:', error);
          setJobs([]);
        } finally {
          setLoadingJobs(false);
        }
      }
    };
    fetchJobs();
  }, [currentUser, sortingMethod]);

  const fetchApplications = useCallback(async () => {
    if (currentUser) {
      try {
        const response = await JobAPI.getJobApplications(currentUser.id);
        const appMap = {};
        (response || []).forEach((application) => {
          const { jobPostId, userId, fullName } = application;
          if (!jobPostId || !userId) return;
          if (!appMap[jobPostId]) appMap[jobPostId] = new Map();
          appMap[jobPostId].set(userId, { userId, fullName });
        });
        const formattedAppMap = {};
        Object.keys(appMap).forEach((jobPostId) => {
          formattedAppMap[jobPostId] = Array.from(appMap[jobPostId].values());
        });
        setApplications(formattedAppMap);
      } catch (error) {
        console.error('Error fetching applications:', error);
      }
    }
  }, [currentUser]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  useEffect(() => {
    const fetchJobs = async () => {
      await fetchJobsByDate();
      await fetchApplications();
    };
    fetchJobs();
  }, [fetchJobsByDate, fetchApplications]);

  const handleCreateJob = async (title, company, description) => {
    await JobAPI.createJobPost(currentUser.id, title, company, description);
    fetchJobsByDate();
  };

  const handleApply = async (jobId) => {
    if (!currentUser) return;
    setApplyingJobId(jobId);
    try {
      await JobAPI.applyToJob(currentUser.id, jobId);
      setJobs((prev) =>
        prev.map((job) => (job.id === jobId ? { ...job, applied: true } : job))
      );
    } catch (error) {
      console.error('Error applying to job:', error);
    } finally {
      setApplyingJobId(null);
    }
  };

  const requestDeleteJob = (jobId) =>
    setPendingAction({ type: DELETE_JOB, jobId });

  const requestWithdrawApplication = (jobId) =>
    setPendingAction({ type: WITHDRAW_APPLICATION, jobId });

  const cancelPendingAction = () => setPendingAction(null);

  const confirmPendingAction = async () => {
    if (!currentUser || !pendingAction) return;
    setIsConfirming(true);
    try {
      if (pendingAction.type === DELETE_JOB) {
        await JobAPI.deleteJob(currentUser.id, pendingAction.jobId);
        setJobs((prev) => prev.filter((job) => job.id !== pendingAction.jobId));
      } else if (pendingAction.type === WITHDRAW_APPLICATION) {
        await JobAPI.unapplyFromJob(currentUser.id, pendingAction.jobId);
        setJobs((prev) =>
          prev.map((job) =>
            job.id === pendingAction.jobId ? { ...job, applied: false } : job
          )
        );
      }
    } catch (error) {
      console.error('Error confirming action:', error);
    } finally {
      setIsConfirming(false);
      setPendingAction(null);
    }
  };

  const confirmDialog = pendingAction ? CONFIRM_COPY[pendingAction.type] : null;

  const handleProfileNavigation = (userId) => navigate(`/profile/${userId}`);

  const yourJobs = jobs.filter((job) => job.userId === currentUser?.id);
  const appliedJobs = jobs.filter(
    (job) => job.userId !== currentUser?.id && job.applied
  );
  const otherJobs = jobs.filter(
    (job) => job.userId !== currentUser?.id && !job.applied
  );

  useEffect(() => {
    if (otherJobs.length === 0) return;

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const jobId = entry.target.getAttribute('data-job-id');
          if (jobId) {
            JobAPI.viewJobPost(currentUser.id, jobId).catch((error) =>
              console.error('Error viewing job:', error)
            );
          }
        }
      });
    };

    observerRef.current = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    });

    document.querySelectorAll('[data-job-id]').forEach((el) => {
      observerRef.current.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, [currentUser, otherJobs]);

  useEffect(() => {
    const handleClickOutside = () => setOpenApplicantsId(null);
    if (openApplicantsId !== null) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openApplicantsId]);

  return (
    <>
      <ConfirmActionModal
        isOpen={!!confirmDialog}
        title={confirmDialog?.title}
        message={confirmDialog?.message}
        confirmText={confirmDialog?.confirmText}
        isLoading={isConfirming}
        onConfirm={confirmPendingAction}
        onCancel={cancelPendingAction}
      />

      <div>
        <NavbarComponent />
        <MDBContainer fluid className="jobs-container">
          <MDBRow>
            <MDBCol md="4" className="left-column mb-4 mb-md-0">
              <ProfileCard currentUser={currentUser} />
            </MDBCol>

            <MDBCol
              md="8"
              className="center-column"
              style={{ marginBottom: '1rem' }}
            >
              {/* Created by you */}
              <div className="jobs-section-card">
                <div className="jobs-section-header">
                  <h2 className="jobs-section-title">Created by you</h2>
                  <button
                    className="jobs-action-btn"
                    onClick={() => setShowCreateModal(true)}
                  >
                    + Create Job
                  </button>
                </div>
                <div className="jobs-section-body">
                  {loadingJobs ? (
                    <SkeletonCard count={1} />
                  ) : yourJobs.length === 0 ? (
                    <p className="jobs-empty-state">No jobs created by you.</p>
                  ) : (
                    yourJobs.map((job) => (
                      <div className="jobs-entry" key={job.id}>
                        <div className="jobs-entry-content">
                          <div className="jobs-entry-title">{job.jobTitle}</div>
                          <div className="jobs-entry-subtitle">
                            {job.companyName}
                          </div>
                          <div className="jobs-entry-meta">
                            {job.createdAt
                              ? new Date(job.createdAt).toLocaleDateString()
                              : '—'}
                          </div>
                          <div className="jobs-entry-description">
                            {job.jobDescription}
                          </div>
                          {applications[job.id]?.length > 0 && (
                            <div className="jobs-applicants-wrapper">
                              <button
                                className="jobs-applicants-toggle"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setOpenApplicantsId(
                                    openApplicantsId === job.id ? null : job.id
                                  );
                                }}
                              >
                                <span className="jobs-applicants-count">
                                  {applications[job.id].length}
                                </span>
                                {applications[job.id].length === 1
                                  ? 'Applicant'
                                  : 'Applicants'}
                                <MDBIcon
                                  fas
                                  icon={
                                    openApplicantsId === job.id
                                      ? 'chevron-up'
                                      : 'chevron-down'
                                  }
                                  className="jobs-applicants-chevron"
                                />
                              </button>
                              {openApplicantsId === job.id && (
                                <div className="jobs-applicants-panel">
                                  {applications[job.id].map((applicant, idx) => (
                                    <ApplicantRow
                                      key={applicant.userId ?? idx}
                                      applicant={applicant}
                                      onClick={() => {
                                        if (!applicant.userId) return;
                                        handleProfileNavigation(applicant.userId);
                                        setOpenApplicantsId(null);
                                      }}
                                    />
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                        <div className="jobs-entry-actions">
                          <button
                            className="jobs-entry-delete"
                            onClick={() => requestDeleteJob(job.id)}
                            aria-label="Delete"
                          >
                            <MDBIcon fas icon="times" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Applied to */}
              <div className="jobs-section-card">
                <div className="jobs-section-header">
                  <h2 className="jobs-section-title">Applied to</h2>
                </div>
                <div className="jobs-section-body">
                  {loadingJobs ? (
                    <SkeletonCard count={1} />
                  ) : appliedJobs.length === 0 ? (
                    <p className="jobs-empty-state">
                      You haven't applied to any jobs yet.
                    </p>
                  ) : (
                    appliedJobs.map((job) => (
                      <div className="jobs-entry" key={job.id}>
                        <div className="jobs-entry-content">
                          <div className="jobs-entry-title-row">
                            <span className="jobs-entry-title">
                              {job.jobTitle}
                            </span>
                            <span className="jobs-applied-badge">✓ Applied</span>
                          </div>
                          <div className="jobs-entry-subtitle">
                            {job.companyName}
                          </div>
                          <div className="jobs-entry-meta">
                            {new Date(job.createdAt).toLocaleDateString()}
                            {' · '}By {job.createdBy}
                          </div>
                          <div className="jobs-entry-description">
                            {job.jobDescription}
                          </div>
                        </div>
                        <div className="jobs-entry-actions">
                          <button
                            className="jobs-entry-delete"
                            onClick={() => requestWithdrawApplication(job.id)}
                            aria-label="Withdraw"
                          >
                            <MDBIcon fas icon="times" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              <SortingCard
                sortingMethod={sortingMethod}
                onSortChange={setSortingMethod}
              />

              {/* Top picks */}
              <div className="jobs-section-card">
                <div className="jobs-section-header">
                  <h2 className="jobs-section-title">Top picks for you</h2>
                </div>
                <div className="jobs-section-body">
                  {loadingJobs ? (
                    <SkeletonCard count={1} />
                  ) : otherJobs.length === 0 ? (
                    <p className="jobs-empty-state">No other jobs available.</p>
                  ) : (
                    otherJobs.map((job) => (
                      <div
                        className="jobs-entry"
                        key={job.id}
                        data-job-id={job.id}
                      >
                        <div className="jobs-entry-content">
                          <div className="jobs-entry-title">{job.jobTitle}</div>
                          <div className="jobs-entry-subtitle">
                            {job.companyName}
                          </div>
                          <div className="jobs-entry-meta">
                            {new Date(job.createdAt).toLocaleDateString()}
                            {' · '}By {job.createdBy}
                          </div>
                          <div className="jobs-entry-description">
                            {job.jobDescription}
                          </div>
                        </div>
                        <div className="jobs-entry-actions">
                          {job.applied ? (
                            <span className="jobs-applied-badge">✓ Applied</span>
                          ) : (
                            currentUser && (
                              <button
                                className="jobs-action-btn"
                                onClick={() => handleApply(job.id)}
                                disabled={applyingJobId === job.id}
                              >
                                {applyingJobId === job.id ? (
                                  <>
                                    <Spinner />
                                    Applying…
                                  </>
                                ) : (
                                  'Apply'
                                )}
                              </button>
                            )
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </MDBCol>
          </MDBRow>
        </MDBContainer>

        <CreateJobModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateJob}
        />
      </div>
    </>
  );
};

export default JobsComponent;
