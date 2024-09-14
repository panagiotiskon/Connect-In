package backend.connectin.web.dto;

import java.time.Instant;

public record MessageDTO(String message, String profilePicture, String picType,
                         Instant sentAt) {
}
