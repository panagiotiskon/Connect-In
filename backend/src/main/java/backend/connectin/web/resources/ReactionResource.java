package backend.connectin.web.resources;

import java.time.Instant;

public class ReactionResource {

    private Long reactionId;
    private Long postId;
    private Instant createdAt;

    public ReactionResource() {
    }

    public ReactionResource(Long reactionId, Long postId, Instant createdAt) {
        this.reactionId = reactionId;
        this.postId = postId;
        this.createdAt = createdAt;
    }

    public Long getReactionId() {
        return reactionId;
    }

    public void setReactionId(Long reactionId) {
        this.reactionId = reactionId;
    }

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
