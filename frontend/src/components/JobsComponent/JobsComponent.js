import { useState, useRef, useEffect, useCallback } from 'react';
import { MDBContainer, MDBRow, MDBCol, MDBIcon } from 'mdb-react-ui-kit';
import { Modal, Form, Alert } from 'react-bootstrap';
import NavbarComponent from '../common/NavBar';
import ProfileCard from '../common/ProfileCard';
import SortingCard from '../common/SortingCard';
import ConfirmActionModal from '../common/ConfirmActionModal';
import SkeletonCard from '../common/SkeletonCard';
import { useAuth } from '../../context/AuthContext';
import JobAPI from '../../api/JobAPI';
import { useNavigate } from 'react-router-dom';
import './JobsComponent.scss';

const JobsComponent = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [errors, setErrors] = useState({
    title: '',
    company: '',
    description: '',
  });
  const [createError, setCreateError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [openApplicantsId, setOpenApplicantsId] = useState(null);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
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

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: '', company: '', description: '' };
    if (!jobTitle.trim()) {
      newErrors.title = 'Job title is required';
      valid = false;
    }
    if (!companyName.trim()) {
      newErrors.company = 'Company name is required';
      valid = false;
    }
    if (!jobDescription.trim()) {
      newErrors.description = 'Job description is required';
      valid = false;
    }
    setErrors(newErrors);
    return valid;
  };

  const handleOpenCreateModal = () => {
    setJobTitle('');
    setCompanyName('');
    setJobDescription('');
    setErrors({ title: '', company: '', description: '' });
    setCreateError('');
    setShowCreateModal(true);
  };

  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
    setCreateError('');
  };

  const handleCreateJob = async () => {
    if (!validateForm()) return;
    if (currentUser) {
      try {
        await JobAPI.createJobPost(
          currentUser.id,
          jobTitle,
          companyName,
          jobDescription
        );
        setJobTitle('');
        setCompanyName('');
        setJobDescription('');
        setErrors({ title: '', company: '', description: '' });
        setShowCreateModal(false);
        fetchJobsByDate();
      } catch (error) {
        console.error('Error creating job:', error);
        setCreateError('Failed to create job. Please try again.');
      }
    }
  };

  const handleApply = async (jobId) => {
    if (currentUser) {
      try {
        await JobAPI.applyToJob(currentUser.id, jobId);
        setJobs((prevJobs) =>
          prevJobs.map((job) =>
            job.id === jobId ? { ...job, applied: true } : job
          )
        );
      } catch (error) {
        console.error('Error applying to job:', error);
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
                  onClick={handleOpenCreateModal}
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
                            >
                              Apply
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

      {/* Delete Confirm Modal */}
      <ConfirmActionModal
        isOpen={pendingDeleteId !== null}
        title="Delete Job"
        message="Are you sure you want to delete this job posting? This action cannot be undone."
        confirmText="Delete"
        onConfirm={handleConfirmDelete}
        onCancel={() => setPendingDeleteId(null)}
        isLoading={isDeleting}
      />

      {/* Create Job Modal */}
      <Modal show={showCreateModal} onHide={handleCloseCreateModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Job</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {createError && <Alert variant="danger">{createError}</Alert>}
          <Form.Group controlId="formJobTitle">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="Enter job title"
              isInvalid={!!errors.title}
            />
            <Form.Control.Feedback type="invalid">
              {errors.title}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formCompanyName" className="mt-3">
            <Form.Label>Company Name</Form.Label>
            <Form.Control
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              isInvalid={!!errors.company}
            />
            <Form.Control.Feedback type="invalid">
              {errors.company}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlId="formJobDescription" className="mt-3">
            <Form.Label>Job Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Enter job description"
              isInvalid={!!errors.description}
            />
            <Form.Control.Feedback type="invalid">
              {errors.description}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <button
            className="jobs-modal-btn-cancel"
            onClick={handleCloseCreateModal}
          >
            Cancel
          </button>
          <button className="jobs-modal-btn-save" onClick={handleCreateJob}>
            Create
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default JobsComponent;
