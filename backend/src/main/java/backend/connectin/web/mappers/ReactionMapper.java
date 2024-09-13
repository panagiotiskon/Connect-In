package backend.connectin.web.mappers;

import backend.connectin.domain.Post;
import backend.connectin.domain.Reaction;
import backend.connectin.domain.User;
import backend.connectin.service.PostService;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class ReactionMapper {

    public ReactionMapper(PostService postService) {
    }

    public Reaction mapToReaction(User user, Post post) {
        Reaction reaction = new Reaction();
        reaction.setUser(user);
        reaction.setPost(post);
        reaction.setCreatedAt(Instant.now());
        post.getReactions().add(reaction);
        return reaction;
    }

}
