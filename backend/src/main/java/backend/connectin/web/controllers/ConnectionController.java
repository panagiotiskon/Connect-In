package backend.connectin.web.controllers;

import backend.connectin.domain.Connection;
import backend.connectin.service.ConnectionService;
import backend.connectin.service.UserService;
import backend.connectin.web.dto.ConnectedUserDTO;
import backend.connectin.web.dto.RegisteredUserDTO;
import backend.connectin.web.mappers.UserMapper;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.swing.plaf.PanelUI;
import java.util.List;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "https://localhost:3000", allowCredentials = "true")
public class ConnectionController {
    private final ConnectionService connectionService;
    private final UserService userService;
    private final UserMapper userMapper;

    public ConnectionController(ConnectionService connectionService, UserService userService, UserMapper userMapper) {
        this.connectionService = connectionService;
        this.userService = userService;
        this.userMapper = userMapper;
    }

    @GetMapping("/connections/{userId}")
    @ResponseBody
    public ResponseEntity<List<ConnectedUserDTO>> getUserConnections(@PathVariable Long userId) {
        List<ConnectedUserDTO> connectedUserDTOList = connectionService.getUserConnections(userId);
        return new ResponseEntity<>(connectedUserDTOList, HttpStatus.OK);
    }

    @GetMapping("/connections/pending/{userId}")
    @ResponseBody
    public ResponseEntity<List<ConnectedUserDTO>> getUserPendingConnections(@PathVariable Long userId) {
        List<ConnectedUserDTO> connectedUserDTOList = connectionService.getPendingUserConnections(userId);
        return new ResponseEntity<>(connectedUserDTOList, HttpStatus.OK);
    }

    @PostMapping("/connections/{userId}")
    public ResponseEntity<List<Connection>> requestToConnect(@PathVariable Long userId, @RequestParam Long connectionUserId) {
        return new ResponseEntity<>(connectionService.requestToConnect(userId,connectionUserId),HttpStatus.CREATED);
    }

    @GetMapping("/connections/registered-users")
    @ResponseStatus(HttpStatus.OK)
    @ResponseBody
    public List<RegisteredUserDTO> getSpecificRegisteredUsers(
            @RequestParam(value = "search", required = false) String searchTerm,
            @RequestParam(value = "userId") long userId) {

        List<Long> users = userService.getFilteredUsers(searchTerm, userId);
        return connectionService.removeConnectedAndPendingUsers(users,userId);
    }

    @DeleteMapping("connections/{userId}")
    public ResponseEntity<String> deleteConnection(@PathVariable Long userId, @RequestParam Long connectionUserId) {
        connectionService.deleteConnection(userId,connectionUserId);
        return new ResponseEntity<>("Successfully deleted", HttpStatus.OK);
    }

}
