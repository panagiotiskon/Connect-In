package backend.connectin.web.mappers;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.domain.repository.FileRepository;
import backend.connectin.service.FileService;
import backend.connectin.util.FileUrlBuilder;
import backend.connectin.web.dto.FileMetaDTO;
import backend.connectin.web.requests.PostRequest;
import backend.connectin.web.resources.CommentResource;
import backend.connectin.web.resources.PostResource;
import backend.connectin.web.resources.PostResourceDetailed;
import org.springframework.stereotype.Component;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;

@Component
public class PostMapper {

    private final FileService fileService;
    private final FileRepository fileRepository;
    private final CommentMapper commentMapper;
    private final FileUrlBuilder fileUrlBuilder;

    public PostMapper(FileService fileService, FileRepository fileRepository,
                      CommentMapper commentMapper, FileUrlBuilder fileUrlBuilder) {
        this.fileService = fileService;
        this.fileRepository = fileRepository;
        this.commentMapper = commentMapper;
        this.fileUrlBuilder = fileUrlBuilder;
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
            loadFileMeta(post.getFileId()).ifPresent(postResourceDetailed::setFile);
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

    private Optional<FileMetaDTO> loadFileMeta(String fileId) {
        return fileRepository.findMetaById(fileId)
                .map(meta -> {
                    meta.setUrl(fileUrlBuilder.build(meta.getId()));
                    return meta;
                });
    }

}
