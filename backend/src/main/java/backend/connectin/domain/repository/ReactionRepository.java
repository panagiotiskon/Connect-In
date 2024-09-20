package backend.connectin.domain.repository;

import backend.connectin.domain.Reaction;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReactionRepository extends JpaRepository<Reaction, Long> {

    List<Reaction> findAllByUserId(Long userId);

    @Query(value = """
            SELECT r.*
            FROM reactions r
            WHERE r.user_id = :userId AND r.post_id = :postId
            """, nativeQuery = true)
    Optional<Reaction> findByUserIdPostId(@Param("userId") Long userId, @Param("postId") Long postId);

    @Query(value = """
            SELECT r.post_id
            FROM reactions r
            WHERE r.user_id IN :userIds
            """, nativeQuery = true)
    List<Long> findPostIdsByUserIds(@Param("userIds") List<Long> userIds);
}
