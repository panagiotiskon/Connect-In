package backend.connectin.domain.repository;

import backend.connectin.domain.Connection;
import org.springframework.data.jpa.repository.JpaRepository;
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
            WHERE (c.userId1 = :userId OR c.userId2 = :userId)
                  AND c.status = 'ACCEPTED'
            """)
    List<Connection> findUserConnections(@Param("userId") Long userId);

    // find all connection requests a user has
    @Query(value = """
            SELECT c
            FROM Connection c
            WHERE c.userId2 = :userId AND c.status = 'PENDING'
            """)
    List<Connection> findAllConnectionRequests(@Param("userId") Long userId);


}
