package backend.connectin.domain.repository;

import backend.connectin.domain.Connection;
import backend.connectin.domain.enums.ConnectionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ConnectionRepository extends JpaRepository<Connection, Long> {

    // find all user connections
    @Query(value = """
        SELECT c
        FROM Connection c
        WHERE c.userId1 = :userId
        AND (c.status = 'ACCEPTED')
        """)
    List<Connection> findUserConnections(@Param("userId") Long userId);

    // find all connection requests a user has
    @Query(value = """
            SELECT c
            FROM Connection c
            WHERE c.userId2 = :userId AND c.status = 'PENDING'
            """)
    List<Connection> findAllConnectionRequests(@Param("userId") Long userId);

    @Modifying
    @Query("UPDATE Connection c SET c.status = :status WHERE (c.userId1 = :userId1 AND c.userId2 = :userId2) OR (c.userId1 = :userId2 AND c.userId2 = :userId1)")
    void updateConnectionStatus(Long userId1, Long userId2, ConnectionStatus status);

    @Modifying
    @Query("DELETE FROM Connection c WHERE (c.userId1 = :userId AND c.userId2 = :connectionUserId) OR (c.userId1 = :connectionUserId AND c.userId2 = :userId)")
    void deleteConnection(Long userId, Long connectionUserId);
}
