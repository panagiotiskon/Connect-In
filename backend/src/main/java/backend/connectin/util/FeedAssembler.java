package backend.connectin.util;

import backend.connectin.domain.Post;
import backend.connectin.domain.repository.FileRepository;
import backend.connectin.domain.repository.ReactionRepository;
import backend.connectin.domain.repository.UserRepository;
import backend.connectin.web.dto.FeedAuthorDTO;
import backend.connectin.web.dto.FileMetaDTO;
import backend.connectin.web.mappers.CommentMapper;
import backend.connectin.web.resources.CommentResource;
import backend.connectin.web.resources.PostResourceDetailed;
import org.springframework.stereotype.Component;

import java.util.Collection;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.function.Function;
import java.util.stream.Collectors;

@Component
public class FeedAssembler {

    private final CommentMapper commentMapper;
    private final FileUrlBuilder fileUrlBuilder;
    private final UserRepository userRepository;
    private final FileRepository fileRepository;
    private final ReactionRepository reactionRepository;

    public FeedAssembler(CommentMapper commentMapper,
                         FileUrlBuilder fileUrlBuilder,
                         UserRepository userRepository,
                         FileRepository fileRepository,
                         ReactionRepository reactionRepository) {
        this.commentMapper = commentMapper;
        this.fileUrlBuilder = fileUrlBuilder;
        this.userRepository = userRepository;
        this.fileRepository = fileRepository;
        this.reactionRepository = reactionRepository;
    }

    public List<PostResourceDetailed> assemble(List<Post> posts,
                                               Map<Long, Long> reactionCountsByPostId,
                                               Map<String, FileMetaDTO> filesByFileId) {
        Map<Long, FeedAuthorDTO> authorsById = loadAuthors(collectUserIds(posts));
        return posts.stream()
                .map(post -> toResource(post, reactionCountsByPostId, filesByFileId, authorsById))
                .toList();
    }

    public List<PostResourceDetailed> assemble(List<Post> posts) {
        if (posts.isEmpty()) return List.of();

        List<Long> postIds = posts.stream().map(Post::getId).toList();
        Map<Long, Long> reactionCounts = reactionRepository.countReactionsByPostIds(postIds).stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).longValue(),
                        row -> ((Number) row[1]).longValue()));

        List<String> fileIds = posts.stream()
                .map(Post::getFileId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        Map<String, FileMetaDTO> filesByFileId = fileIds.isEmpty()
                ? Map.of()
                : fileRepository.findMetaByIds(fileIds).stream()
                        .collect(Collectors.toMap(FileMetaDTO::getId, Function.identity()));

        return assemble(posts, reactionCounts, filesByFileId);
    }

    private Set<Long> collectUserIds(List<Post> posts) {
        Set<Long> ids = new HashSet<>();
        for (Post post : posts) {
            if (post.getUserId() != null) ids.add(post.getUserId());
            post.getComments().forEach(c -> {
                if (c.getUser() != null && c.getUser().getId() != null) {
                    ids.add(c.getUser().getId());
                }
            });
        }
        return ids;
    }

    private Map<Long, FeedAuthorDTO> loadAuthors(Collection<Long> userIds) {
        if (userIds.isEmpty()) return Map.of();

        Map<Long, FeedAuthorDTO> authors = userRepository.findFeedAuthorsByIds(userIds).stream()
                .collect(Collectors.toMap(FeedAuthorDTO::getId, Function.identity(), (a, b) -> a));

        fileRepository.findProfilePictureFileIdsByUserIds(userIds).forEach(row -> {
            Long userId = ((Number) row[0]).longValue();
            String fileId = (String) row[1];
            FeedAuthorDTO author = authors.get(userId);
            if (author != null && fileId != null) {
                author.setProfilePictureUrl(fileUrlBuilder.build(fileId));
            }
        });

        return authors;
    }

    private PostResourceDetailed toResource(Post post,
                                            Map<Long, Long> reactionCountsByPostId,
                                            Map<String, FileMetaDTO> filesByFileId,
                                            Map<Long, FeedAuthorDTO> authorsById) {
        PostResourceDetailed resource = new PostResourceDetailed();
        resource.setId(post.getId());
        resource.setContent(post.getContent());
        resource.setCreatedAt(post.getCreatedAt());
        resource.setUserId(post.getUserId());
        resource.setReactionCount(reactionCountsByPostId.getOrDefault(post.getId(), 0L));
        resource.setAuthor(authorsById.get(post.getUserId()));

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
                .map(comment -> {
                    CommentResource cr = commentMapper.mapToCommentResource(comment);
                    cr.setAuthor(authorsById.get(cr.getUserId()));
                    return cr;
                })
                .filter(Objects::nonNull)
                .sorted(Comparator.comparing(CommentResource::getCreatedAt).reversed())
                .toList();
        resource.setComments(commentResources);

        return resource;
    }

}
