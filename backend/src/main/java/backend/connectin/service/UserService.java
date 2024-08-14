package backend.connectin.service;

import backend.connectin.domain.User;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.mappers.UserMapper;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.requests.UserRegisterRequest;
import backend.connectin.web.resources.UserResource;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
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

    public Page<UserResource> fetchAll(String roleName, Pageable pageable) {
        List<User> users = userRepository.findUsersByRoleName(roleName);
        // Implement pagination manually
        int start = (int) pageable.getOffset();

        if (start >= users.size()) {
            // Return an empty PageImpl if the start index is out of bounds
            return new PageImpl<>(Collections.emptyList(), pageable, users.size())
                    .map(UserResource::new);
        }
        int end = Math.min((start + pageable.getPageSize()), users.size());
        List<User> pagedUsers = users.subList(start, end);

        return new PageImpl<>(pagedUsers, pageable, users.size())
                .map(UserResource::new);
    }

    public Optional<User> findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    public ResponseEntity<String> updatePassword(User user, UserChangePasswordRequest userChangePasswordRequest) {
        // Check if the old password matches
        if (!passwordEncoder.matches(userChangePasswordRequest.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Old password is incorrect.");
        }
        // Encode the new password
        user.setPassword(passwordEncoder.encode(userChangePasswordRequest.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }

    public ResponseEntity<String> updateUserEmail(User user, UserChangeEmailRequest userChangeEmailRequest) {
        if (userRepository.findUserByEmail(userChangeEmailRequest.getNewEmail()).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        } else if (userRepository.findUserByEmail(userChangeEmailRequest.getOldEmail()).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Email not found");
        }
        user.setEmail(userChangeEmailRequest.getNewEmail());
        userRepository.save(user);
        return ResponseEntity.ok("Email updated successfully.");
    }

}
