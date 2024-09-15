package backend.connectin.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "job_application")
public class JobApplication {

    private long id;
    private long userId;
    private long jobPostId;
    private Instant appliedAt;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Column(name = "user_id")
    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
        this.userId = userId;
    }

    @Column(name = "job_post_id")
    public long getJobPostId() {
        return jobPostId;
    }

    public void setJobPostId(long jobPostId) {
        this.jobPostId = jobPostId;
    }

    @Column(name = "applied_at")
    public Instant getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(Instant appliedAt) {
        this.appliedAt = appliedAt;
    }

}
