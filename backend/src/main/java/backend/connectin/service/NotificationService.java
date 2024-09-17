package backend.connectin.service;

import backend.connectin.domain.Notification;
import backend.connectin.domain.User;
import backend.connectin.domain.enums.NotificationType;
import backend.connectin.domain.repository.ConnectionRepository;
import backend.connectin.domain.repository.NotificationRepository;
import backend.connectin.web.dto.NotificationDTO;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class NotifictionService {
    private final UserService userService;
    private final ConnectionService connectionService;
    private final NotificationRepository notificationRepository;

    public NotifictionService(UserService userService, ConnectionService connectionService, NotificationRepository notificationRepository, ConnectionRepository connectionRepository) {
        this.userService = userService;
        this.connectionService = connectionService;
        this.notificationRepository = notificationRepository;
    }

    @Transactional
    public Notification createNotification(long userId, NotificationType type,long connectionUserId){
        userService.findUserOrThrow(userId);
        userService.findUserOrThrow(connectionUserId);
        Notification notification;
        if(type==NotificationType.CONNECTION) {
            userService.findUserOrThrow(connectionUserId);
            List<Long> ids = connectionService.getConnectedUserIds(userId);
            if (ids.contains(connectionUserId)) {
                throw new RuntimeException("users already connected");
            }
            notification = new Notification();
            notification.setType(type);
            notification.setUserId(userId);
            notification.setConnectionUserId(connectionUserId);
            notification.setCreatedAt(Instant.now());

            notificationRepository.save(notification);
        }
        else{
            notification = new Notification();
            notification.setType(type);
            notification.setUserId(userId);
            notification.setConnectionUserId(connectionUserId);
            notification.setCreatedAt(Instant.now());

            notificationRepository.save(notification);
        }
        return notification;
    }
    public List<NotificationDTO> getNotifications(long userId) {
        userService.findUserOrThrow(userId);

        List<Notification> notifications = notificationRepository.getNotificationsByUserId(userId);

        if (notifications.isEmpty()) {
            return List.of();
        }

        List<Long> connectionIds = notifications.stream()
                .map(Notification::getConnectionUserId)
                .toList();

        Map<Long, User> connectedUsersMap = connectionIds.stream()
                .map(userService::findUserOrThrow)
                .collect(Collectors.toMap(User::getId, user -> user));

        return notifications.stream()
                .map(notification -> {
                    User connectedUser = connectedUsersMap.get(notification.getConnectionUserId());
                    return new NotificationDTO(
                            notification.getId(),
                            notification.getConnectionUserId(),
                            connectedUser.getFirstName(),
                            connectedUser.getLastName(),
                            notification.getType()
                    );
                })
                .toList();
    }

    @Transactional
    public void acceptNotification(long userId, long notificationId) {
        userService.findUserOrThrow(userId);
        if(notificationRepository.findById(notificationId).isEmpty()){
            throw new RuntimeException("notification does not exist");
        }
        Notification notification = notificationRepository.findById(notificationId).get();
        connectionService.changeConnectionStatusToAccepted(userId, notification.getConnectionUserId());
        notificationRepository.delete(notification);
    }
    @Transactional
    public void declineNotification(long userId, long notificationId) {
        userService.findUserOrThrow(userId);
        if(notificationRepository.findById(notificationId).isEmpty()){
            throw new RuntimeException("notification does not exist");
        }
        Notification notification = notificationRepository.findById(notificationId).get();
        connectionService.deleteConnection(userId,notification.getConnectionUserId());
        notificationRepository.delete(notification);
    }

    public long getNumberOfNotifications(long userId) {
        userService.findUserOrThrow(userId);
        List<Notification> notifications = notificationRepository.getNotificationsByUserId(userId);
        return notifications.size();
    }

    @Transactional
    public void deleteNotification(Long userId, Long connectionId){
        Notification notification = notificationRepository.getNotificationByUserIdAndConnectionUserId(userId, connectionId);
        notificationRepository.delete(notification);
    }

}
