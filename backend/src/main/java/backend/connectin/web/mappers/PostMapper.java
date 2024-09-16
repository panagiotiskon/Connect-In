package backend.connectin.web.mappers;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.service.FileService;
import backend.connectin.web.requests.PostRequest;
import backend.connectin.web.resources.CommentResource;
import backend.connectin.web.resources.PostResource;
import backend.connectin.web.resources.PostResourceDetailed;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;

@Component
public class PostMapper {

    private final FileService fileService;
    private final CommentMapper commentMapper;

    public PostMapper(FileService fileService, CommentMapper commentMapper) {
        this.fileService = fileService;
        this.commentMapper = commentMapper;
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

    public PostResourceDetailed mapToPostResourceDetailed(Post post) {
        PostResourceDetailed postResourceDetailed = new PostResourceDetailed();
        postResourceDetailed.setId(post.getId());
        postResourceDetailed.setContent(post.getContent());
        postResourceDetailed.setCreatedAt(post.getCreatedAt());
        postResourceDetailed.setUserId(post.getUserId());

        if(post.getFileId() != null) {
            FileDB fileDB = fileService.getFile(post.getFileId());
            postResourceDetailed.setFile(fileDB);
        }

        List<CommentResource> commentResources = post.getComments().stream()
                .map(commentMapper::mapToCommentResource)
                .sorted(Comparator.comparing(CommentResource::getCreatedAt).reversed())
                .toList();

        postResourceDetailed.setComments(commentResources);

        postResourceDetailed.setReactionCount((long) post.getReactions().size());

        return postResourceDetailed;
    }

    public PostResource mapToPostResource(Post post) {
        PostResource postResource = new PostResource();
        postResource.setPostId(post.getId());
        postResource.setContent(post.getContent());
        postResource.setCreatedAt(post.getCreatedAt());
        if(post.getFileId() != null) {
            FileDB fileDB = fileService.getFile(post.getFileId());
            postResource.setFile(fileDB);
        }
        return postResource;
    }

}
