package backend.connectin.web.controllers;

import backend.connectin.domain.User;
import backend.connectin.service.JWTService;
import backend.connectin.service.UserService;
import backend.connectin.web.requests.UserChangeEmailRequest;
import backend.connectin.web.requests.UserChangePasswordRequest;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "https://localhost:3000", allowCredentials = "true")
public class UserController {

    private final UserService userService;
    private final JWTService jwtService;

    public UserController(UserService userService, JWTService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
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

}
