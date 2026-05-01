package backend.connectin.web.controllers;

import backend.connectin.domain.PostView;
import backend.connectin.service.PostService;
import backend.connectin.service.RecommendationService;
import backend.connectin.web.dto.FeedPageDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class PostRecommendationController {
    private final RecommendationService recommendationService;
    private final PostService postService;
    public PostRecommendationController(RecommendationService recommendationService, PostService postService) {
        this.recommendationService = recommendationService;
        this.postService = postService;
    }

    @PostMapping("/view-post")
    public PostView addViewToAPost(@RequestParam long userId , @RequestParam Long postId) {
        return postService.addViewToAPost(userId,postId);
    }

    @GetMapping("/{userId}/recommended-posts")
    public ResponseEntity<FeedPageDTO> getRecommendedPosts(
            @PathVariable Long userId,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", required = false) Integer size) {
        return new ResponseEntity<>(recommendationService.findRecommendedPostsForUser(userId, page, size), HttpStatus.OK);
    }
}
