package backend.connectin.web.resources;

import backend.connectin.web.dto.FeedAuthorDTO;

import java.time.Instant;

public class CommentResource {

    private Long commentId;
    private String content;
    private Instant createdAt;
    private Long userId;
    private String username;
    private FeedAuthorDTO author;

    public Long getCommentId() {
        return commentId;
    }

    public void setCommentId(Long commentId) {
        this.commentId = commentId;
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

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public FeedAuthorDTO getAuthor() {
        return author;
    }

    public void setAuthor(FeedAuthorDTO author) {
        this.author = author;
    }
}
