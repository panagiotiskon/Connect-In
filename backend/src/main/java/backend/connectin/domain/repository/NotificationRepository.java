package backend.connectin.domain.repository;

import backend.connectin.domain.Notification;
import backend.connectin.domain.enums.NotificationType;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> getNotificationsByUserId(long userId);

    Notification getNotificationByUserIdAndConnectionUserId(long userId, long notificationId);
}
