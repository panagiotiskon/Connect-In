package backend.connectin.domain;

import backend.connectin.domain.enums.NotificationType;
import jakarta.persistence.*;

import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "notification")
public class Notification {
    private long id;
    private long userId;
    private NotificationType type;
    private long connectionUserId;
    private Instant createdAt;

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    @Column(name = "user_id")
    public long getUserId() {
        return userId;
    }

    public void setUserId(long userId) {
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
    public long getConnectionUserId() {
        return connectionUserId;
    }

    public void setConnectionUserId(long connectionUserId) {
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
}
