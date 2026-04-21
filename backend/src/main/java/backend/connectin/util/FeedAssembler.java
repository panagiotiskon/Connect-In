package backend.connectin.util;

import backend.connectin.domain.Post;
import backend.connectin.web.dto.FileMetaDTO;
import backend.connectin.web.mappers.CommentMapper;
import backend.connectin.web.resources.CommentResource;
import backend.connectin.web.resources.PostResourceDetailed;
import org.springframework.stereotype.Component;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Component
public class FeedAssembler {

    private final CommentMapper commentMapper;
    private final FileUrlBuilder fileUrlBuilder;

    public FeedAssembler(CommentMapper commentMapper, FileUrlBuilder fileUrlBuilder) {
        this.commentMapper = commentMapper;
        this.fileUrlBuilder = fileUrlBuilder;
    }

    public List<PostResourceDetailed> assemble(List<Post> posts,
                                               Map<Long, Long> reactionCountsByPostId,
                                               Map<String, FileMetaDTO> filesByFileId) {
        return posts.stream()
                .map(post -> toResource(post, reactionCountsByPostId, filesByFileId))
                .toList();
    }

    private PostResourceDetailed toResource(Post post,
                                            Map<Long, Long> reactionCountsByPostId,
                                            Map<String, FileMetaDTO> filesByFileId) {
        PostResourceDetailed resource = new PostResourceDetailed();
        resource.setId(post.getId());
        resource.setContent(post.getContent());
        resource.setCreatedAt(post.getCreatedAt());
        resource.setUserId(post.getUserId());
        resource.setReactionCount(reactionCountsByPostId.getOrDefault(post.getId(), 0L));

        if (post.getFileId() != null) {
            FileMetaDTO meta = filesByFileId.get(post.getFileId());
            if (meta != null) {
                if (meta.getUrl() == null) {
                    meta.setUrl(fileUrlBuilder.build(meta.getId()));
                }
                resource.setFile(meta);
            }
        }

        List<CommentResource> commentResources = post.getComments().stream()
                .map(commentMapper::mapToCommentResource)
                .sorted(Comparator.comparing(CommentResource::getCreatedAt).reversed())
                .toList();
        resource.setComments(commentResources);

        return resource;
    }

}
