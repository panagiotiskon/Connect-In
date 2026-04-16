package backend.connectin.web.controllers;

import backend.connectin.service.UserService;
import backend.connectin.web.dto.UserDTO;
import backend.connectin.web.dto.UserDetailDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@Controller
@RequestMapping("admin")
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
    public List<UserDTO> getUsers() {
        return userService.fetchAllDTOs();
    }
    @GetMapping("/users/details")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Map<Long,UserDetailDTO> getUsersDetails(@RequestParam List<Long> userIds) {
        return userService.getUsersDetails(userIds);
    }

}
