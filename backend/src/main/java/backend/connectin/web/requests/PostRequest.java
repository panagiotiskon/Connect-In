package backend.connectin.web.requests;

import org.springframework.web.multipart.MultipartFile;

public class PostRequest {

    private String content;
    private MultipartFile file;

    public PostRequest(String content, MultipartFile file) {}

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
