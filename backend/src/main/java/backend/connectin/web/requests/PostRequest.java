package backend.connectin.web.requests;

import org.springframework.web.multipart.MultipartFile;

public class PostRequest {

    private String content;
    private MultipartFile file;

    public PostRequest(String content, MultipartFile file) {
        this.file = file;
        this.content = content;
    }

    public PostRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public MultipartFile getFile() {
        return file;
    }

    public void setFile(MultipartFile file) {
        this.file = file;
    }
}
