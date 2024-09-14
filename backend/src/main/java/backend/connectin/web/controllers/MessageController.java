package backend.connectin.web.controllers;

import backend.connectin.domain.Message;
import backend.connectin.service.MessageService;
import backend.connectin.web.dto.ConversationDTO;
import backend.connectin.web.dto.MessageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth/messages")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class MessageController {
    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    @PostMapping("/send")
    public ResponseEntity<Message> sendMessage(
            @RequestParam long senderId,
            @RequestParam long receiverId,
            @RequestParam String content
    ) {
        Message message = messageService.sendMessage(senderId, receiverId, content);
        return ResponseEntity.ok(message);
    }

    @GetMapping("/conversation")
    public ResponseEntity<List<MessageDTO>> getConversation(
            @RequestParam long userId1,
            @RequestParam long userId2
    ) {
        List<MessageDTO> messages = messageService.getConversation(userId1, userId2);
        return ResponseEntity.ok(messages);
    }

    @PostMapping("/conversation")
    public void createConversation(
            @RequestParam long userId1,
            @RequestParam long userId2
    ) {
        messageService.createConversation(userId1, userId2);
    }


    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getConversations(
            @RequestParam long currentUserId
    ) {
        List<ConversationDTO> conversations = messageService.getConversations(currentUserId);
        return ResponseEntity.ok(conversations);
    }
}


