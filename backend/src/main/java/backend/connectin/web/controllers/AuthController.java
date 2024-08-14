package backend.connectin.web.controllers;

import backend.connectin.domain.User;
import backend.connectin.security.JWTGenerator;
import backend.connectin.service.AuthService;
import backend.connectin.service.UserService;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import backend.connectin.web.requests.UserLoginRequest;
import backend.connectin.web.requests.UserRegisterRequest;
import backend.connectin.web.resources.AuthResource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class AuthController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final JWTGenerator jwtGenerator;

    public AuthController(UserService userService, AuthService authService, AuthenticationManager authenticationManager, JWTGenerator jwtGenerator) {
        this.userService = userService;
        this.authenticationManager = authenticationManager;
        this.jwtGenerator = jwtGenerator;
    }


    @PostMapping("/register")
    public ResponseEntity<AuthResource> register(@RequestBody UserRegisterRequest userRegisterRequest) {
        try {
            userService.registerUser(userRegisterRequest);
            String token = authenticateUser(userRegisterRequest.getEmail(), userRegisterRequest.getPassword());
            return new ResponseEntity<>(new AuthResource(token), HttpStatus.OK);

        } catch (ResponseStatusException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).build();
        }
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResource> login(@RequestBody UserLoginRequest userLoginRequest) {
        String token = authenticateUser(userLoginRequest.getEmail(), userLoginRequest.getPassword());
        return new ResponseEntity<>(new AuthResource(token), HttpStatus.OK);
    }

    @PostMapping("/change-password")
    @ResponseBody
    public ResponseEntity<String> changePassword(@RequestParam UserChangePasswordRequest userChangePasswordRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return userService.updatePassword(user, userChangePasswordRequest);
    }

    @PostMapping("/change-email")
    public ResponseEntity<String> changeEmail(@RequestParam UserChangeEmailRequest userChangeEmailRequest) {
        String email = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userService.findUserByEmail(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return userService.updateUserEmail(user, userChangeEmailRequest );
    }

    private String authenticateUser(String email, String password) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));
        SecurityContextHolder.getContext().setAuthentication(authentication);
        return jwtGenerator.generateToken(authentication);
    }

}
