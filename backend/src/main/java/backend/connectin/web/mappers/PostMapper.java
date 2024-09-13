package backend.connectin.web.mappers;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.service.FileService;
import backend.connectin.web.requests.PostRequest;
import backend.connectin.web.resources.PostResource;
import org.springframework.stereotype.Component;

import java.time.Instant;

@Component
public class PostMapper {

    private final FileService fileService;

    public PostMapper(FileService fileService) {
        this.fileService = fileService;
    }

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

    public PostResource mapToPostResource(Post post) {
        PostResource postResource = new PostResource();
        postResource.setId(post.getId());
        postResource.setContent(post.getContent());
        postResource.setCreatedAt(post.getCreatedAt());

        if(post.getFileId() != null) {
            FileDB fileDB = fileService.getFile(post.getFileId());
            postResource.setFile(fileDB);
        }
        return postResource;
    }

}
