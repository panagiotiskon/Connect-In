package backend.connectin.service;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.domain.User;
import backend.connectin.domain.repository.PostRepository;
import backend.connectin.web.mappers.PostMapper;
import backend.connectin.web.requests.PostRequest;
import jakarta.transaction.Status;
import jakarta.transaction.Transactional;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final FileService fileService;
    private final PostMapper postMapper;
    private final UserService userService;
    private final ConnectionService connectionService;

    public PostService(PostRepository postRepository, FileService fileService, PostMapper postMapper, UserService userService, ConnectionService connectionService) {
        this.postRepository = postRepository;
        this.fileService = fileService;
        this.postMapper = postMapper;
        this.userService = userService;
        this.connectionService = connectionService;
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

    public List<Post> fetchUserPosts(Long userId) {

        List<Long> connectionIds = new ArrayList<>(connectionService.getConnectedUserIds(userId));
        connectionIds.add(userId);
        Set<Post> userPostsSet = postRepository.findAllByUserIdIn(connectionIds);
        return userPostsSet.stream().toList();
    }

    public List<Post> fetchAll() {
        return postRepository.findAll();
    }

    public void deletePost(Long userId, Long postId) {
        User user = userService.findUserOrThrow(userId);
        Post post = findPostOrThrow(postId);
        postRepository.delete(post);
    }


}

