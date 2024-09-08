package backend.connectin.web.dto;

import java.time.Instant;

public record EducationDTO(
    String universityName,
    String fieldOfStudy,
    Instant startDate,
    Instant endDate,
    Boolean isPublic
) {}
