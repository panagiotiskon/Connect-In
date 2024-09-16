package backend.connectin.service;

import backend.connectin.domain.Connection;
import backend.connectin.domain.Experience;
import backend.connectin.domain.FileDB;
import backend.connectin.domain.User;
import backend.connectin.domain.enums.ConnectionStatus;
import backend.connectin.domain.repository.ConnectionRepository;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.dto.ConnectedUserDTO;
import backend.connectin.web.mappers.ConnectionMapper;
import backend.connectin.web.resources.ConnectionResource;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@Service
public class ConnectionService {
    private final UserRepository userRepository;
    private final UserService userService;
    private final ConnectionRepository connectionRepository;
    private final FileService fileService;
    private final ConnectionMapper connectionMapper;

    public ConnectionService(UserRepository userRepository, UserService userService, ConnectionRepository connectionRepository, FileService fileService, ConnectionMapper connectionMapper) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.connectionRepository = connectionRepository;
        this.fileService = fileService;
        this.connectionMapper = connectionMapper;
    }

    public List<ConnectedUserDTO> getUserConnections(long userId) {
        List<ConnectedUserDTO> connectedUserDTOS = new ArrayList<>();
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        List<Connection> connectionList = connectionRepository.findUserConnections(userId);

        List<User> connectedUsers = connectionList.stream()
                .map(connection -> userService.findUserOrThrow(connection.getUserId2()))
                .toList();

        for (User user : connectedUsers) {
            List<Experience> experiences = userService.getExperience(user.getId()); // get latest experience
            String jobTitle;
            String companyName;
            if (experiences.isEmpty()) {
                jobTitle = null;
                companyName = null;
            } else {
                jobTitle = experiences.getFirst().getJobTitle();
                companyName = experiences.getFirst().getCompanyName();
            }
            FileDB profilePicture = fileService.getProfilePicture(user.getId()).get();
            String profilePic;
            String profilePicType;
            if (profilePicture.getType().startsWith("image/")) {
                profilePic = Base64.getEncoder().encodeToString(profilePicture.getData());
                profilePicType = profilePicture.getType();
            } else {
                profilePic = null;
                profilePicType = null;
            }
            ConnectedUserDTO connectedUserDTO = new ConnectedUserDTO(user.getId(), user.getFirstName(), user.getLastName(), jobTitle, companyName, profilePic, profilePicType);
            connectedUserDTOS.add(connectedUserDTO);
        }
        if (connectionList.isEmpty()) {
            return List.of();
        }
        return connectedUserDTOS;
    }

    public List<Long> getConnectedUserIds(long userId) {
        List<Connection> connectionList = connectionRepository.findUserConnections(userId);
        return connectionList.stream().map(Connection::getUserId2).toList();
    }

    public List<ConnectionResource> getConnectedUsers(Long userId){
        return connectionRepository.findUserConnections(userId)
                .stream()
                .map(connectionMapper::mapToConnectionResource)
                .toList();
    }

    @Transactional
    public List<Connection> requestToConnect(long userId, long connectionId) {
        List<Connection> connectionList = new ArrayList<>();
        if (userRepository.findById(userId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        if (userRepository.findById(connectionId).isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
        Connection connection1 = connectionMapper.mapToConnection(userId, connectionId, ConnectionStatus.PENDING);
        Connection connection2 = connectionMapper.mapToConnection(connectionId, userId, ConnectionStatus.PENDING);

        connectionRepository.save(connection1);
        connectionRepository.save(connection2);
        connectionList.add(connection1);
        connectionList.add(connection2);
        return connectionList;
    }

    @Transactional
    public void changeConnectionStatusToAccepted(long userId, long connectionUserId) {
        connectionRepository.updateConnectionStatus(userId, connectionUserId, ConnectionStatus.ACCEPTED);
    }

    @Transactional
    public void deleteConnection(long userId, long connectionUserId) {
        connectionRepository.deleteConnection(userId, connectionUserId);
    }
}
