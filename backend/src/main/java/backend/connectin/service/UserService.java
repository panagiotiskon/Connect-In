package backend.connectin.service;

import backend.connectin.domain.*;
import backend.connectin.domain.repository.FileRepository;
import backend.connectin.domain.repository.PersonalInfoRepository;
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
    private final FileRepository fileRepository;
    private final PersonalInfoRepository personalInfoRepository;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, FileService fileService, FileRepository fileRepository, PersonalInfoRepository personalInfoRepository) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.personalInfoRepository = personalInfoRepository;
    }

    // Check if user with the given email already exists
    public void validateEmail(String email) {
        if (userRepository.findUserByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
    }

    public User findUserOrThrow(Long id){
        return userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public void registerUser(UserRegisterRequest userRegisterRequest){
        String email = userRegisterRequest.getEmail();
        User user;
        try{
            validateEmail(email);
            user = userMapper.mapToUser(userRegisterRequest);
            userRepository.save(user);
        }
        catch(ResponseStatusException e){
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        try{
            fileService.store(userRegisterRequest.getProfilePicture(), true, user.getId()); // Adjusted to directly use the MultipartFile
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

    @Transactional
    public void updatePassword(User user, UserChangePasswordRequest userChangePasswordRequest) {
        if (!passwordEncoder.matches(userChangePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password does not match");
        }
        // Encode the new password
        user.setPassword(passwordEncoder.encode(userChangePasswordRequest.getNewPassword()));
        userRepository.save(user);
    }

    @Transactional
    public void updateUserEmail(UserChangeEmailRequest userChangeEmailRequest) {

        String oldEmail = userChangeEmailRequest.getOldEmail();
        String newEmail = userChangeEmailRequest.getNewEmail();

        User user = userRepository.findUserByEmail(oldEmail)
                .orElseThrow(() -> new RuntimeException("User with old email not found."));

        if (userRepository.findUserByEmail(newEmail).isPresent()) {
            throw new RuntimeException("New email already exists.");
        }

        user.setEmail(newEmail);
        userRepository.save(user);
    }

    public List<Experience> getExperience(long userId){
        if (userRepository.findById(userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if(personalInfo==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personal Info not found");
        }
        return personalInfo.getExperiences();
    }

    @Transactional
    public List<Skill> getSkills(long userId){
        if (userRepository.findById(userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if(personalInfo==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personal Info not found");
        }
        return personalInfo.getSkills();
    }

    @Transactional
    public List<Education> getEducation(long userId){
        if (userRepository.findById(userId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if(personalInfo==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personal Info not found");
        }
        return personalInfo.getEducations();
    }
}

