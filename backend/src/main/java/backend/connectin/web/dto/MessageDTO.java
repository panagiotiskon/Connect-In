package backend.connectin.web.dto;

import java.time.Instant;

public record MessageDTO(long senderId, String message, String profilePictureUrl,
                         Instant sentAt) {
}
