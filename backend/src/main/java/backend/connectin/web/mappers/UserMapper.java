package backend.connectin.web.mappers;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Role;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.FileRepository;
import backend.connectin.domain.repository.RoleRepository;
import backend.connectin.web.dto.UserDTO;
import backend.connectin.web.requests.UserRegisterRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Component
public class UserMapper {
    private PasswordEncoder passwordEncoder;
    private FileRepository fileRepository;
    private RoleRepository roleRepository;

    public UserMapper(PasswordEncoder passwordEncoder, FileRepository fileRepository, RoleRepository roleRepository) {
        this.passwordEncoder = passwordEncoder;
        this.fileRepository = fileRepository;
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

    public UserDTO mapToUserDTO(User user){
        Optional<FileDB> fileDB = fileRepository.findProfilePicture(user.getId());
        byte[] profilePicture = null;
        if(fileDB.isPresent()){
            profilePicture = fileDB.get().getData();
        }
        return new UserDTO(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRoles().getFirst().getName(),
                profilePicture
        );
    }
}
