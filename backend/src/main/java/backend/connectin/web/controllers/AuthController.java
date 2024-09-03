package backend.connectin.web.controllers;

import backend.connectin.domain.User;
import backend.connectin.security.JWTGenerator;
import backend.connectin.service.FileService;
import backend.connectin.service.UserService;
import backend.connectin.web.dto.UserDTO;
import backend.connectin.web.mappers.AuthResourceMapper;
import backend.connectin.web.mappers.UserMapper;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.requests.UserLoginRequest;
import backend.connectin.web.requests.UserRegisterRequest;
import backend.connectin.web.resources.AuthResource;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
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
@CrossOrigin(origins = "https://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;
    private final AuthResourceMapper authResourceMapper;
    private final UserMapper userMapper;

    public AuthController(UserService userService, AuthenticationManager authenticationManager, JWTGenerator jwtGenerator, AuthResourceMapper authResourceMapper, FileService fileService, UserMapper userMapper) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
        this.authResourceMapper = authResourceMapper;
        this.userMapper = userMapper;
    }


    @PostMapping("/login")
    public ResponseEntity<AuthResource> login(@RequestBody UserLoginRequest userLoginRequest, HttpServletResponse response) {
        String token = authenticateUser(userLoginRequest.getEmail(), userLoginRequest.getPassword());

        Cookie jwtCookie = new Cookie("accessToken", token);

        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);
        jwtCookie.setMaxAge(3600);
        jwtCookie.setPath("/");

        response.addCookie(jwtCookie);

        AuthResource authResource = authResourceMapper.mapToAuthResource(token, userLoginRequest.getEmail());
        return new ResponseEntity<>(authResource, HttpStatus.OK);
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletResponse response) {
        // Create a cookie with the same name and set its Max-Age to 0
        Cookie jwtCookie = new Cookie("accessToken", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setSecure(true);  // Keep it consistent with how you set it
        jwtCookie.setPath("/");
        jwtCookie.setMaxAge(0);  // 0 means delete the cookie

        response.addCookie(jwtCookie);

        return new ResponseEntity<>("Logged out successfully", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResource> register(
            @RequestParam("email") String email,
            @RequestParam("password") String password,
            @RequestParam("firstName") String firstName,
            @RequestParam("lastName") String lastName,
            @RequestParam("phoneNumber") String phoneNumber,
            @RequestParam("profilePicture") MultipartFile profilePicture,
            HttpServletResponse response) {

        try {
            UserRegisterRequest userRegisterRequest = new UserRegisterRequest(email, password, lastName,
                    firstName, profilePicture, phoneNumber);
            userService.registerUser(userRegisterRequest);
            String token = authenticateUser(email, password);
            Cookie jwtCookie = new Cookie("accessToken", token);
            jwtCookie.setHttpOnly(true);  // Prevents JavaScript access
            jwtCookie.setSecure(true);  // Use true in production (ensures the cookie is sent over HTTPS)
            jwtCookie.setPath("/");  // Cookie is available to the entire application
            jwtCookie.setMaxAge(3600);  // Sets the expiry time to 1 hour (match your JWT expiration)

            response.addCookie(jwtCookie);
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
        return userService.updateUserEmail(userChangeEmailRequest);
    }

    private String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtGenerator.generateToken(authentication);
    }

    @GetMapping("/current-user")
    public ResponseEntity<UserDTO> getCurrentUser(@CookieValue(value = "accessToken", required = false) String token) {
        if (token == null || token.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
        try {
            String email = jwtGenerator.getUsernameFromJWT(token);
            User user = userService.findUserByEmail(email)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

            UserDTO userDTO = userMapper.mapToUserDTO(user);

            return new ResponseEntity<>(userDTO, HttpStatus.OK);

        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.UNAUTHORIZED);
        }
    }



}
