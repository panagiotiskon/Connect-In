package backend.connectin.service;

import backend.connectin.domain.Post;
import backend.connectin.domain.Reaction;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.ReactionRepository;
import backend.connectin.web.mappers.ReactionMapper;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReactionService {

    private final ReactionRepository reactionRepository;
    private final UserService userService;
    private final PostService postService;
    private final ReactionMapper reactionMapper;

    public ReactionService(ReactionRepository reactionRepository, UserService userService, PostService postService, ReactionMapper reactionMapper) {
        this.reactionRepository = reactionRepository;
        this.userService = userService;
        this.postService = postService;
        this.reactionMapper = reactionMapper;
    }

    @Transactional
    public void createReaction(Long userId, Long postId) {
        User user = userService.findUserOrThrow(userId);
        Post post = postService.findPostOrThrow(postId);
        // check if the reaction to this post already exists
        if(reactionRepository.findByUserIdPostId(userId, postId).isPresent()) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "User already reacted to this Post");
        }
        Reaction reaction = reactionMapper.mapToReaction(user, post);
        reactionRepository.save(reaction);
    }

    @Transactional
    public void deleteReaction(Long userId, Long postId) {
        User user = userService.findUserOrThrow(userId);
        Post post = postService.findPostOrThrow(postId);
        List<Reaction> postReactions = post.getReactions();
        for (Reaction reaction : postReactions) {
            if (reaction.getUser().equals(user)) {
                reactionRepository.delete(reaction);
            }
        }
    }

    // fetches a list of post ids which the user reacted

    public List<Long> fetchUserReactions(Long userId) {
        User user = userService.findUserOrThrow(userId);
        List<Reaction> reactions = reactionRepository.findAllByUserId(userId);
        List<Long> reactedPostIds = new ArrayList<>();
        reactedPostIds = reactions.stream()
                .map(reaction -> reaction.getPost().getId())
                .distinct()
                .toList();
        return reactedPostIds;
    }

}
