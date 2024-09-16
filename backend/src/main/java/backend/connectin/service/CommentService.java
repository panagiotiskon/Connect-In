package backend.connectin.service;

import backend.connectin.domain.Comment;
import backend.connectin.domain.Post;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.CommentRepository;
import backend.connectin.web.mappers.CommentMapper;
import backend.connectin.web.requests.CommentRequest;
import backend.connectin.web.resources.CommentResource;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Transactional
    public void deleteComment(Long userId, Long postId, long commentId) {
        Post post = postService.findPostOrThrow(postId);

        if (!post.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Post does not belong to the user");
        }
        List<Comment> comments = post.getComments();

        boolean commentExists = comments.stream()
                .anyMatch(comment -> comment.getId() == commentId);

        // check if the comment exists in the post

        if (!commentExists) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Comment does not exist");
        }
        commentRepository.deleteById(commentId);
    }


    public Map<Long, List<Long>> fetchUserComments(Long userId) {
        User user = userService.findUserOrThrow(userId);
        List<Post> posts = postService.fetchAll();
        Map<Long, List<Long>> userComments = new HashMap<>();

        // Iterate over all posts
        for (Post post : posts) {
            List<Long> commentIds = new ArrayList<>();

            // Iterate over the comments of each post
            for (Comment comment : post.getComments()) {
                // If the comment belongs to the user, add commentId to the list
                if (comment.getUser().getId().equals(userId)) {
                    commentIds.add(comment.getId());
                }
            }

            // Only add the post to the map if there are comments by the user
            if (!commentIds.isEmpty()) {
                userComments.put(post.getId(), commentIds);
            }
        }
        return userComments;
    }

    public List<CommentResource> fetchUserCommentResources(Long userId) {
        User user = userService.findUserOrThrow(userId);
        List<Comment> comments = commentRepository.findAllByUserId(userId);
        return comments.stream().map(commentMapper::mapToCommentResource).toList();
    }


}
