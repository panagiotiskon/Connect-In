package backend.connectin.web.dto;

import backend.connectin.domain.Notification;
import backend.connectin.domain.enums.NotificationType;

public record NotificationDTO(
        long id,long userId,String firstName,String lastName, NotificationType notificationType
        ) {
}
