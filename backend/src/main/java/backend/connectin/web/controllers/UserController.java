package backend.connectin.web.controllers;

import backend.connectin.domain.Education;
import backend.connectin.domain.PersonalInfo;
import backend.connectin.domain.User;
import backend.connectin.service.JWTService;
import backend.connectin.service.UserService;
import backend.connectin.web.dto.EducationDTO;
import backend.connectin.web.dto.ExperienceDTO;
import backend.connectin.web.dto.SkillDTO;
import backend.connectin.web.mappers.PersonalInfoMapper;
import org.springframework.http.HttpStatus;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth/users")
public class UserController {
    private final UserService userService;
    private final JWTService jwtService;
    private final PersonalInfoMapper personalInfoMapper;

    public UserController(UserService userService, JWTService jwtService, PersonalInfoMapper personalInfoMapper) {
        this.userService = userService;
        this.jwtService = jwtService;
        this.personalInfoMapper = personalInfoMapper;
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
        List<ExperienceDTO> experiences = userService.getExperience(userId).stream().map(personalInfoMapper::mapToExperienceDTO).toList();
        return ResponseEntity.ok(experiences);
    }

    @GetMapping("/{userId}/personal-info/skills")
    public ResponseEntity<List<SkillDTO>> getSkills(@PathVariable long userId) {
        List<SkillDTO> skills = userService.getSkills(userId).stream().map(personalInfoMapper::mapToSkillDTO).toList();
        return ResponseEntity.ok(skills);
    }


}
