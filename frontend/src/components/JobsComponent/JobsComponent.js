import React, { useState, useEffect } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBInput,
  MDBBtn,
  MDBCardTitle,
  MDBCardText,
  MDBTypography,
  MDBDropdown,
  MDBDropdownToggle,
  MDBDropdownMenu,
  MDBDropdownItem,
  MDBIcon,
} from "mdb-react-ui-kit";
import NavbarComponent from "../common/NavBar";
import AuthService from "../../api/AuthenticationAPI";
import JobAPI from "../../api/JobAPI";
import { useNavigate } from "react-router-dom";

const JobsComponent = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState({});
  const [errors, setErrors] = useState({
    title: "",
    company: "",
    description: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await AuthService.getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };
    fetchUser();
  }, []);

  const fetchJobs = async () => {
    if (currentUser) {
      try {
        const response = await JobAPI.getJobPosts(currentUser.id);
        if (response) {
          setJobs(response);
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        setJobs([]);
      }
    }
  };

  const fetchApplications = async () => {
    if (currentUser) {
      try {
        const response = await JobAPI.getJobApplications(currentUser.id);
        const appMap = {};
        console.log(response);
        response.forEach((application) => {
          const { jobPostId, userId, fullName } = application;
          if (!appMap[jobPostId]) {
            appMap[jobPostId] = new Map();
          }
          appMap[jobPostId].set(userId, { userId, fullName });
        });

        const formattedAppMap = {};
        Object.keys(appMap).forEach((jobPostId) => {
          formattedAppMap[jobPostId] = Array.from(appMap[jobPostId].values());
        });

        setApplications(formattedAppMap);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchJobs();
      fetchApplications();

      const pollingInterval = setInterval(() => {
        fetchJobs();
        fetchApplications();
      }, 10000);

      return () => clearInterval(pollingInterval);
    }
  }, [currentUser]);

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", company: "", description: "" };

    if (!jobTitle.trim()) {
      newErrors.title = "Job title is required";
      valid = false;
    }
    if (!companyName.trim()) {
      newErrors.company = "Company name is required";
      valid = false;
    }
    if (!jobDescription.trim()) {
      newErrors.description = "Job description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
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

        setJobTitle("");
        setCompanyName("");
        setJobDescription("");
        setErrors({ title: "", company: "", description: "" });
        setSuccessMessage("Job created successfully!");

        setTimeout(() => {
          setSuccessMessage("");
        }, 1000);

        fetchJobs();
      } catch (error) {
        console.error("Error creating job:", error);
      }
    } else {
      console.error("No current user found!");
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
        console.error("Error applying to job:", error);
      }
    } else {
      console.error("No current user found!");
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (currentUser) {
      try {
        await JobAPI.deleteJob(currentUser.id, jobId);
        setJobs((prevJobs) => prevJobs.filter((job) => job.id !== jobId));
      } catch (error) {
        console.error("Error deleting job:", error);
      }
    } else {
      console.error("No current user found!");
    }
  };

  const handleProfileNavigation = (userId) => {
    navigate(`/profile/${userId}`);
  };

  const yourJobs = jobs.filter((job) => job.userId === currentUser?.id);
  const otherJobs = jobs.filter(
    (job) => job.userId !== currentUser?.id && !job.applied
  );

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow>
          <MDBCol md="4" className="mb-4">
            <MDBCard>
              <MDBCardBody>
                {successMessage && (
                  <MDBTypography tag="div" color="success" className="mb-3">
                    {successMessage}
                  </MDBTypography>
                )}
                {errors.title && (
                  <MDBTypography tag="div" color="danger" className="mb-3">
                    {errors.title}
                  </MDBTypography>
                )}
                {errors.company && (
                  <MDBTypography tag="div" color="danger" className="mb-3">
                    {errors.company}
                  </MDBTypography>
                )}
                {errors.description && (
                  <MDBTypography tag="div" color="danger" className="mb-3">
                    {errors.description}
                  </MDBTypography>
                )}
                <MDBInput
                  label="Job Title"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="mb-3"
                  invalid={!!errors.title}
                />
                <MDBInput
                  label="Company Name"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="mb-3"
                  invalid={!!errors.company}
                />
                <MDBInput
                  type="textarea"
                  label="Job Description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mb-3"
                  invalid={!!errors.description}
                />
                <MDBBtn style={{
                  backgroundColor:"#35677e"
                }}
                onClick={handleCreateJob}>Create Job</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="8">
            <MDBRow>
              <MDBCol md="12" className="mb-4">
                <MDBTypography
                  tag="h2"
                  className="text-dark"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Your Jobs
                </MDBTypography>
                <MDBRow>
                  {yourJobs.length === 0 ? (
                    <MDBCol md="12">
                      <MDBCard className="mb-3">
                        <MDBCardBody>
                          <MDBCardText>No jobs created by you</MDBCardText>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  ) : (
                    yourJobs.map((job) => (
                      <MDBCol md="12" className="mb-" key={job.id}>
                        <MDBCard className="position-relative">
                          <MDBCardBody>
                            <MDBCardTitle
                              style={{ fontSize: "1.5rem", color: "#333" }}
                            >
                              {job.jobTitle}
                            </MDBCardTitle>
                            <MDBCardText>{job.jobDescription}</MDBCardText>
                            <MDBCardText>
                              <small className="text-muted">
                                Company: {job.companyName}
                              </small>
                              <br />
                              <small className="text-muted">
                                Date Created:{" "}
                                {new Date(job.createdAt).toLocaleDateString()}
                              </small>
                            </MDBCardText>
                            {applications[job.id] &&
                              applications[job.id].length > 0 && (
                                <>
                                  <MDBDropdown>
                                    <MDBDropdownToggle style={{backgroundColor:"#35677e"}}>
                                      View Applicants
                                    </MDBDropdownToggle>
                                    <MDBDropdownMenu>
                                      {applications[job.id].map((applicant) => (
                                        <MDBDropdownItem
                                          key={applicant.userId}
                                          onClick={() =>
                                            handleProfileNavigation(
                                              applicant.userId
                                            )
                                          }
                                          style={{
                                            cursor: "pointer",
                                            padding: "10px",
                                            transition: "background-color 0.2s",
                                          }}
                                          onMouseOver={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                              "#f1f1f1")
                                          }
                                          onMouseOut={(e) =>
                                            (e.currentTarget.style.backgroundColor =
                                              "transparent")
                                          }
                                        >
                                          {applicant.fullName}
                                        </MDBDropdownItem>
                                      ))}
                                    </MDBDropdownMenu>
                                  </MDBDropdown>
                                  <MDBCardText className="text-end text-muted small">
                                    {applications[job.id].length} applicant
                                    {applications[job.id].length > 1 ? "s" : ""}
                                  </MDBCardText>
                                </>
                              )}
                            <MDBBtn
                              className="d-flex btn-sm delete-connection-btn2"
                              color="secondary"
                              onClick={() => handleDeleteJob(job.id)}
                              style={{
                                position: "absolute",
                                top: "10px",
                                left: "94%",
                                marginRight: "10px"
                              }}
                            >
                              <MDBIcon fas icon="times" />
                            </MDBBtn>
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    ))
                  )}
                </MDBRow>
              </MDBCol>

              <MDBCol md="12">
                <MDBTypography
                  tag="h2"
                  className="text-dark"
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "bold",
                  }}
                >
                  Other Jobs
                </MDBTypography>
                <MDBRow>
                  {otherJobs.length === 0 ? (
                    <MDBCol md="12">
                      <MDBCard className="mb-3">
                        <MDBCardBody>
                          <MDBCardText>No other jobs available</MDBCardText>
                        </MDBCardBody>
                      </MDBCard>
                    </MDBCol>
                  ) : (
                    otherJobs.map((job) => (
                      <MDBCol md="12" className="mb-5" key={job.id}>
                        <MDBCard
                          className={job.applied ? "bg-success text-white" : ""}
                        >
                          <MDBCardBody>
                            <MDBCardTitle
                              style={{ fontSize: "1.5rem", color: "#333" }}
                            >
                              {job.jobTitle}
                              {job.applied && (
                                <span className="float-end text-white">
                                  <i className="fas fa-check-circle"></i>
                                </span>
                              )}
                            </MDBCardTitle>
                            <MDBCardText>{job.jobDescription}</MDBCardText>
                            <MDBCardText>
                              <small className="text-muted">
                                Company: {job.companyName}
                              </small>
                              <br />
                              <small className="text-muted">
                                Date Created:{" "}
                                {new Date(job.createdAt).toLocaleDateString()}
                              </small>
                              <br />
                              <small className="text-muted">
                                Created By: {job.createdBy}
                              </small>
                            </MDBCardText>
                            {currentUser && (
                              <MDBBtn style={{
                                backgroundColor:"#35677e"
                              }}
                                      onClick={() => handleApply(job.id)}>
                                Apply
                              </MDBBtn>
                            )}
                          </MDBCardBody>
                        </MDBCard>
                      </MDBCol>
                    ))
                  )}
                </MDBRow>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default JobsComponent;
