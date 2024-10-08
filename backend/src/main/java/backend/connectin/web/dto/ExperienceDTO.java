package backend.connectin.web.dto;

import java.time.Instant;
import java.time.LocalDate;

public record ExperienceDTO(long experienceId,
                            String jobTitle,
                            String companyName,
                            LocalDate startDate,
                            LocalDate endDate,
                            Boolean isPublic
) {
}
