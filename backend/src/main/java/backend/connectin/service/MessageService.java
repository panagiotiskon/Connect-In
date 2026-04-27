package backend.connectin.service;

import backend.connectin.domain.Message;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.FileRepository;
import backend.connectin.domain.repository.MessageRepository;
import backend.connectin.util.FileUrlBuilder;
import backend.connectin.web.dto.ConversationDTO;
import backend.connectin.web.dto.MessageDTO;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final UserService userService;
    private final MessageRepository messageRepository;
    private final ConnectionService connectionService;
    private final FileRepository fileRepository;
    private final FileUrlBuilder fileUrlBuilder;

    public MessageService(UserService userService,
                          MessageRepository messageRepository,
                          ConnectionService connectionService,
                          FileRepository fileRepository,
                          FileUrlBuilder fileUrlBuilder) {
        this.userService = userService;
        this.messageRepository = messageRepository;
        this.connectionService = connectionService;
        this.fileRepository = fileRepository;
        this.fileUrlBuilder = fileUrlBuilder;
    }

    public Message sendMessage(long senderId, long receiverId, String content) {
        userService.findUserOrThrow(senderId);
        userService.findUserOrThrow(receiverId);
        if (connectionService.getConnectedUserIds(senderId).stream().noneMatch(id -> id.equals(receiverId))) {
            throw new RuntimeException("You are not connected to any connection");
        }

        Message message = new Message();
        message.setSenderId(senderId);
        message.setReceiverId(receiverId);
        message.setContent(content);
        message.setSentAt(Instant.now());
        messageRepository.save(message);
        return message;
    }

    public List<MessageDTO> getConversation(long senderId, long receiverId) {
        userService.findUserOrThrow(senderId);
        userService.findUserOrThrow(receiverId);
        List<Message> messages = messageRepository.findMessagesBetweenUsers(senderId, receiverId);
        if (messages.isEmpty()) {
            return List.of();
        }

        List<Long> distinctSenderIds = messages.stream()
                .map(Message::getSenderId)
                .distinct()
                .toList();
        Map<Long, String> profilePictureUrlBySender = loadProfilePictureUrls(distinctSenderIds);

        List<MessageDTO> messageDTOS = new ArrayList<>(messages.size());
        for (Message message : messages) {
            messageDTOS.add(new MessageDTO(
                    message.getSenderId(),
                    message.getContent(),
                    profilePictureUrlBySender.get(message.getSenderId()),
                    message.getSentAt()));
        }
        return messageDTOS;
    }

    public List<ConversationDTO> getConversations(long currentUserId) {
        userService.findUserOrThrow(currentUserId);
        // Single SQL query (GROUP BY + MAX) — replaces the previous load-all-messages
        // + Java-side dedup that scaled with total message history.
        List<Long> partnerIds = messageRepository.findConversationPartnerIds(currentUserId);
        if (partnerIds.isEmpty()) {
            return List.of();
        }

        Map<Long, User> usersById = userService.findUsersByIds(partnerIds).stream()
                .collect(Collectors.toMap(User::getId, Function.identity()));
        Map<Long, String> profilePictureUrlByUserId = loadProfilePictureUrls(partnerIds);

        List<ConversationDTO> dtos = new ArrayList<>(partnerIds.size());
        for (Long partnerId : partnerIds) {
            User user = usersById.get(partnerId);
            if (user == null) {
                continue;
            }
            dtos.add(new ConversationDTO(
                    partnerId,
                    profilePictureUrlByUserId.get(partnerId),
                    user.getFirstName(),
                    user.getLastName()));
        }
        return dtos;
    }

    public void createConversation(long senderId, long receiverId) {
        userService.findUserOrThrow(senderId);
        userService.findUserOrThrow(receiverId);
        if (connectionService.getConnectedUserIds(senderId).stream().noneMatch(id -> id.equals(receiverId))) {
            throw new RuntimeException("You are not connected to any connection");
        }
        List<Message> messages = messageRepository.findMessagesBetweenUsers(senderId, receiverId);
        if (messages.isEmpty()) {
            Message message = new Message();
            message.setSenderId(senderId);
            message.setReceiverId(receiverId);
            message.setContent(null);
            message.setSentAt(Instant.now());
            messageRepository.save(message);
        }
    }

    private Map<Long, String> loadProfilePictureUrls(List<Long> userIds) {
        if (userIds.isEmpty()) return Map.of();
        Map<Long, String> result = new HashMap<>();
        // Returns only (userId, fileId) — never loads BLOB data.
        fileRepository.findProfilePictureFileIdsByUserIds(userIds).forEach(row -> {
            Long uid = ((Number) row[0]).longValue();
            String fileId = (String) row[1];
            if (fileId != null) {
                result.put(uid, fileUrlBuilder.build(fileId));
            }
        });
        return result;
    }
}
