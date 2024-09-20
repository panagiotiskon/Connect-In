package backend.connectin.web.resources;

import backend.connectin.domain.enums.NotificationType;

import java.time.Instant;

public record NotificationResource(
        long id,long userId,String firstName,String lastName, NotificationType notificationType, Instant createdAt
        ) {
}
