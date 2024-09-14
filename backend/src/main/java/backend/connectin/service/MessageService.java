package backend.connectin.service;

import backend.connectin.domain.Message;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.MessageRepository;
import backend.connectin.web.dto.ConversationDTO;
import backend.connectin.web.dto.MessageDTO;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class MessageService {
    private final UserService userService;
    private final MessageRepository messageRepository;
    private final ConnectionService connectionService;
    private final FileService fileService;
    public MessageService(UserService userService, MessageRepository messageRepository, ConnectionService connectionService, FileService fileService ) {
        this.userService = userService;
        this.messageRepository = messageRepository;
        this.connectionService = connectionService;
        this.fileService = fileService;
    }

    public Message sendMessage(long senderId,long receiverId, String content){
        userService.findUserOrThrow(senderId);
        userService.findUserOrThrow(receiverId);
        if(connectionService.getConnectedUserIds(senderId).stream().noneMatch(connectionId -> connectionId.equals(receiverId))){
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

    public List<MessageDTO> getConversation(long senderId,long receiverId){
        userService.findUserOrThrow(senderId);
        userService.findUserOrThrow(receiverId);
        if(connectionService.getConnectedUserIds(senderId).stream().noneMatch(connectionId -> connectionId.equals(receiverId))){
            throw new RuntimeException("You are not connected to any connection");
        }
        List<Message> messages = messageRepository.findMessagesBetweenUsers(senderId, receiverId);
        if(messages.isEmpty()){
            return List.of();
        }
        List<MessageDTO> messageDTOS = new ArrayList<>();
        for(var message: messages){
            Map<String, String> profilePicture = fileService.getAllFiles()
                    .filter(file -> file.getUser().getId().equals(message.getSenderId()) && file.getType().startsWith("image/"))
                    // Sort images: Profile picture comes first (isProfilePicture == true)
                    .sorted((file1, file2) -> Boolean.compare(file2.getProfilePicture(), file1.getProfilePicture()))
                    // Map to the required format
                    .map(file -> Map.of(
                            "type", file.getType(),
                            "data", Base64.getEncoder().encodeToString(file.getData())
                    ))
                    // Get the first image (if any)
                    .findFirst()
                    .orElse(null);
            MessageDTO messageDTO = new MessageDTO(message.getContent(),profilePicture.get("data"),profilePicture.get("type"),message.getSentAt());
            messageDTOS.add(messageDTO);
        }
        return messageDTOS;
    }

    public List<ConversationDTO> getConversations(long currentUserId){
        userService.findUserOrThrow(currentUserId);
        List<Message> messages = messageRepository.findUserConversations(currentUserId);
        if(messages.isEmpty()){
            return List.of();
        }
        Set<Long> uniqueUserIds = messages.stream()
                .filter(message -> message.getSenderId() == currentUserId || message.getReceiverId() == currentUserId)
                .collect(Collectors.groupingBy(
                        message -> message.getSenderId() == currentUserId ? message.getReceiverId() : message.getSenderId(),
                        Collectors.maxBy(Comparator.comparing(Message::getSentAt))
                ))
                .values().stream()
                .filter(Optional::isPresent)
                .map(optionalMessage -> {
                    Message message = optionalMessage.get();
                    return message.getSenderId() == currentUserId ? message.getReceiverId() : message.getSenderId();
                })
                .collect(Collectors.toSet());
        if(uniqueUserIds.isEmpty()){
            return List.of();
        }
        List<ConversationDTO> conversationDTOS = new ArrayList<>();
        for(var uniqueUserId : uniqueUserIds){
            User user = userService.findUserOrThrow(uniqueUserId);
            Map<String, String> profilePicture = fileService.getAllFiles()
                    .filter(file -> file.getUser().getId().equals(uniqueUserId) && file.getType().startsWith("image/"))
                    // Sort images: Profile picture comes first (isProfilePicture == true)
                    .sorted((file1, file2) -> Boolean.compare(file2.getProfilePicture(), file1.getProfilePicture()))
                    // Map to the required format
                    .map(file -> Map.of(
                            "type", file.getType(),
                            "data", Base64.getEncoder().encodeToString(file.getData())
                    ))
                    // Get the first image (if any)
                    .findFirst()
                    .orElse(null);
            ConversationDTO conversationDTO = new ConversationDTO(uniqueUserId,profilePicture.get("data"),profilePicture.get("type"),user.getFirstName(),user.getLastName());
            conversationDTOS.add(conversationDTO);
        }
        return conversationDTOS;
    }

    public void createConversation(long senderId,long receiverId) {
        userService.findUserOrThrow(senderId);
        userService.findUserOrThrow(receiverId);
        if (connectionService.getConnectedUserIds(senderId).stream().noneMatch(connectionId -> connectionId.equals(receiverId))) {
            throw new RuntimeException("You are not connected to any connection");
        }
        List<Message> messages = messageRepository.findMessagesBetweenUsers(senderId, receiverId);
        if(messages.isEmpty()) {
            Message message = new Message();
            message.setSenderId(senderId);
            message.setReceiverId(receiverId);
            message.setContent(null);
            message.setSentAt(Instant.now());
            messageRepository.save(message);
        }
    }
}
