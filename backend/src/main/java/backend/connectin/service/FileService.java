package backend.connectin.service;

import backend.connectin.domain.FileDB;
import backend.connectin.domain.repository.FileDBRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.stream.Stream;

@Service
public class FileService {

    private final FileDBRepository fileDBRepository;

    public FileService(FileDBRepository fileDBRepository) {
        this.fileDBRepository = fileDBRepository;
    }

    public FileDB store(MultipartFile file) throws IOException {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        FileDB FileDB = new FileDB(fileName, file.getContentType(), file.getBytes());

        return fileDBRepository.save(FileDB);
    }

    public FileDB getFile(String id) {
        return fileDBRepository.findById(id).get();
    }

    public Stream<FileDB> getAllFiles() {
        return fileDBRepository.findAll().stream();
    }

    public String deleteFileById(String id) {
        if (fileDBRepository.existsById(id)) {
            fileDBRepository.deleteById(id);
            return "File has been successfully deleted";
        }
        return "File doesn't exist";
    }
}
