package backend.connectin.service;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.domain.PostView;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.FileRepository;
import backend.connectin.domain.repository.PostRepository;
import backend.connectin.domain.repository.PostViewRepository;
import backend.connectin.domain.repository.ReactionRepository;
import backend.connectin.util.FeedAssembler;
import backend.connectin.web.dto.FeedPageDTO;
import backend.connectin.web.dto.FileMetaDTO;
import backend.connectin.web.mappers.PostMapper;
import backend.connectin.web.requests.PostRequest;
import backend.connectin.web.resources.PostResourceDetailed;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
public class PostService {

    private static final int DEFAULT_PAGE_SIZE = 20;
    private static final int MAX_PAGE_SIZE = 100;

    private final PostRepository postRepository;
    private final FileService fileService;
    private final PostMapper postMapper;
    private final UserService userService;
    private final ConnectionService connectionService;
    private final ReactionRepository reactionRepository;
    private final FileRepository fileRepository;
    private final PostViewRepository postViewRepository;
    private final FeedAssembler feedAssembler;

    public PostService(PostRepository postRepository, FileService fileService,
                       PostMapper postMapper, UserService userService,
                       ConnectionService connectionService, ReactionRepository reactionRepository,
                       FileRepository fileRepository,
                       PostViewRepository postViewRepository,
                       FeedAssembler feedAssembler) {

        this.postRepository = postRepository;
        this.fileService = fileService;
        this.postMapper = postMapper;
        this.userService = userService;
        this.connectionService = connectionService;
        this.reactionRepository = reactionRepository;
        this.postViewRepository = postViewRepository;
        this.fileRepository = fileRepository;
        this.feedAssembler = feedAssembler;
    }


    public Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }


    @Transactional
    public PostResourceDetailed createPost(Long userId, PostRequest postRequest) {
        try {
            Post post;
            if (postRequest.getFile() != null) {
                MultipartFile postFile = postRequest.getFile();
                FileDB fileDB = fileService.store(postFile, false, userId);
                post = postMapper.mapToPost(postRequest, fileDB.getId(), userId);
            } else {
                post = postMapper.mapToPost(postRequest, userId);
            }
            if (post == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid post");
            }
            Post saved = postRepository.save(post);
            return feedAssembler.assemble(List.of(saved)).get(0);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Post> fetchFeed(Long userId) {
        // first find the connection Ids
        List<Long> connectionIds = new ArrayList<>(connectionService.getConnectedUserIds(userId));

        // find the posts which the connections reacted to, guarding against empty IN clause
        List<Post> postsFromReactions = connectionIds.isEmpty()
                ? Collections.emptyList()
                : postRepository.findPostsByIdInWithComments(
                        reactionRepository.findPostIdsByUserIds(connectionIds));

        connectionIds.add(userId);
        connectionIds = new ArrayList<>(new HashSet<>(connectionIds));
        Set<Post> userPostsSet = postRepository.findAllByUserIdInWithComments(connectionIds);
        userPostsSet.addAll(postsFromReactions);
        return new ArrayList<>(userPostsSet);
    }

    public FeedPageDTO fetchFeedPage(Long userId, int page, Integer sizeParam) {
        int size = clampSize(sizeParam);
        int safePage = Math.max(page, 0);
        long offset = (long) safePage * size;

        Set<Long> connectionIds = new HashSet<>(connectionService.getConnectedUserIds(userId));
        Set<Long> authorIds = new HashSet<>(connectionIds);
        authorIds.add(userId);

        long total;
        List<Long> pageIds;
        if (connectionIds.isEmpty()) {
            total = postRepository.countFeedPostsAuthors(authorIds);
            pageIds = total == 0 || offset >= total
                    ? List.of()
                    : postRepository.findFeedIdsAuthorsPaged(authorIds, size, offset);
        } else {
            total = postRepository.countFeedPosts(authorIds, connectionIds);
            pageIds = total == 0 || offset >= total
                    ? List.of()
                    : postRepository.findFeedIdsPaged(authorIds, connectionIds, size, offset);
        }

        if (pageIds.isEmpty()) {
            return new FeedPageDTO(List.of(), safePage, size, total);
        }

        List<Post> fetched = postRepository.findPostsByIdInWithComments(pageIds);
        Map<Long, Post> byId = fetched.stream()
                .collect(Collectors.toMap(Post::getId, Function.identity(), (a, b) -> a));
        List<Post> orderedPosts = pageIds.stream()
                .map(byId::get)
                .filter(Objects::nonNull)
                .toList();

        Map<Long, Long> reactionCounts = reactionRepository.countReactionsByPostIds(pageIds).stream()
                .collect(Collectors.toMap(
                        row -> ((Number) row[0]).longValue(),
                        row -> ((Number) row[1]).longValue()));

        List<String> fileIds = orderedPosts.stream()
                .map(Post::getFileId)
                .filter(Objects::nonNull)
                .distinct()
                .toList();
        Map<String, FileMetaDTO> filesByFileId = fileIds.isEmpty()
                ? Map.of()
                : fileRepository.findMetaByIds(fileIds).stream()
                        .collect(Collectors.toMap(FileMetaDTO::getId, Function.identity()));

        List<PostResourceDetailed> items = feedAssembler.assemble(orderedPosts, reactionCounts, filesByFileId);
        return new FeedPageDTO(items, safePage, size, total);
    }

    private int clampSize(Integer size) {
        if (size == null || size <= 0) return DEFAULT_PAGE_SIZE;
        return Math.min(size, MAX_PAGE_SIZE);
    }

    public List<Post> fetchAll() {
        return postRepository.findAll();
    }

    public List<Post> fetchUserPosts(Long userId) {
        return postRepository.findAllByUserId(userId);
    }

    public void deletePost(Long userId, Long postId) {
        User user = userService.findUserOrThrow(userId);
        Post post = findPostOrThrow(postId);
        if (post.getFileId() != null) {
            fileRepository.deleteById(post.getFileId());
        }
        postRepository.delete(post);
    }

    public PostView addViewToAPost(long userId, Long postId) {
        userService.findUserOrThrow(userId);
        Optional<Post> post = postRepository.findById(postId);
        if (post.isEmpty()) {
            throw new RuntimeException("Post not found");
        }
        if (postViewRepository.findPostViewByUserIdAndJobId(userId, postId).isPresent()) {
            return null;
        }
        ;
        PostView postView = new PostView();
        postView.setUserId(userId);
        postView.setPostId(post.get().getId());
        postView.setViewedAt(Instant.now());
        postViewRepository.save(postView);
        return postView;
    }


}

