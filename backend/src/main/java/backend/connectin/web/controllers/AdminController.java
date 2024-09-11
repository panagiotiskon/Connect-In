package backend.connectin.web.controllers;

import backend.connectin.domain.User;
import backend.connectin.service.UserService;
import backend.connectin.web.dto.UserDTO;
import backend.connectin.web.dto.UserDetailDTO;
import backend.connectin.web.mappers.UserMapper;
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
    private final UserMapper userMapper;

    public AdminController(UserService userService, UserMapper userMapper) {
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping("")
    public ResponseEntity<String> admin() {
        return new ResponseEntity<>("new", HttpStatus.OK);
    }

    @GetMapping("/users")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public List<UserDTO> getUsers() {
        List<User> users = userService.fetchAll();
        return users.stream().map(userMapper::mapToUserDTO).toList();
    }
    @GetMapping("/users/details")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public Map<Long,UserDetailDTO> getUsersDetails(@RequestParam List<Long> userIds) {
        Map<Long,UserDetailDTO> userDetailDTOMap = userService.getUsersDetails(userIds);

        // Convert map to JSON string manually
        return userDetailDTOMap;
    }


//    @GetMapping("/{userId}")
//    @ResponseStatus(HttpStatus.OK)
//    @ResponseBody
//    public Page<UserResource> getUser(@RequestParam String userId) {
//
//    }

}
