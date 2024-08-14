package backend.connectin.web.controllers;

import backend.connectin.domain.FileDB;
import backend.connectin.service.FileService;
import backend.connectin.web.resources.FileResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.List;
import java.util.NoSuchElementException;

@CrossOrigin("*")
@RestController
@RequestMapping("/auth")
public class FileController {

    private final FileService fileService;

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file) {
        String message = "";
        try {
            fileService.store(file);
            message = "Uploaded the file successfully: " + file.getOriginalFilename();
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (Exception e) {
            message = "Could not upload the file: " + file.getOriginalFilename() + "!";
            return new ResponseEntity<>(message, HttpStatus.EXPECTATION_FAILED);
        }
    }

    @GetMapping("/files")
    public ResponseEntity<List<?>> getListFiles() {
        List<FileResource> files = fileService.getAllFiles().map(dbFile -> {
            String fileDownloadUri = ServletUriComponentsBuilder.fromCurrentContextPath().path("/files/")
                    .path(dbFile.getId()).toUriString();

            return new FileResource(dbFile.getName(), fileDownloadUri, dbFile.getType(), dbFile.getData().length);
        }).toList();

        return ResponseEntity.status(HttpStatus.OK).body(files);
    }

    @GetMapping("/files/{id}")
    public ResponseEntity<Object> getFile(@PathVariable String id) {

        try {
            FileDB fileDB = fileService.getFile(id);

            // Response type: byte[]
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileDB.getName() + "\"")
                    .body(fileDB.getData());
        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.EXPECTATION_FAILED).body(e.getMessage());
        }
    }

    @DeleteMapping("/files/{id}")
    public ResponseEntity<String> deleteFileById(@PathVariable String id) {
        String message = "";
        message = fileService.deleteFileById(id);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

}
