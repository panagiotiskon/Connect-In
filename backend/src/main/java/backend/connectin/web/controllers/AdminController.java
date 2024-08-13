package backend.connectin.web.controllers;

import backend.connectin.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("api")
public class AdminController {

    private final UserService userService;


    public AdminController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public ResponseEntity<String> admin() {
        return new ResponseEntity<>("new", HttpStatus.OK);
    }
}
