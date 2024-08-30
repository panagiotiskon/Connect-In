package backend.connectin.service;

import backend.connectin.domain.User;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.mappers.UserMapper;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.requests.UserRegisterRequest;
import backend.connectin.web.resources.UserResource;
import jakarta.transaction.Transactional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;


    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, FileService fileService) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
    }

    // Check if user with the given email already exists
    public void validateEmail(String email) {
        if (userRepository.findUserByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
    }

    @Transactional
    public void registerUser(UserRegisterRequest userRegisterRequest){
        String email = userRegisterRequest.getEmail();
        try{
            validateEmail(email);
            User user = userMapper.mapToUser(userRegisterRequest);
            userRepository.save(user);
        }
        catch(ResponseStatusException e){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        try{
            fileService.store(userRegisterRequest.getProfilePicture(), true, email); // Adjusted to directly use the MultipartFile
        }
        catch(IOException e){
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Profile picture cannot be saved");
        }

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
        if (!passwordEncoder.matches(userChangePasswordRequest.getOldPassword(), user.getPassword())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Old password is incorrect.");
        }
        // Encode the new password
        user.setPassword(passwordEncoder.encode(userChangePasswordRequest.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }

    public ResponseEntity<String> updateUserEmail(UserChangeEmailRequest userChangeEmailRequest) {
        String oldEmail = userChangeEmailRequest.getOldEmail();
        String newEmail = userChangeEmailRequest.getNewEmail();
        User user = findUserByEmail(oldEmail).orElseThrow(()-> new ResponseStatusException(HttpStatus.NOT_FOUND, "User with email '" + oldEmail + "' not found."));

        if (userRepository.findUserByEmail(newEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        user.setEmail(newEmail);
        userRepository.save(user);
        return ResponseEntity.ok("Email updated successfully.");
    }

}
