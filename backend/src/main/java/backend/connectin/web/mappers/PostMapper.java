package backend.connectin.web.mappers;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.web.requests.PostRequest;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PostMapper {

    public Post mapToPost(PostRequest postRequest, String fileId, Long userId) {
        Post post = new Post();
        post.setContent(postRequest.getContent());
        post.setFileId(fileId);
        post.setUserId(userId);
        post.setCreatedAt(Instant.now());
        return post;
    }
    public Post mapToPost(PostRequest postRequest, Long userId) {
        Post post = new Post();
        post.setContent(postRequest.getContent());
        post.setUserId(userId);
        post.setCreatedAt(Instant.now());
        return post;
    }

}
