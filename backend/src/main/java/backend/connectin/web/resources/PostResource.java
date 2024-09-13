package backend.connectin.web.resources;

import backend.connectin.domain.FileDB;

import java.time.Instant;
import java.util.List;

public class PostResource {

    private Long id;
    private Long userId;
    private String content;
    private Instant createdAt;
    private FileDB file;
    private List<CommentResource> comments;
    private Long ReactionCount;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public FileDB getFile() {
        return file;
    }

    public void setFile(FileDB file) {
        this.file = file;
    }

    public List<CommentResource> getComments() {
        return comments;
    }

    public void setComments(List<CommentResource> comments) {
        this.comments = comments;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getReactionCount() {
        return ReactionCount;
    }

    public void setReactionCount(Long reactionCount) {
        ReactionCount = reactionCount;
    }
}
