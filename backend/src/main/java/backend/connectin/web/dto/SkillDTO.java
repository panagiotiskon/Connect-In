package backend.connectin.web.dto;

public record SkillDTO(
    String skillTitle,
    String skillDescription,
    Boolean isPublic
) {}
