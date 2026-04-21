package backend.connectin.util;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

@Component
public class FileUrlBuilder {

    private final String fileViewBaseUrl;

    public FileUrlBuilder(@Value("${app.file-view-base-url:/auth/files/view}") String fileViewBaseUrl) {
        this.fileViewBaseUrl = fileViewBaseUrl;
    }

    public String build(String fileId) {
        if (fileId == null) return null;
        return fileViewBaseUrl + "/" + fileId;
    }
}
