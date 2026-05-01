package backend.connectin.domain.repository;

import backend.connectin.domain.JobView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface JobViewRepository extends JpaRepository<JobView, Long> {
    @Query("SELECT jview FROM JobView jview WHERE jview.userId = :userId AND jview.jobId = :jobId")
    Optional<JobView> findJobViewByUserIdAndJobId(@Param("userId") long userId, @Param("jobId") long jobId);

    List<JobView> findByUserId(long userId);

    @Modifying
    @Transactional
    @Query("UPDATE JobView jv SET jv.viewCount = jv.viewCount + 1, jv.viewedAt = :now WHERE jv.userId = :userId AND jv.jobId = :jobId")
    int incrementViewCount(@Param("userId") long userId, @Param("jobId") long jobId, @Param("now") Instant now);

    @Query(value = """
            SELECT jv.job_id
            FROM job_view jv
            GROUP BY jv.job_id
            ORDER BY SUM(jv.view_count) DESC
            LIMIT :limit
            """, nativeQuery = true)
    List<Long> findPopularJobIds(@Param("limit") int limit);
}