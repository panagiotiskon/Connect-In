package backend.connectin.domain;

import backend.connectin.domain.enums.ConnectionStatus;
import jakarta.persistence.*;

import java.io.Serializable;
import java.time.Instant;

@Entity
@Table(name = "connections")
public class Connection implements Serializable {
    private Long id;
    private Long userId1;
    private Long userId2;
    private ConnectionStatus status;
    private Instant createdAt;
    private Instant updatedAt;


    public Connection(Long userId1, Long userId2, ConnectionStatus status) {
        this.userId1 = userId1;
        this.userId2 = userId2;
        this.status = status;
    }

    public Connection() {

    }

    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    @Column(name = "user_id_1")
    public Long getUserId1() {
        return userId1;
    }

    public void setUserId1(Long userId1) {
        this.userId1 = userId1;
    }

    @Column(name = "user_id_2")
    public Long getUserId2() {
        return userId2;
    }

    public void setUserId2(Long userId2) {
        this.userId2 = userId2;
    }

    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    public ConnectionStatus getStatus() {
        return status;
    }

    public void setStatus(ConnectionStatus status) {
        this.status = status;
    }

    @Column(name = "created_date")
    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }

    @Column(name = "updated_date")
    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
