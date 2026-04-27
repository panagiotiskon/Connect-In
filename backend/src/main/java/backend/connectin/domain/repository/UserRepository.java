package backend.connectin.domain.repository;

import backend.connectin.domain.User;
import backend.connectin.web.dto.FeedAuthorDTO;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u FROM User u JOIN u.roles r WHERE r.name = :roleName")
    List<User> findUsersByRoleName(@Param("roleName")String roleName);

    @Query("SELECT u FROM User u WHERE NOT EXISTS (SELECT r FROM u.roles r WHERE r.name = :roleName)")
    List<User> findUsersExcludingRole(@Param("roleName") String roleName);

    @Query(value = """
            SELECT u.* FROM users u
            WHERE NOT EXISTS (
                SELECT 1 FROM user_roles ur
                JOIN roles r ON ur.role_id = r.id
                WHERE ur.user_id = u.id AND r.name = :roleName
            )
              AND (
                  :search = ''
                  OR LOWER(u.first_name) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR LOWER(u.last_name) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))
                  OR CONCAT(LOWER(u.first_name), ' ', LOWER(u.last_name)) LIKE LOWER(CONCAT('%', :search, '%'))
              )
            ORDER BY u.first_name ASC, u.id ASC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<User> searchUsersExcludingRole(
            @Param("roleName") String roleName,
            @Param("search") String search,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

    Optional<User> findUserByEmail(String email);

    @Query("""
            SELECT new backend.connectin.web.dto.FeedAuthorDTO(u.id, u.firstName, u.lastName)
            FROM User u
            WHERE u.id IN :ids
            """)
    List<FeedAuthorDTO> findFeedAuthorsByIds(@Param("ids") Collection<Long> ids);

    // Two LEFT JOINs + COALESCE detect a connection even when only one
    // direction is present in the table (defensive against partial/legacy rows).
    // Each join matches at most one row thanks to the UNIQUE(user_id_1, user_id_2)
    // constraint, so no duplicate rows per user are produced.
    @Query(value = """
            SELECT u.id, u.first_name, u.last_name,
                   COALESCE(c1.status, c2.status) AS connection_status
            FROM users u
            LEFT JOIN connections c1 ON c1.user_id_1 = :currentUserId AND c1.user_id_2 = u.id
            LEFT JOIN connections c2 ON c2.user_id_2 = :currentUserId AND c2.user_id_1 = u.id
            WHERE u.id != :currentUserId
              AND u.id != 1
              AND NOT EXISTS (
                  SELECT 1 FROM user_roles ur
                  JOIN roles r ON ur.role_id = r.id
                  WHERE ur.user_id = u.id AND r.name = 'ROLE_ADMIN'
              )
              AND (
                  LOWER(u.first_name) LIKE LOWER(CONCAT(:search, '%'))
                  OR LOWER(u.last_name) LIKE LOWER(CONCAT(:search, '%'))
                  OR CONCAT(LOWER(u.first_name), ' ', LOWER(u.last_name)) LIKE LOWER(CONCAT(:search, '%'))
              )
            ORDER BY u.first_name ASC, u.id ASC
            LIMIT :limit OFFSET :offset
            """, nativeQuery = true)
    List<Object[]> searchUsersWithConnectionStatus(
            @Param("currentUserId") Long currentUserId,
            @Param("search") String search,
            @Param("limit") int limit,
            @Param("offset") int offset
    );

}
