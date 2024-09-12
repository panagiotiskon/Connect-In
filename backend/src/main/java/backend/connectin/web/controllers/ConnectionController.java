package backend.connectin.web.controllers;

import backend.connectin.domain.Connection;
import backend.connectin.service.ConnectionService;
import backend.connectin.web.dto.ConnectedUserDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("auth")
@CrossOrigin(origins = "https://localhost:3000", allowCredentials = "true")
public class ConnectionController {
    private final ConnectionService connectionService;

    public ConnectionController(ConnectionService connectionService) {
        this.connectionService = connectionService;
    }

    @GetMapping("/connections/{userId}")
    @ResponseBody
    public ResponseEntity<List<ConnectedUserDTO>> getUserConnections(@PathVariable Long userId) {
        List<ConnectedUserDTO> connectedUserDTOList = connectionService.getUserConnections(userId);
        return new ResponseEntity<>(connectedUserDTOList, HttpStatus.OK);
    }

    @PostMapping("/connections/{userId}")
    public ResponseEntity<List<Connection>> createUserConnection(@PathVariable Long userId, @RequestParam Long connectionUserId) {
        return new ResponseEntity<>(connectionService.createUserConnection(userId,connectionUserId),HttpStatus.CREATED);
    }



}
