package backend.connectin.web.dto;

public record ConnectedUserDTO(long userId,String firstName,String lastName,String jobTitle, String companyName,String profilePic,String profileType,boolean isPending) {
}
