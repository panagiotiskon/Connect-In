package backend.connectin.service;

import backend.connectin.domain.User;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.mappers.UserMapper;
import backend.connectin.web.requests.UserRegisterRequest;
import backend.connectin.web.resources.UserResourceDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    public void registerUser(UserRegisterRequest userRegisterRequest) {
        String email = userRegisterRequest.getEmail();
        // Check if user with the given email already exists
        if (userRepository.findUserByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        User user = userMapper.mapToUser(userRegisterRequest);
        userRepository.save(user);
    }

    public Page<UserResourceDto> fetchAll(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);
        return usersPage.map(UserResourceDto::new);
    }

}
