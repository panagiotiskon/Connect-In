package backend.connectin.service;

import backend.connectin.domain.Comment;
import backend.connectin.domain.Post;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.CommentRepository;
import backend.connectin.web.mappers.CommentMapper;
import backend.connectin.web.requests.CommentRequest;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class CommentService {

    private final CommentRepository commentRepository;
    private final UserService userService;
    private final PostService postService;
    private final CommentMapper commentMapper;


    public CommentService(CommentRepository commentRepository, UserService userService, PostService postService, CommentMapper commentMapper) {
        this.commentRepository = commentRepository;
        this.userService = userService;
        this.postService = postService;
        this.commentMapper = commentMapper;
    }

    @Transactional
    public void createComment(Long userId, Long postId, CommentRequest commentRequest) {
        User user = userService.findUserOrThrow(userId);
        Post post = postService.findPostOrThrow(postId);
        Comment comment = commentMapper.mapToComment(user, post, commentRequest);
        commentRepository.save(comment);
    }
}
