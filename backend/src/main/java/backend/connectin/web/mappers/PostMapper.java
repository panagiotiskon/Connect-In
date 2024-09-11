package backend.connectin.web.mappers;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.web.requests.PostRequest;

import java.time.Instant;

public class PostMapper {

    public Post mapToPost(PostRequest postRequest, FileDB fileDB) {
        Post post = new Post();
        post.setContent(postRequest.getContent());
        post.setFiles(fileDB);
        post.setCreatedAt(Instant.now());
        return post;
    }

}
