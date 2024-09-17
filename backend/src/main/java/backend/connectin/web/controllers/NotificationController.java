package backend.connectin.web.controllers;

import backend.connectin.domain.Notification;
import backend.connectin.domain.enums.NotificationType;
import backend.connectin.service.NotificationService;
import backend.connectin.web.dto.NotificationDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class NotificationController {
    private final NotificationService notificationService;
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PostMapping("/notifications/{userId}/{type}/{connectionUserId}")
    public ResponseEntity<Notification> createNotification(@PathVariable long userId, @PathVariable NotificationType type, @PathVariable long connectionUserId) {
        return new ResponseEntity<>(notificationService.createNotification(userId,type,connectionUserId), HttpStatus.CREATED);
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable long userId) {
        return new ResponseEntity<>(notificationService.getNotifications(userId),HttpStatus.OK);
    }

    @GetMapping("/notifications/{userId}/count")
    public ResponseEntity<Long> getNumberOfNotifications(@PathVariable long userId) {
        return new ResponseEntity<>(notificationService.getNumberOfNotifications(userId),HttpStatus.OK);
    }

    @PutMapping("/notifications/{userId}/accept/{notificationId}")
    public void acceptNotification(@PathVariable long userId, @PathVariable long notificationId) {
        notificationService.acceptNotification(userId,notificationId);
    }

    @DeleteMapping("/notifications/{userId}/decline/{notificationId}")
    public void declineNotification(@PathVariable long userId, @PathVariable long notificationId) {
        notificationService.declineNotification(userId,notificationId);
    }

    @DeleteMapping("notifications/{userId}/delete/{connectedUserId}")
    public ResponseEntity<String> deleteNotification(@PathVariable long userId, @PathVariable long connectedUserId) {
        notificationService.deleteNotification(userId,connectedUserId);
        return new ResponseEntity<>("Notification Deleted Successfully",HttpStatus.OK);
    }

    @DeleteMapping("notifications/delete/{notificationId}")
    public ResponseEntity<String> deleteNotification( @PathVariable long notificationId) {
        notificationService.deleteNotificationUsingId(notificationId);
        return new ResponseEntity<>("Notification Deleted Successfully",HttpStatus.OK);
    }
}
