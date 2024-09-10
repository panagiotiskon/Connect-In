package backend.connectin.web.dto;

import java.time.Instant;
import java.time.LocalDate;

public record EducationDTO(
    String universityName,
    String fieldOfStudy,
    LocalDate startDate,
    LocalDate endDate,
    Boolean isPublic
) {}
