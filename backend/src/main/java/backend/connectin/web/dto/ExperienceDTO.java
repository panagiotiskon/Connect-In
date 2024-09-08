package backend.connectin.web.dto;

import java.time.Instant;

public record ExperienceDTO(
    String jobTitle,
    String companyName,
    Instant startDate,
    Instant endDate,
    Boolean isPublic
) {}
