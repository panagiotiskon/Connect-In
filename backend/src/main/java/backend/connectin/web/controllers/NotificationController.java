package backend.connectin.web.controllers;

import backend.connectin.domain.Notification;
import backend.connectin.domain.enums.NotificationType;
import backend.connectin.service.NotifictionService;
import backend.connectin.web.dto.NotificationDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
public class NotificationController {
    private final NotifictionService notifictionService;
    public NotificationController(NotifictionService notifictionService) {
        this.notifictionService = notifictionService;
    }

    @PostMapping("/notifications/{userId}/{type}/{connectionUserId}")
    public ResponseEntity<Notification> createNotification(@PathVariable long userId, @PathVariable NotificationType type, @PathVariable long connectionUserId) {
        return new ResponseEntity<>(notifictionService.createNotification(userId,type,connectionUserId), HttpStatus.CREATED);
    }

    @GetMapping("/notifications/{userId}")
    public ResponseEntity<List<NotificationDTO>> getNotifications(@PathVariable long userId) {
        return new ResponseEntity<>(notifictionService.getNotifications(userId),HttpStatus.OK);
    }

    @GetMapping("/notifications/{userId}/count")
    public ResponseEntity<Long> getNumberOfNotifications(@PathVariable long userId) {
        return new ResponseEntity<>(notifictionService.getNumberOfNotifications(userId),HttpStatus.OK);
    }

    @PutMapping("/notifications/{userId}/accept/{notificationId}")
    public void acceptNotification(@PathVariable long userId, @PathVariable long notificationId) {
        notifictionService.acceptNotification(userId,notificationId);
    }

    @DeleteMapping("/notifications/{userId}/decline/{notificationId}")
    public void declineNotification(@PathVariable long userId, @PathVariable long notificationId) {
        notifictionService.declineNotification(userId,notificationId);
    }


}
