package backend.connectin.web.mappers;

import backend.connectin.domain.Notification;
import backend.connectin.domain.User;
import backend.connectin.domain.enums.NotificationType;
import backend.connectin.web.resources.NotificationResource;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class NotificationMapper {

    public Notification mapToNotification(Long userId, Long connectedUserId, NotificationType notificationType, Long objectId) {
        Notification notification = new Notification();
        notification.setUserId(userId);
        notification.setConnectionUserId(connectedUserId);
        notification.setType(notificationType);
        if (objectId != null) {
            notification.setObjectId(objectId);
        }
        notification.setCreatedAt(Instant.now());
        return notification;
    }

    public NotificationResource mapToNotificationResource(Notification notification, User connectedUser) {
        return new NotificationResource(
                notification.getId(),
                notification.getConnectionUserId(),
                connectedUser.getFirstName(),
                connectedUser.getLastName(),
                notification.getType(),
                notification.getCreatedAt()
        );
    }

}
