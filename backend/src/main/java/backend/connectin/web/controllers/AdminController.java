package backend.connectin.web.controllers;

import backend.connectin.service.UserService;
import backend.connectin.web.resources.UserResourceDto;
import jakarta.validation.groups.Default;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("api/admin")
public class AdminController {

    private final UserService userService;


    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("")
    public ResponseEntity<String> admin() {
        return new ResponseEntity<>("new", HttpStatus.OK);
    }

    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Page<UserResourceDto> getUsers(@RequestParam(required = false, defaultValue = "ROLE_USER") String role , Pageable pageable) {
        return userService.fetchAll(role, pageable);
    }

//    @GetMapping("/{userId}")
//    @ResponseStatus(HttpStatus.OK)
//    @ResponseBody
//    public Page<UserResourceDto> getUser(@RequestParam String userId) {
//
//    }

}
