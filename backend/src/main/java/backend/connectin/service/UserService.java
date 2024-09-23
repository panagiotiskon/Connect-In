package backend.connectin.service;

import backend.connectin.domain.repository.JobApplicationRepository;
import backend.connectin.web.mappers.PostMapper;
import backend.connectin.web.resources.*;

import backend.connectin.domain.*;
import backend.connectin.domain.repository.PersonalInfoRepository;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.dto.*;
import backend.connectin.web.mappers.PersonalInfoMapper;
import backend.connectin.web.mappers.UserMapper;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.requests.UserRegisterRequest;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;
    private final FileService fileService;
    private final PersonalInfoRepository personalInfoRepository;
    private final PersonalInfoMapper personalInfoMapper;
    private final ReactionService reactionService;
    private final JobService jobService;
    private final CommentService commentService;
    private final PostService postService;
    private final PostMapper postMapper;
    private final ConnectionService connectionService;

    public UserService(UserRepository userRepository,
                       UserMapper userMapper,
                       PasswordEncoder passwordEncoder,
                       FileService fileService,
                       PersonalInfoRepository personalInfoRepository,
                       PersonalInfoMapper personalInfoMapper,
                       @Lazy ReactionService reactionService,
                       @Lazy JobService jobService,
                       @Lazy CommentService commentService,
                       @Lazy PostService postService,
                       PostMapper postMapper,
                       @Lazy ConnectionService connectionService) {

        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
        this.fileService = fileService;
        this.personalInfoRepository = personalInfoRepository;
        this.personalInfoMapper = personalInfoMapper;
        this.reactionService = reactionService;
        this.jobService = jobService;
        this.commentService = commentService;
        this.postService = postService;
        this.postMapper = postMapper;
        this.connectionService = connectionService;
    }

    // Check if user with the given email already exists
    public void validateEmail(String email) {
        if (userRepository.findUserByEmail(email).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
    }

    public User findUserOrThrow(Long id) {
        return userRepository.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }

    @Transactional
    public void registerUser(UserRegisterRequest userRegisterRequest) {
        String email = userRegisterRequest.getEmail();
        User user;
        try {
            validateEmail(email);
            user = userMapper.mapToUser(userRegisterRequest);
            userRepository.save(user);
        } catch (ResponseStatusException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already exists");
        }
        try {
            fileService.store(userRegisterRequest.getProfilePicture(), true, user.getId()); // Adjusted to directly use the MultipartFile
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Profile picture cannot be saved");
        }

    }

    public List<User> fetchAll() {
        List<User> users = userRepository.findAll(); // Fetch all users
        return users.stream()  // fetch users without admin
                .filter(user -> user.getRoles().stream().noneMatch(role -> role.getName().equalsIgnoreCase("ROLE_ADMIN")))
                .toList();
    }


    public Optional<User> findUserByEmail(String email) {
        return userRepository.findUserByEmail(email);
    }

    @Transactional
    public void updatePassword(User user, UserChangePasswordRequest userChangePasswordRequest) {
        if (!passwordEncoder.matches(userChangePasswordRequest.getOldPassword(), user.getPassword())) {
            throw new RuntimeException("Old password does not match");
        }
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

    public List<Experience> getExperience(long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if (personalInfo == null) {
            return List.of();
        }
        return personalInfo.getExperiences();
    }

    public List<Skill> getSkills(long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            return List.of();
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if (personalInfo == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Personal Info not found");
        }
        return personalInfo.getSkills();
    }

    public List<Education> getEducation(long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if (personalInfo == null) {
            return List.of();
        }
        return personalInfo.getEducations();
    }

    @Transactional
    public List<Education> addEducation(long userId, Education education) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo;
        if (personalInfoRepository.findByUserId(userId) == null) {
            User user = userRepository.findById(userId).get();
            personalInfo = new PersonalInfo();
            personalInfo.setUser(user);
            personalInfo.setEducations(List.of(education));
            education.setPersonalInfo(personalInfo);
            personalInfoRepository.save(personalInfo);
        } else {
            personalInfo = personalInfoRepository.findByUserId(userId);

            education.setPersonalInfo(personalInfo);

            personalInfo.addToEducations(education);

            personalInfoRepository.save(personalInfo);
        }
        return personalInfo.getEducations();
    }

    @Transactional
    public List<Experience> addExperience(long userId, Experience experience) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "User not found");
        }
        PersonalInfo personalInfo;
        if (personalInfoRepository.findByUserId(userId) == null) {
            User user = userRepository.findById(userId).get();
            personalInfo = new PersonalInfo();
            personalInfo.setUser(user);
            personalInfo.setExperiences(List.of(experience));
            experience.setPersonalInfo(personalInfo);
            personalInfoRepository.save(personalInfo);
        } else {
            personalInfo = personalInfoRepository.findByUserId(userId);

            experience.setPersonalInfo(personalInfo);

            personalInfo.addToExperiences(experience);

            personalInfoRepository.save(personalInfo);
        }
        return personalInfo.getExperiences();
    }

    @Transactional
    public List<Skill> addSkill(long userId, Skill skill) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        PersonalInfo personalInfo;
        if (personalInfoRepository.findByUserId(userId) == null) {
            User user = userRepository.findById(userId).get();
            personalInfo = new PersonalInfo();
            personalInfo.setUser(user);
            personalInfo.setSkills(List.of(skill));
            skill.setPersonalInfo(personalInfo);
            personalInfoRepository.save(personalInfo);
        } else {
            personalInfo = personalInfoRepository.findByUserId(userId);

            skill.setPersonalInfo(personalInfo);

            personalInfo.addToSkills(skill);

            personalInfoRepository.save(personalInfo);
        }
        return personalInfo.getSkills();
    }

    public UserDetailDTO getUserDetails(long userId) {
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        UserDetailDTO userDetailDTO = new UserDetailDTO();

        if (personalInfo != null) {

            List<SkillDTO> skillDTOS = personalInfo.getSkills().stream()
                    .map(personalInfoMapper::mapToSkillDTO)
                    .toList();

            List<ExperienceDTO> experienceDTOS = personalInfo.getExperiences().stream()
                    .map(personalInfoMapper::mapToExperienceDTO)
                    .toList();

            List<EducationDTO> educationDTOS = personalInfo.getEducations().stream()
                    .map(personalInfoMapper::mapToEducationDTO)
                    .toList();

            userDetailDTO.setSkills(skillDTOS);
            userDetailDTO.setExperiences(experienceDTOS);
            userDetailDTO.setEducation(educationDTOS);
        }
        List<ConnectionResource> connectionResources = connectionService.getConnectedUsers(userId);
        List<JobApplicationDTO> jobApplicationDTOS = jobService.getJobApplications(userId);
        List<JobPostDTO> jobPostDTOS = jobService.getUserJobPosts(userId);

        List<PostResource> postResources = postService.fetchUserPosts(userId)
                .stream()
                .map(postMapper::mapToPostResource)
                .toList();

        List<CommentResource> commentResources = commentService.fetchUserCommentResources(userId);
        List<ReactionResource> reactionResources = reactionService.fetchUserReactions(userId);
        userDetailDTO.setConnectedUsers(connectionResources);
        userDetailDTO.setJobApplications(jobApplicationDTOS);
        userDetailDTO.setJobPosts(jobPostDTOS);
        userDetailDTO.setPosts(postResources);
        userDetailDTO.setComments(commentResources);
        userDetailDTO.setReactions(reactionResources);
        return userDetailDTO;
    }

    public Map<Long, UserDetailDTO> getUsersDetails(List<Long> userIds) {
        return userIds.stream()
                .collect(Collectors.toMap(
                        userId -> userId,
                        this::getUserDetails
                ));
    }

    public List<Long> getFilteredUsers(String searchTerm, long userId) {
        List<User> users = fetchAll();

        users = users.stream()
                .filter(user -> user.getId() != 1 && user.getId() != userId)
                .collect(Collectors.toList());


        if (searchTerm != null && !searchTerm.trim().isEmpty()) {
            String lowerCaseSearchTerm = searchTerm.toLowerCase();
            String[] searchTerms = lowerCaseSearchTerm.split(" ");

            users = users.stream()
                    .filter(user -> {
                        boolean matches = false;

                        if (searchTerms.length == 1) {
                            matches = user.getFirstName().toLowerCase().startsWith(searchTerms[0]);
                        } else if (searchTerms.length >= 2) {
                            matches = user.getFirstName().toLowerCase().startsWith(searchTerms[0])
                                    && user.getLastName().toLowerCase().startsWith(searchTerms[1]);
                        }

                        return matches;
                    }).toList();
            if (users.isEmpty()) {
                return new ArrayList<>();
            }

            return users.stream().map(User::getId).toList();

        } else {
            return new ArrayList<>();
        }
    }

    public void deleteSkill(long userId, long skillId) {
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if (personalInfo != null) {
            List<Skill> skills = personalInfo.getSkills();
            skills.removeIf(skill -> skill.getId() == skillId);
            personalInfo.setSkills(skills);
            personalInfoRepository.save(personalInfo);
        }
    }

    public void deleteEducation(long userId, long educationId) {
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if (personalInfo != null) {
            List<Education> educations = personalInfo.getEducations();
            educations.removeIf(education -> education.getId() == educationId);
            personalInfo.setEducations(educations);
            personalInfoRepository.save(personalInfo);
        }
    }

    public void deleteExperience(long userId, long experienceId) {
        PersonalInfo personalInfo = personalInfoRepository.findByUserId(userId);
        if (personalInfo != null) {
            List<Experience> experiences = personalInfo.getExperiences();
            experiences.removeIf(experience -> experience.getId() == experienceId);
            personalInfo.setExperiences(experiences);
            personalInfoRepository.save(personalInfo);
        }
    }

}

