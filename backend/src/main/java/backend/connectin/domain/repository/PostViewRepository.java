package backend.connectin.domain.repository;

import backend.connectin.domain.PostView;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostViewRepository extends JpaRepository<PostView, Long> {
    @Query("SELECT pview FROM PostView pview WHERE pview.userId = :userId AND pview.postId = :postId")
    Optional<PostView> findPostViewByUserIdAndJobId(@Param("userId") long userId, @Param("postId") Long postId);

    List<PostView> findByUserId(long userId);
}