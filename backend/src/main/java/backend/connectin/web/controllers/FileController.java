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

import java.util.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
public class FileController {

    private final FileService fileService;
    private final Map<String, FileDB> tempStorage = new HashMap<>();

    public FileController(FileService fileService) {
        this.fileService = fileService;
    }

    @PostMapping("/pre-upload")
    public ResponseEntity<Map<String, String>> preStageUpload(@RequestParam("file") MultipartFile file) {
        try {
            // Generate a unique ID for the temporary file
            String tempId = UUID.randomUUID().toString();

            // Create a temporary FileDB object (without associating it with a user)
            FileDB tempFile = new FileDB(null, file.getBytes(), file.getContentType(), file.getOriginalFilename());

            // Store the file in the temporary storage with the generated ID
            tempStorage.put(tempId, tempFile);

            // Return the temp ID and original file name to the frontend
            Map<String, String> response = new HashMap<>();
            response.put("tempId", tempId);
            response.put("fileName", file.getOriginalFilename());

            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.EXPECTATION_FAILED);
        }
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadFile(@RequestParam("file") MultipartFile file,
                                        @RequestParam("isProfilePicture") String isProfilePicture,
                                        @RequestParam("userId") Long userId) {
        String message = "";
        try {
            Boolean flag = Boolean.parseBoolean(isProfilePicture);
            fileService.store(file, flag, userId);
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

    @GetMapping("/files/user/{userId}/images")
    public ResponseEntity<List<Map<String, String>>> getUserImages(@PathVariable Long userId) {
        List<Map<String, String>> images = fileService.getAllFiles()
                .filter(file -> file.getUser().getId().equals(userId) && file.getType().startsWith("image/"))
                // Sort images: Profile picture comes first (isProfilePicture == true)
                .sorted((file1, file2) -> Boolean.compare(file2.getProfilePicture(), file1.getProfilePicture()))
                // Map to the required format
                .map(file -> Map.of(
                        "type", file.getType(),
                        "data", Base64.getEncoder().encodeToString(file.getData())
                ))
                .toList();

        return ResponseEntity.ok(images);
    }

    @DeleteMapping("/files/{id}")
    public ResponseEntity<String> deleteFileById(@PathVariable String id) {
        String message = "";
        message = fileService.deleteFileById(id);
        return ResponseEntity.status(HttpStatus.OK).body(message);
    }

}
