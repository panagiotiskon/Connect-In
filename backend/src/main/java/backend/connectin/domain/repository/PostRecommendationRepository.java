package backend.connectin.domain.repository;

import backend.connectin.domain.PostRecommendation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRecommendationRepository extends JpaRepository<PostRecommendation, Long> {
    List<PostRecommendation> findByUserId(Long userId);
}
