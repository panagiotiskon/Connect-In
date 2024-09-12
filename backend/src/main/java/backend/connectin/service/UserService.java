package backend.connectin.service;

import backend.connectin.domain.*;
import backend.connectin.domain.repository.FileRepository;
import backend.connectin.domain.repository.PersonalInfoRepository;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.dto.EducationDTO;
import backend.connectin.web.dto.ExperienceDTO;
import backend.connectin.web.dto.SkillDTO;
import backend.connectin.web.dto.UserDetailDTO;
import backend.connectin.web.mappers.PersonalInfoMapper;
import backend.connectin.web.mappers.UserMapper;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.requests.UserRegisterRequest;
import backend.connectin.web.resources.UserResource;
import jakarta.transaction.Transactional;
import jdk.jfr.Registered;
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
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;
    private final FileRepository fileRepository;
    private final PersonalInfoRepository personalInfoRepository;
    private final PersonalInfoMapper personalInfoMapper;

    public UserService(UserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder, FileService fileService, FileRepository fileRepository, PersonalInfoRepository personalInfoRepository, PersonalInfoMapper personalInfoMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.personalInfoRepository = personalInfoRepository;
        this.personalInfoMapper = personalInfoMapper;
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

    public List<User> fetchAll() {
        return userRepository.findAll(); // Fetch all users
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
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if(personalInfo==null){
            return List.of();
        }
        return personalInfo.getExperiences();
    }

    public List<Skill> getSkills(long userId){
        if (userRepository.findById(userId).isEmpty()) {
            return List.of();
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if(personalInfo==null){
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personal Info not found");
        }
        return personalInfo.getSkills();
    }

    public List<Education> getEducation(long userId){
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if(personalInfo==null){
            return List.of();
        }
        return personalInfo.getEducations();
    }

    @Transactional
    public List<Education> addEducation(long userId,Education education){
        if(userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo;
        if(personalInfoRepository.findByUserId(userId)==null){
            User user = userRepository.findById(userId).get();
            personalInfo = new PersonalInfo();
            personalInfo.setUser(user);
            personalInfo.setEducations(List.of(education));
            education.setPersonalInfo(personalInfo);
            personalInfoRepository.save(personalInfo);
        }
       else {
        personalInfo = personalInfoRepository.findByUserId(userId);

        education.setPersonalInfo(personalInfo);

        personalInfo.addToEducations(education);

        personalInfoRepository.save(personalInfo);
    }
        return personalInfo.getEducations();
    }

    @Transactional
    public List<Experience> addExperience(long userId,Experience experience){
        if(userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo;
        if(personalInfoRepository.findByUserId(userId)==null){
            User user = userRepository.findById(userId).get();
            personalInfo = new PersonalInfo();
            personalInfo.setUser(user);
            personalInfo.setExperiences(List.of(experience));
            experience.setPersonalInfo(personalInfo);
            personalInfoRepository.save(personalInfo);
        }
        else {
            personalInfo = personalInfoRepository.findByUserId(userId);

            experience.setPersonalInfo(personalInfo);

            personalInfo.addToExperiences(experience);

            personalInfoRepository.save(personalInfo);
        }
        return personalInfo.getExperiences();
    }

    @Transactional
    public List<Skill> addSkill(long userId,Skill skill){
        if(userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo;
        if(personalInfoRepository.findByUserId(userId)==null){
            User user = userRepository.findById(userId).get();
            personalInfo = new PersonalInfo();
            personalInfo.setUser(user);
            personalInfo.setSkills(List.of(skill));
            skill.setPersonalInfo(personalInfo);
            personalInfoRepository.save(personalInfo);
        }
        else {
            personalInfo = personalInfoRepository.findByUserId(userId);

            skill.setPersonalInfo(personalInfo);

            personalInfo.addToSkills(skill);

            personalInfoRepository.save(personalInfo);
        }
        return personalInfo.getSkills();
    }

    public UserDetailDTO getUserDetails(long userId) {
        // Check if the user exists
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        // Retrieve personal info
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        UserDetailDTO userDetailDTO = new UserDetailDTO();

        if (personalInfo != null) {
            // Map personal info to DTOs if present
            List<SkillDTO> skillDTOS = personalInfo.getSkills().stream()
                    .map(personalInfoMapper::mapToSkillDTO)
                    .collect(Collectors.toList());
            List<ExperienceDTO> experienceDTOS = personalInfo.getExperiences().stream()
                    .map(personalInfoMapper::mapToExperienceDTO)
                    .collect(Collectors.toList());
            List<EducationDTO> educationDTOS = personalInfo.getEducations().stream()
                    .map(personalInfoMapper::mapToEducationDTO)
                    .collect(Collectors.toList());

            userDetailDTO.setSkills(skillDTOS);
            userDetailDTO.setExperiences(experienceDTOS);
            userDetailDTO.setEducation(educationDTOS);
        } else {
            // Optionally, log that personalInfo was not found
            System.out.println("No personal info found for userId: " + userId);
        }

        return userDetailDTO;
    }

    public Map<Long, UserDetailDTO> getUsersDetails(List<Long> userIds) {
        return userIds.stream()
                .collect(Collectors.toMap(
                        userId -> userId,
                        this::getUserDetails
                ));
    }



}

