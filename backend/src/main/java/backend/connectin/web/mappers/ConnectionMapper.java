package backend.connectin.web.mappers;

import backend.connectin.domain.Connection;
import backend.connectin.domain.enums.ConnectionStatus;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ConnectionMapper {


    public Connection mapToConnection(Long userId, Long connectionId, ConnectionStatus status) {
        Connection connection = new Connection();
        connection.setUserId1(userId);
        connection.setUserId2(connectionId);
        connection.setStatus(status);
        connection.setCreatedAt(Instant.now());
        connection.setUpdatedAt(Instant.now());
        return connection;
    }

}
