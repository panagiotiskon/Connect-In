package backend.connectin.web.controllers;

import backend.connectin.domain.PostView;
import backend.connectin.service.PostService;
import backend.connectin.service.RecommendationService;
import backend.connectin.web.resources.PostResourceDetailed;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
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
    public ResponseEntity<List<PostResourceDetailed>> getRecommendedPosts(@PathVariable Long userId) {
        recommendationService.recommendPosts();
        return new ResponseEntity<>(recommendationService.findRecommendedPostsForUser(userId), HttpStatus.OK);
    }
}
