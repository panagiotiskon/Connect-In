package backend.connectin.web.requests;

import backend.connectin.domain.enums.NotificationType;

public class NotificationRequest {

    private Long userId;
    private NotificationType type;
    private Long connectionUserId;
    private Long objectId;

    public Long getConnectionUserId() {
        return connectionUserId;
    }

    public void setConnectionUserId(Long connectionUserId) {
        this.connectionUserId = connectionUserId;
    }

    public NotificationType getType() {
        return type;
    }

    public void setType(NotificationType type) {
        this.type = type;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getObjectId() {
        return objectId;
    }

    public void setObjectId(Long objectId) {
        this.objectId = objectId;
    }
}
