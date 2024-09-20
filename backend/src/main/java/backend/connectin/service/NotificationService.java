package backend.connectin.service;

import backend.connectin.domain.Notification;
import backend.connectin.domain.User;
import backend.connectin.domain.enums.NotificationType;
import backend.connectin.domain.repository.ConnectionRepository;
import backend.connectin.domain.repository.NotificationRepository;
import backend.connectin.web.mappers.NotificationMapper;
import backend.connectin.web.mappers.ReactionMapper;
import backend.connectin.web.requests.NotificationRequest;
import backend.connectin.web.resources.NotificationResource;
import backend.connectin.web.resources.PostResourceDetailed;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class NotificationService {
    private final UserService userService;
    private final ConnectionService connectionService;
    private final NotificationRepository notificationRepository;
    private final NotificationMapper notificationMapper;
    private final CommentService commentService;
    private final ReactionService reactionService;
    private final PostService postService;
    private final ReactionMapper reactionMapper;

    public NotificationService(UserService userService, ConnectionService connectionService, NotificationRepository notificationRepository, ConnectionRepository connectionRepository, NotificationMapper notificationMapper, CommentService commentService, ReactionService reactionService, PostService postService, ReactionMapper reactionMapper) {
        this.userService = userService;
        this.connectionService = connectionService;
        this.notificationRepository = notificationRepository;
        this.notificationMapper = notificationMapper;
        this.commentService = commentService;
        this.reactionService = reactionService;
        this.postService = postService;
        this.reactionMapper = reactionMapper;
    }

    @Transactional
    public Notification createNotification(NotificationRequest notificationRequest) {
        Long userId = notificationRequest.getUserId();
        Long connectionUserId = notificationRequest.getConnectionUserId();
        NotificationType type = notificationRequest.getType();
        Long objectId = notificationRequest.getObjectId();

        userService.findUserOrThrow(userId);
        userService.findUserOrThrow(connectionUserId);
        if (Objects.equals(userId, connectionUserId)) {
            return null;
        }

        // check if the user exists and is not a connection

        if (type == NotificationType.CONNECTION) {
            userService.findUserOrThrow(connectionUserId);
            List<Long> ids = connectionService.getConnectedUserIds(userId);
            if (ids.contains(connectionUserId)) {
                throw new RuntimeException("users already connected");
            }
        }

        // check if the object exists

        else if (type.equals(NotificationType.COMMENT)) {
            commentService.findCommentOrThrow(objectId);
        } else if (type.equals(NotificationType.REACTION)) {
            postService.findPostOrThrow(objectId);
        }
        Notification notification = notificationMapper.mapToNotification(userId, connectionUserId, type, objectId);
        notificationRepository.save(notification);
        return notification;
    }

    public List<NotificationResource> getNotifications(long userId) {
        userService.findUserOrThrow(userId);

        List<Notification> notifications = notificationRepository.getNotificationsByUserId(userId);

        if (notifications.isEmpty()) {
            return List.of();
        }

        return notifications.stream()
                .map(notificationMapper::mapToNotificationResource)
                .sorted(Comparator.comparing(NotificationResource::createdAt).reversed())
                .toList();
    }

    @Transactional
    public void acceptNotification(long userId, long notificationId) {
        userService.findUserOrThrow(userId);
        if (notificationRepository.findById(notificationId).isEmpty()) {
            throw new RuntimeException("notification does not exist");
        }
        Notification notification = notificationRepository.findById(notificationId).get();
        connectionService.changeConnectionStatusToAccepted(userId, notification.getConnectionUserId());
        notificationRepository.delete(notification);
    }

    @Transactional
    public void declineNotification(long userId, long notificationId) {
        userService.findUserOrThrow(userId);
        if (notificationRepository.findById(notificationId).isEmpty()) {
            throw new RuntimeException("notification does not exist");
        }
        Notification notification = notificationRepository.findById(notificationId).get();
        connectionService.deleteConnection(userId, notification.getConnectionUserId());
        notificationRepository.delete(notification);
    }

    public long getNumberOfNotifications(long userId) {
        userService.findUserOrThrow(userId);
        List<Notification> notifications = notificationRepository.getNotificationsByUserId(userId);
        return notifications.size();
    }

    @Transactional
    public void deleteNotificationByUserId(Long userId, Long connectionId) {
        Notification notification = notificationRepository.getNotificationByUserIdAndConnectionUserId(userId, connectionId);
        notificationRepository.delete(notification);
    }
    
    public void deleteNotificationByObjectId(Long objectId){
        notificationRepository.deleteNotificationByObjectId(objectId);
    }

    @Transactional
    public void deleteNotification(Long notificationId, Long userId, Long connectedUserId, Long objectId) {
        if (notificationId != null) {
            deleteNotificationById(notificationId);
        } else if ((userId) != null && (connectedUserId != null)) {
            deleteNotificationByUserId(userId, connectedUserId);
        } else if (objectId != null) {
            deleteNotificationByObjectId(objectId);
        } else
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR);
    }


    @Transactional
    public void deleteNotificationById(long notificationId) {
        if (notificationRepository.findById(notificationId).isEmpty()) {
            throw new RuntimeException("notification does not exist");
        }
        notificationRepository.delete(notificationRepository.findById(notificationId).get());
    }


}
