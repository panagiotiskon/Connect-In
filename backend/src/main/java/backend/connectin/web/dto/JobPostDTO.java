package backend.connectin.web.dto;

import java.time.Instant;

public record JobPostDTO(long id, long userId, String jobTitle, String companyName, String jobDescription,
                         Instant createdAt, String createdBy, boolean applied) {
}
