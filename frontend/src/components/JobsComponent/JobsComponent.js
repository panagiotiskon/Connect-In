import { useState, useRef, useEffect, useCallback } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import NavbarComponent from '../common/NavBar';
import ProfileCard from '../common/ProfileCard';
import SortingCard from '../common/SortingCard';
import DeleteJobModal from './DeleteJobModal';
import CreateJobModal from './CreateJobModal';
import SkeletonCard from '../common/SkeletonCard';
import Spinner from '../common/Spinner';
import { useAuth } from '../../context/AuthContext';
import JobAPI from '../../api/JobAPI';
import { useNavigate } from 'react-router-dom';
import './JobsComponent.scss';

const JobsComponent = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openApplicantsId, setOpenApplicantsId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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
          appMap[jobPostId].set(userId, { userId, fullName: fullName });
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
    if (currentUser) {
      setApplyingJobId(jobId);
      try {
        await JobAPI.applyToJob(currentUser.id, jobId);
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, applied: true } : job
          )
        );
      } catch (error) {
        console.error('Error applying to job:', error);
      } finally {
        setApplyingJobId(null);
      }
    }
  };

  const handleConfirmDelete = async () => {
    if (!currentUser || !pendingDeleteId) return;
    setIsDeleting(true);
    try {
      await JobAPI.deleteJob(currentUser.id, pendingDeleteId);
      setJobs((prevJobs) =>
        prevJobs.filter((job) => job.id !== pendingDeleteId)
      );
    } catch (error) {
      console.error('Error deleting job:', error);
    } finally {
      setIsDeleting(false);
      setPendingDeleteId(null);
    }
  };

  const handleProfileNavigation = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const yourJobs = jobs.filter((job) => job.userId === currentUser?.id);
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

  // Close applicants dropdown on outside click
  useEffect(() => {
    const handleClickOutside = () => setOpenApplicantsId(null);
    if (openApplicantsId !== null) {
      document.addEventListener('click', handleClickOutside);
    }
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openApplicantsId]);

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="jobs-container">
        <MDBRow>
          {/* Left Column — Profile Card (same as homepage) */}
          <MDBCol md="4" className="left-column mb-4 mb-md-0">
            <ProfileCard currentUser={currentUser} />
          </MDBCol>

          {/* Center Column — Sort + Jobs (same structure as homepage) */}
          <MDBCol
            md="8"
            className="center-column"
            style={{ marginBottom: '1rem' }}
          >
            {/* Your Jobs */}
            <div className="jobs-section-card">
              <div className="jobs-section-header">
                <h2 className="jobs-section-title">Your Jobs</h2>
                <button
                  className="jobs-action-btn"
                  onClick={() => setShowCreateModal(true)}
                >
                  + Create Job
                </button>
              </div>
              <div className="jobs-section-body">
                {loadingJobs ? (
                  <SkeletonCard count={2} />
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
                                  <div
                                    key={applicant.userId ?? idx}
                                    className={`jobs-applicant-row${!applicant.userId ? ' jobs-applicant-row--disabled' : ''}`}
                                    onClick={() => {
                                      if (!applicant.userId) return;
                                      handleProfileNavigation(applicant.userId);
                                      setOpenApplicantsId(null);
                                    }}
                                  >
                                    <div className="jobs-applicant-avatar">
                                      {applicant.fullName
                                        ?.charAt(0)
                                        .toUpperCase() || '?'}
                                    </div>
                                    <span className="jobs-applicant-name">
                                      {applicant.fullName}
                                    </span>
                                    {applicant.userId && (
                                      <MDBIcon
                                        fas
                                        icon="arrow-right"
                                        className="jobs-applicant-arrow"
                                      />
                                    )}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      <div className="jobs-entry-actions">
                        <button
                          className="jobs-entry-delete"
                          onClick={() => setPendingDeleteId(job.id)}
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

            {/* Sorting — between Your Jobs and Other Jobs */}
            <SortingCard
              sortingMethod={sortingMethod}
              onSortChange={setSortingMethod}
            />

            {/* Other Jobs */}
            <div className="jobs-section-card">
              <div className="jobs-section-header">
                <h2 className="jobs-section-title">Other Jobs</h2>
              </div>
              <div className="jobs-section-body">
                {loadingJobs ? (
                  <SkeletonCard count={3} />
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

      <DeleteJobModal
        isOpen={pendingDeleteId !== null}
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />

      <CreateJobModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateJob}
      />
    </div>
  );
};

export default JobsComponent;
