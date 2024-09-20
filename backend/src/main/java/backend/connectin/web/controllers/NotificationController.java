package backend.connectin.web.controllers;

import backend.connectin.domain.Notification;
import backend.connectin.domain.enums.NotificationType;
import backend.connectin.service.NotificationService;
import backend.connectin.web.requests.NotificationRequest;
import backend.connectin.web.resources.NotificationResource;
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

    @PostMapping("/notifications/create")
    public ResponseEntity<Notification> createNotification(@RequestBody NotificationRequest notificationRequest) {
        return new ResponseEntity<>(notificationService.createNotification(notificationRequest), HttpStatus.CREATED);
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationResource>> getNotifications(@PathVariable long userId) {
        return new ResponseEntity<>(notificationService.getNotifications(userId), HttpStatus.OK);
    }

    @GetMapping("/notifications/{userId}/count")
    public ResponseEntity<Long> getNumberOfNotifications(@PathVariable long userId) {
        return new ResponseEntity<>(notificationService.getNumberOfNotifications(userId), HttpStatus.OK);
    }

    @PutMapping("/notifications/{userId}/accept/{notificationId}")
    public void acceptNotification(@PathVariable long userId, @PathVariable long notificationId) {
        notificationService.acceptNotification(userId, notificationId);
    }

    @DeleteMapping("/notifications/{userId}/decline/{notificationId}")
    public void declineNotification(@PathVariable long userId, @PathVariable long notificationId) {
        notificationService.declineNotification(userId, notificationId);
    }

    @DeleteMapping("notifications/delete")
    public ResponseEntity<String> deleteNotification(@RequestParam(required = false) Long notificationId,
                                                     @RequestParam(required = false) Long userId,
                                                     @RequestParam(required = false) Long connectedUserId,
                                                     @RequestParam(required = false) Long objectId) {
        notificationService.deleteNotification(notificationId, userId, connectedUserId, objectId);
        return new ResponseEntity<>("Notification Deleted Successfully", HttpStatus.OK);
    }
}
