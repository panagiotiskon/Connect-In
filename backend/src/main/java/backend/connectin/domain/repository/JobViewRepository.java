package backend.connectin.domain.repository;

import backend.connectin.domain.JobView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface JobViewRepository extends JpaRepository<JobView, Long> {
    @Query("SELECT jview FROM JobView jview WHERE jview.userId = :userId AND jview.jobId = :jobId")
    Optional<JobView> findJobViewByUserIdAndJobId(@Param("userId") long userId, @Param("jobId") long jobId);

    List<JobView> findByUserId(long userId);
}