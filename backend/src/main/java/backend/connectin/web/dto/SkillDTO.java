package backend.connectin.web.dto;

public record SkillDTO(
        long skillId,
    String skillTitle,
    String skillDescription,
    Boolean isPublic
) {}
