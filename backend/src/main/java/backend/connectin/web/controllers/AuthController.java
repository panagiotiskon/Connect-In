package backend.connectin.web.controllers;

import backend.connectin.domain.User;
import backend.connectin.security.JWTGenerator;
import backend.connectin.service.FileService;
import backend.connectin.service.UserService;
import backend.connectin.web.mappers.AuthResourceMapper;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.requests.UserLoginRequest;
import backend.connectin.web.requests.UserRegisterRequest;
import backend.connectin.web.resources.AuthResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;
    private final AuthResourceMapper authResourceMapper;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JWTGenerator jwtGenerator, AuthResourceMapper authResourceMapper, FileService fileService) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
        this.authResourceMapper = authResourceMapper;
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResource> login(@RequestBody UserLoginRequest userLoginRequest) {
        String token = authenticateUser(userLoginRequest.getEmail(), userLoginRequest.getPassword());
        AuthResource authResource = authResourceMapper.mapToAuthResource(token, userLoginRequest.getEmail());
        return new ResponseEntity<>(authResource, HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResource> register(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("profilePicture") MultipartFile profilePicture) {

        try {
            UserRegisterRequest userRegisterRequest = new UserRegisterRequest(email, password, lastName,
                    firstName, profilePicture, phoneNumber);
            userService.registerUser(userRegisterRequest);
            String token = authenticateUser(email, password);
            AuthResource authResource = authResourceMapper.mapToAuthResource(token, email);
            return new ResponseEntity<>(authResource, HttpStatus.OK);

        } catch (ResponseStatusException e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, e.getMessage());
        }
    }


    @PostMapping("/validate-email")
    public ResponseEntity<Map<String, Boolean>> validateEmail(@RequestBody String email) {
        Map<String, Boolean> response = new HashMap<>();
        try {
            userService.validateEmail(email);
            response.put("isValid", true);
            return ResponseEntity.ok(response); // Send a JSON response with isValid: true
        } catch (ResponseStatusException e) {
            response.put("isValid", false);
            return ResponseEntity.status(HttpStatus.CONFLICT).body(response); // Send a JSON response with isValid: false
        }
    }

    @PostMapping("/change-password")
    @ResponseBody
    public ResponseEntity<String> changePassword(@RequestBody UserChangePasswordRequest userChangePasswordRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return userService.updatePassword(user, userChangePasswordRequest);
    }

    @PostMapping("/change-email")
    public ResponseEntity<String> changeEmail(@RequestBody UserChangeEmailRequest userChangeEmailRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return userService.updateUserEmail(user, userChangeEmailRequest);
    }

    private String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtGenerator.generateToken(authentication);
    }

}
