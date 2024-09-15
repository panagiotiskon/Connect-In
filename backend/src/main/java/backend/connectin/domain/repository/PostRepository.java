package backend.connectin.domain.repository;

import backend.connectin.domain.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Set;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {


    List<Post> findAllByUserId(Long userId);

    @Query(value = """
            SELECT DISTINCT p.*
            FROM posts p
            WHERE p.user_id IN :userIds
            """, nativeQuery = true)
    Set<Post> findAllByUserIdIn(@Param("userIds") Collection<Long> userIds);


}
