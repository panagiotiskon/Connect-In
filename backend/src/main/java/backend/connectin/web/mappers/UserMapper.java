package backend.connectin.web.mappers;

import backend.connectin.domain.Role;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.RoleRepository;
import backend.connectin.web.requests.UserRegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;

@Component
public class UserMapper {
    private PasswordEncoder passwordEncoder;

    private RoleRepository roleRepository;

    public UserMapper(PasswordEncoder passwordEncoder, RoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.roleRepository = roleRepository;
    }

    public User mapToUser(UserRegisterRequest userRegisterRequest){

        Role userRole = roleRepository.findByName("ROLE_USER");

        User user = new User();
        user.setEmail(userRegisterRequest.getEmail());
        user.setPassword(passwordEncoder.encode(userRegisterRequest.getPassword()));
        user.setFirstName(userRegisterRequest.getFirstName());
        user.setLastName(userRegisterRequest.getLastName());
        user.setRoles(List.of(userRole));
        user.setPhoneNumber(userRegisterRequest.getPhoneNumber());
        user.setCreatedAt(Instant.now());
        user.setUpdatedAt(Instant.now());
        return user;
    }
}
