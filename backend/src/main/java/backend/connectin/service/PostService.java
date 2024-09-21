package backend.connectin.service;

import backend.connectin.domain.*;
import backend.connectin.domain.repository.ConnectionRepository;
import backend.connectin.domain.repository.PostRepository;
import backend.connectin.domain.repository.PostViewRepository;
import backend.connectin.domain.repository.ReactionRepository;
import backend.connectin.web.mappers.PostMapper;
import backend.connectin.web.requests.PostRequest;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.time.Instant;
import java.util.*;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final FileService fileService;
    private final PostMapper postMapper;
    private final UserService userService;
    private final ConnectionService connectionService;
    private final ReactionRepository reactionRepository;
    private final PostViewRepository postViewRepository;

    public PostService(PostRepository postRepository, FileService fileService,
                       PostMapper postMapper, UserService userService,
                       ConnectionService connectionService, ReactionRepository reactionRepository, PostViewRepository postViewRepository) {
        this.postRepository = postRepository;
        this.fileService = fileService;
        this.postMapper = postMapper;
        this.userService = userService;
        this.connectionService = connectionService;
        this.reactionRepository = reactionRepository;
        this.postViewRepository = postViewRepository;
    }


    public Post findPostOrThrow(Long postId) {
        return postRepository.findById(postId).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
    }


    @Transactional
    public void createPost(Long userId, PostRequest postRequest) {
        try {
            Post post;
            if (postRequest.getFile() != null) {
                MultipartFile postFile = postRequest.getFile();
                FileDB fileDB = fileService.store(postFile, false, userId);
                post = postMapper.mapToPost(postRequest, fileDB.getId(), userId);
            } else {
                post = postMapper.mapToPost(postRequest, userId);
            }
            if (post != null)
                postRepository.save(post);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Post> fetchFeed(Long userId) {
        // first find the connection Ids
        List<Long> connectionIds = new ArrayList<>(connectionService.getConnectedUserIds(userId));
        // find the posts which the connections reacted to
        List<Long> postIdsFromReactions = reactionRepository.findPostIdsByUserIds(connectionIds);
        // find the posts with the postsIds fetched before
        List<Post> postsFromReactions= postRepository.findPostsByIdIn(postIdsFromReactions);

        connectionIds.add(userId);
        connectionIds = new ArrayList<>(new HashSet<>(connectionIds));
        Set<Post> userPostsSet = postRepository.findAllByUserIdIn(connectionIds);
        userPostsSet.addAll(postsFromReactions);
        return new ArrayList<>(userPostsSet);

    }

    public List<Post> fetchAll() {
        return postRepository.findAll();
    }
    public List<Post> fetchUserPosts(Long userId){return postRepository.findAllByUserId(userId);}

    public void deletePost(Long userId, Long postId) {
        User user = userService.findUserOrThrow(userId);
        Post post = findPostOrThrow(postId);
        postRepository.delete(post);
    }

    public PostView addViewToAPost(long userId, Long postId){
        userService.findUserOrThrow(userId);
        Optional<Post> post = postRepository.findById(postId);
        if(post.isEmpty()){
            throw new RuntimeException("Post not found");
        }
        if(postViewRepository.findPostViewByUserIdAndJobId(userId,postId).isPresent()){
            return null;
        };
        PostView postView = new PostView();
        postView.setUserId(userId);
        postView.setPostId(post.get().getId());
        postView.setViewedAt(Instant.now());
        postViewRepository.save(postView);
        return postView;
    }



}

