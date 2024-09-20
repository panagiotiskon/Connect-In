package backend.connectin.web.controllers;

import backend.connectin.domain.*;
import backend.connectin.service.CommentService;
import backend.connectin.domain.Education;
import backend.connectin.domain.Experience;
import backend.connectin.domain.Skill;
import backend.connectin.domain.User;
import backend.connectin.service.JWTService;
import backend.connectin.service.PostService;
import backend.connectin.service.UserService;
import backend.connectin.service.*;
import backend.connectin.web.dto.EducationDTO;
import backend.connectin.web.dto.ExperienceDTO;
import backend.connectin.web.dto.SkillDTO;
import backend.connectin.web.dto.UserDTO;
import backend.connectin.web.mappers.CommentMapper;
import backend.connectin.web.mappers.PersonalInfoMapper;
import backend.connectin.web.mappers.PostMapper;
import backend.connectin.web.mappers.UserMapper;
import backend.connectin.web.requests.CommentRequest;
import backend.connectin.web.requests.PostRequest;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.resources.PostResourceDetailed;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class UserController {
    private final UserService userService;
    private final JWTService jwtService;
    private final PersonalInfoMapper personalInfoMapper;
    private final UserMapper userMapper;
    private final PostService postService;
    private final PostMapper postMapper;
    private final CommentService commentService;
    private final ReactionService reactionService;

    public UserController(UserService userService, JWTService jwtService, PersonalInfoMapper personalInfoMapper, UserMapper userMapper, PostService postService, PostMapper postMapper, CommentService commentService, CommentMapper commentMapper, ReactionService reactionService) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.personalInfoMapper = personalInfoMapper;
        this.userMapper = userMapper;
        this.postService = postService;
        this.postMapper = postMapper;
        this.commentService = commentService;
        this.reactionService = reactionService;
    }

    @PostMapping("/{userId}/change-password")
    public ResponseEntity<String> changePassword(@PathVariable("userId") long userId,
                                                 @RequestBody UserChangePasswordRequest userChangePasswordRequest,
                                                 HttpServletResponse response) {
        try {
            User user = userService.findUserOrThrow(userId);
            userService.updatePassword(user, userChangePasswordRequest);
            Cookie emptyCookie = jwtService.returnEmptyCookie();
            response.addCookie(emptyCookie);
            return ResponseEntity.ok("Password changed");
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @PostMapping("/{userId}/change-email")
    public ResponseEntity<String> changeEmail(@PathVariable("userId") long userId,
                                              @RequestBody UserChangeEmailRequest userChangeEmailRequest,
                                              HttpServletResponse response) {
        try {
            User user = userService.findUserOrThrow(userId);
            userService.updateUserEmail(userChangeEmailRequest);
            Cookie emptyCookie = jwtService.returnEmptyCookie();
            response.addCookie(emptyCookie);
            return ResponseEntity.ok("Email changed");
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }

    @GetMapping("/{userId}/personal-info/education")
    public ResponseEntity<List<EducationDTO>> getEducation(@PathVariable long userId) {
        List<Education> educations = userService.getEducation(userId);
        List<EducationDTO> educationDTOS = educations.stream().map(personalInfoMapper::mapToEducationDTO).toList();
        return new ResponseEntity<>(educationDTOS, HttpStatus.OK);
    }

    @PostMapping("/{userId}/personal-info/education")
    public ResponseEntity<List<EducationDTO>> addEducation(@PathVariable long userId, @RequestBody EducationDTO educationDTO) {
        Education education = personalInfoMapper.mapToEducation(educationDTO);
        List<Education> educations = userService.addEducation(userId, education);
        List<EducationDTO> educationDTOS = educations.stream().map(personalInfoMapper::mapToEducationDTO).toList();
        return new ResponseEntity<>(educationDTOS, HttpStatus.OK);
    }

    @GetMapping("/{userId}/personal-info/experience")
    public ResponseEntity<List<ExperienceDTO>> getExperience(@PathVariable long userId) {
        List<Experience> experiences = userService.getExperience(userId);
        List<ExperienceDTO> experienceDTOS = experiences.stream().map(personalInfoMapper::mapToExperienceDTO).toList();
        return new ResponseEntity<>(experienceDTOS, HttpStatus.OK);
    }

    @PostMapping("/{userId}/personal-info/experience")
    public ResponseEntity<List<ExperienceDTO>> addExperience(@PathVariable long userId, @RequestBody ExperienceDTO experienceDTO) {
        Experience experience = personalInfoMapper.mapToExperience(experienceDTO);
        List<Experience> experiences = userService.addExperience(userId, experience);
        List<ExperienceDTO> experienceDTOS = experiences.stream().map(personalInfoMapper::mapToExperienceDTO).toList();
        return new ResponseEntity<>(experienceDTOS, HttpStatus.OK);
    }

    @GetMapping("/{userId}/personal-info/skills")
    public ResponseEntity<List<SkillDTO>> getSkills(@PathVariable long userId) {
        List<SkillDTO> skills = userService.getSkills(userId).stream().map(personalInfoMapper::mapToSkillDTO).toList();
        return ResponseEntity.ok(skills);
    }

    @PostMapping("/{userId}/personal-info/skills")
    public ResponseEntity<List<SkillDTO>> addSkills(@PathVariable long userId, @RequestBody SkillDTO skillDTO) {
        Skill skill = personalInfoMapper.mapToSkill(skillDTO);
        List<Skill> skills = userService.addSkill(userId, skill);
        List<SkillDTO> skillDTOS = skills.stream().map(personalInfoMapper::mapToSkillDTO).toList();
        return new ResponseEntity<>(skillDTOS, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/personal-info/skills/{skillId}")
    public void deleteSkill(
            @PathVariable long userId,
            @PathVariable long skillId) {
            userService.deleteSkill(userId, skillId);
    }

    @DeleteMapping("/{userId}/personal-info/experiences/{experienceId}")
    public void deleteExperience(
            @PathVariable long userId,
            @PathVariable long experienceId) {
        userService.deleteExperience(userId, experienceId);
    }

    @DeleteMapping("/{userId}/personal-info/educations/{educationId}")
    public void deleteEducation(
            @PathVariable long userId,
            @PathVariable long educationId) {
        userService.deleteEducation(userId, educationId);
    }
    // --------FEED-----------


    @GetMapping("/{userId}/feed")
    public ResponseEntity<List<PostResourceDetailed>> getUserFeed(@PathVariable long userId) {
        List<Post> posts = postService.fetchFeed(userId);
        List<PostResourceDetailed> postResourceDetailed = posts.stream()
                .map(postMapper::mapToPostResourceDetailed)
                .sorted(Comparator.comparing(PostResourceDetailed::getCreatedAt).reversed())
                .toList();
        return new ResponseEntity<>(postResourceDetailed, HttpStatus.OK);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserDTO> getUser(@PathVariable long userId) {
        User user = userService.findUserOrThrow(userId);
        return new ResponseEntity<>(userMapper.mapToUserDTO(user), HttpStatus.OK);
    }

    // --------POSTS-----------

    @PostMapping("/{userId}/create-post")
    public ResponseEntity<String> createPost(@PathVariable long userId,
                                             @RequestParam("content") String content,
                                             @RequestParam(value = "file", required = false) MultipartFile file) {
        PostRequest postRequest;
        if (file != null)
            postRequest = new PostRequest(content, file);
        else
            postRequest = new PostRequest(content);
        postService.createPost(userId, postRequest);
        return ResponseEntity.ok("Post Created");
    }


    @GetMapping("/{userId}/posts")
    public ResponseEntity<List<PostResourceDetailed>> getUserPosts(@PathVariable long userId) {
        List<Post> posts = postService.fetchFeed(userId);
        List<PostResourceDetailed> postResourceDetaileds = posts.stream()
                .map(postMapper::mapToPostResourceDetailed).toList();
        return new ResponseEntity<>(postResourceDetaileds, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable long userId,
                                             @PathVariable long postId) {
        postService.deletePost(userId, postId);
        return new ResponseEntity<>("Post Deleted", HttpStatus.OK);
    }

    // --------COMMENTS-----------


    // returns newly created comment id

    @PostMapping("/{userId}/{postId}/create-comment")
    public ResponseEntity<Long> createComment(@PathVariable long userId,
                                                @PathVariable long postId,
                                                @RequestBody CommentRequest commentRequest) {
        return new ResponseEntity<>(commentService.createComment(userId, postId, commentRequest), HttpStatus.OK);
    }

    // this returns a map to post id -> list of comment ids of the user

    @GetMapping("/{userId}/comments")
    public ResponseEntity<Map<Long, List<Long>>> getUserComments(@PathVariable long userId){
        Map<Long, List<Long>> userComments = commentService.fetchUserComments(userId);
        return new ResponseEntity<>(userComments, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}/{postId}/{commentId}")
    public ResponseEntity<String> deleteComment(@PathVariable long userId,
                                                @PathVariable long postId,
                                                @PathVariable long commentId) {
        commentService.deleteComment(userId, postId, commentId);
        return new ResponseEntity<>("Comment Deleted", HttpStatus.OK);
    }

    // --------REACTIONS-----------


    @PostMapping("/{userId}/{postId}/create-reaction")
    public ResponseEntity<Long> createReaction(@PathVariable long userId,
                                                 @PathVariable long postId){

        return new ResponseEntity<>(reactionService.createReaction(userId, postId), HttpStatus.OK);
    }

    // returns a list of users reacted posts

    @GetMapping("/{userId}/reactions")
    public ResponseEntity<List<Long>> getUserReactions(@PathVariable long userId) {
        List<Long> reactedPostsList = reactionService.fetchUserReactionIds(userId);
        return new ResponseEntity<>(reactedPostsList, HttpStatus.OK);
    }


    @DeleteMapping("/{userId}/{postId}/reaction")
    public ResponseEntity<String> deleteReaction(@PathVariable long userId,
                                                 @PathVariable long postId){
        reactionService.deleteReaction(userId, postId);
        return new ResponseEntity<>("Reaction Deleted", HttpStatus.OK);
    }


}
