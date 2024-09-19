package backend.connectin.domain.repository;

import backend.connectin.domain.JobRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface JobRecommendationRepository extends JpaRepository<JobRecommendation, Long> {
    List<JobRecommendation> findByUserId(Long userId);
}