package backend.connectin.web.resources;

import backend.connectin.domain.FileDB;

import java.time.Instant;

public class PostResource {

    private Long postId;
    private String content;
    private Instant createdAt;
    private FileDB file;

    public Long getPostId() {
        return postId;
    }

    public void setPostId(Long postId) {
        this.postId = postId;
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
}
