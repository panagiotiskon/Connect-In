package backend.connectin.domain;

import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "job_view", uniqueConstraints = @UniqueConstraint(name = "uq_job_view_user_job", columnNames = {"user_id", "job_id"}))
public class JobView {
    private long id;
    private long userId;
    private long jobId;
    private Instant viewedAt;
    private int viewCount;

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

    @Column(name = "job_id")
    public long getJobId() {
        return jobId;
    }

    public void setJobId(long jobId) {
        this.jobId = jobId;
    }

    @Column(name = "viewed_at")
    public Instant getViewedAt() {
        return viewedAt;
    }

    public void setViewedAt(Instant viewedAt) {
        this.viewedAt = viewedAt;
    }

    @Column(name = "view_count", nullable = false)
    public int getViewCount() {
        return viewCount;
    }

    public void setViewCount(int viewCount) {
        this.viewCount = viewCount;
    }

}
