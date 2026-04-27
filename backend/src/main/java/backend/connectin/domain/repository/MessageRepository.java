package backend.connectin.domain.repository;

import backend.connectin.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long> {
        @Query("SELECT m FROM Message m WHERE " +
                "(m.senderId = :userId1 AND m.receiverId = :userId2) OR " +
                "(m.senderId = :userId2 AND m.receiverId = :userId1) " +
                "ORDER BY m.sentAt ASC")
        List<Message> findMessagesBetweenUsers(@Param("userId1") Long userId1, @Param("userId2") Long userId2);

        @Query("SELECT m FROM Message m WHERE " +
                "(m.senderId = :userId OR m.receiverId = :userId) " +
                "ORDER BY m.sentAt DESC")
        List<Message> findUserConversations(@Param("userId") Long userId);

        @Query(value = """
                SELECT partner_id
                FROM (
                    SELECT CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END AS partner_id,
                           MAX(m.sent_at) AS last_at
                    FROM messages m
                    WHERE m.sender_id = :userId OR m.receiver_id = :userId
                    GROUP BY partner_id
                ) AS t
                ORDER BY t.last_at DESC
                """, nativeQuery = true)
        List<Long> findConversationPartnerIds(@Param("userId") Long userId);
}
