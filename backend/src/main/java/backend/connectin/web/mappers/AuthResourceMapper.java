package backend.connectin.web.mappers;

import backend.connectin.domain.User;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.resources.AuthResource;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;


@Component
public class AuthResourceMapper {

    private final UserRepository userRepository;

    public AuthResourceMapper(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public AuthResource mapToAuthResource(String token, String userEmail) {
        User user = userRepository.findUserByEmail(userEmail).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        AuthResource authResource = new AuthResource();
        authResource.setAccessToken(token);
        authResource.setFirstName(user.getFirstName());
        authResource.setLastName(user.getLastName());
        authResource.setRoles(user.getRoles());
        return authResource;
    }
}
