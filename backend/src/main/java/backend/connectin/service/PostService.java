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

@Service
public class PostService {

    private final PostRepository postRepository;
    private final FileService fileService;
    private PostMapper postMapper;

    public PostService(PostRepository postRepository, FileService fileService) {
        this.postRepository = postRepository;
        this.fileService = fileService;
    }

    @Transactional
    public void createPost(Long userId, PostRequest postRequest) {
        try {
            MultipartFile postFile = postRequest.getFile();
            FileDB fileDB = fileService.store(postFile, false, userId);
            Post post = postMapper.mapToPost(postRequest, fileDB);
            postRepository.save(post);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}

