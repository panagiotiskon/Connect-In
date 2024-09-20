package backend.connectin.domain;

import backend.connectin.domain.enums.NotificationType;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "notification")
public class Notification {

    private Long id;
    // this is the id of the user made who made the notification
    private Long userId;
    private NotificationType type;
    // this is the id of the user that the notification goes to
    private Long connectionUserId;
    // if the notification is comment or react keep the id of it
    private Long objectId;
    private Instant createdAt;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "user_id")
    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }
    @Column(name = "created_at")
    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
    @Column(name = "connection_user_id")
    public Long getConnectionUserId() {
        return connectionUserId;
    }

    public void setConnectionUserId(Long connectionUserId) {
        this.connectionUserId = connectionUserId;
    }
    @Column(name = "type")
    @Enumerated(EnumType.STRING)
    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    @Column(name = "object_id")
    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long notificationObjectId) {
        this.objectId = notificationObjectId;
    }
}
