package backend.connectin.web.dto;

public record RegisteredUserDTO(long userId, String firstName, String lastName, String jobTitle, String companyName,
                                String profilePic, String profileType) {
}
