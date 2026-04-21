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

    @Query(value = """
                SELECT DISTINCT p.user_id
                FROM posts p
                WHERE p.id IN :postIds
            """, nativeQuery = true)
    List<Long> findUserIdsByPostIds(List<Long> postIds);

    List<Post> findPostsByIdIn(List<Long> postIds);

    @Query("""
            SELECT DISTINCT p FROM Post p
            LEFT JOIN FETCH p.comments c
            LEFT JOIN FETCH c.user
            WHERE p.userId IN :userIds
            """)
    Set<Post> findAllByUserIdInWithComments(@Param("userIds") Collection<Long> userIds);

    @Query("""
            SELECT DISTINCT p FROM Post p
            LEFT JOIN FETCH p.comments c
            LEFT JOIN FETCH c.user
            WHERE p.id IN :postIds
            """)
    List<Post> findPostsByIdInWithComments(@Param("postIds") List<Long> postIds);

    @Query(value = """
            SELECT p.id FROM posts p
            WHERE p.user_id IN :authorIds
            ORDER BY p.created_date DESC, p.id DESC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Long> findFeedIdsAuthorsPaged(@Param("authorIds") Collection<Long> authorIds,
                                       @Param("limit") int limit,
                                       @Param("offset") long offset);

    @Query(value = "SELECT COUNT(*) FROM posts p WHERE p.user_id IN :authorIds",
            nativeQuery = true)
    long countFeedPostsAuthors(@Param("authorIds") Collection<Long> authorIds);

    @Query(value = """
            SELECT id FROM (
                SELECT p.id AS id, p.created_date AS created_date
                  FROM posts p
                  WHERE p.user_id IN :authorIds
                UNION
                SELECT p.id AS id, p.created_date AS created_date
                  FROM posts p
                  INNER JOIN reactions r ON r.post_id = p.id
                  WHERE r.user_id IN :reactorIds
            ) feed
            ORDER BY feed.created_date DESC, feed.id DESC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Long> findFeedIdsPaged(@Param("authorIds") Collection<Long> authorIds,
                                @Param("reactorIds") Collection<Long> reactorIds,
                                @Param("limit") int limit,
                                @Param("offset") long offset);

    @Query(value = """
            SELECT COUNT(*) FROM (
                SELECT p.id FROM posts p WHERE p.user_id IN :authorIds
                UNION
                SELECT p.id FROM posts p
                  INNER JOIN reactions r ON r.post_id = p.id
                  WHERE r.user_id IN :reactorIds
            ) feed
            """, nativeQuery = true)
    long countFeedPosts(@Param("authorIds") Collection<Long> authorIds,
                        @Param("reactorIds") Collection<Long> reactorIds);

}
