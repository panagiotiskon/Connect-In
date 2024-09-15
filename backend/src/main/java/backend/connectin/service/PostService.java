package backend.connectin.service;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.Post;
import backend.connectin.domain.repository.PostRepository;
import backend.connectin.web.mappers.PostMapper;
import backend.connectin.web.requests.PostRequest;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final FileService fileService;
    private final PostMapper postMapper;

    public PostService(PostRepository postRepository, FileService fileService, PostMapper postMapper) {
        this.postRepository = postRepository;
        this.fileService = fileService;
        this.postMapper = postMapper;
    }

    @Transactional
    public void createPost(Long userId, PostRequest postRequest) {
        try {
            Post post;
            if(postRequest.getFile()!=null) {
                MultipartFile postFile = postRequest.getFile();
                FileDB fileDB = fileService.store(postFile, false, userId);
                post = postMapper.mapToPost(postRequest,fileDB.getId(), userId);
            }
            else {
                post = postMapper.mapToPost(postRequest,userId);
            }
            if(post!=null)
                postRepository.save(post);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public List<Post> fetchUserPosts(Long userId) {
        List<Post> userPosts = postRepository.findAllByUserId(userId);
        return userPosts;
    }


}

