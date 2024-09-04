import React, { useState } from "react";
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
} from "mdb-react-ui-kit";
import NavbarComponent from "./common/NavBar"; // Adjust the import path as needed

const JobsComponent = () => {
  const [jobTitle, setJobTitle] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [jobs, setJobs] = useState([]);
  const [errors, setErrors] = useState({ title: "", description: "" });
  const [successMessage, setSuccessMessage] = useState("");

  const validateForm = () => {
    let valid = true;
    const newErrors = { title: "", description: "" };

    if (!jobTitle.trim()) {
      newErrors.title = "Job title is required";
      valid = false;
    }
    if (!jobDescription.trim()) {
      newErrors.description = "Job description is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleCreateJob = () => {
    if (!validateForm()) return;

    // Create new job
    const newJob = {
      id: jobs.length + 1,
      title: jobTitle,
      description: jobDescription,
      dateCreated: new Date().toLocaleDateString(),
      createdBy: "Admin", // Or use a dynamic value
    };

    setJobs([...jobs, newJob]);
    setJobTitle("");
    setJobDescription("");
    setErrors({ title: "", description: "" });
    setSuccessMessage("Job created successfully!");

    // Clear success message after 1 second
    setTimeout(() => {
      setSuccessMessage("");
    }, 1000);
  };

  const handleApply = (jobId) => {
    console.log(`Applied for job with ID: ${jobId}`);
  };

  return (
    <div>
      <NavbarComponent />
      <MDBContainer fluid className="mt-5">
        <MDBRow>
          {/* Job Creation and Jobs Listing Headings */}
          <MDBCol md="12" className="mb-4">
            <MDBRow>
              <MDBCol md="6" className="text-center">
                <MDBTypography
                  tag="h1"
                  className="text-dark"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  Create a Job
                </MDBTypography>
              </MDBCol>
              <MDBCol md="6" className="text-center">
                <MDBTypography
                  tag="h1"
                  className="text-dark"
                  style={{
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  Jobs
                </MDBTypography>
              </MDBCol>
            </MDBRow>
          </MDBCol>

          {/* Job Creation Card */}
          <MDBCol md="6" className="mb-4">
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
                  type="textarea"
                  label="Job Description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mb-3"
                  invalid={!!errors.description}
                />
                <MDBBtn onClick={handleCreateJob}>Create Job</MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          {/* Jobs Listing */}
          <MDBCol md="6">
            <MDBRow>
              {jobs.length === 0 ? (
                <MDBCol md="12">
                  <MDBCard className="mb-3">
                    <MDBCardBody>
                      <MDBCardText>No jobs available</MDBCardText>
                    </MDBCardBody>
                  </MDBCard>
                </MDBCol>
              ) : (
                jobs.map((job) => (
                  <MDBCol md="12" className="mb-4" key={job.id}>
                    <MDBCard>
                      <MDBCardBody>
                        <MDBCardTitle
                          style={{ fontSize: "2rem", color: "#333" }}
                        >
                          {job.title}
                        </MDBCardTitle>
                        <MDBCardText>{job.description}</MDBCardText>
                        <MDBCardText>
                          <small className="text-muted">
                            Date Created: {job.dateCreated}
                          </small>
                          <br />
                          <small className="text-muted">
                            Created By: {job.createdBy}
                          </small>
                        </MDBCardText>
                        <MDBBtn onClick={() => handleApply(job.id)}>
                          Apply
                        </MDBBtn>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                ))
              )}
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </div>
  );
};

export default JobsComponent;
