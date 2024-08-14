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

@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RestController
@RequestMapping("/auth")
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
    public ResponseEntity<String> uploadFile(
            @RequestParam("preUploadId") String preUploadId,
            @RequestParam("isProfilePicture") Boolean isProfilePicture,
            @RequestParam("userEmail") String userEmail) {
        String message = "";
        try {
            // Retrieve the pre-uploaded file from temp storage
            FileDB preUploadedFile = tempStorage.get(preUploadId);
            if (preUploadedFile == null) {
                return new ResponseEntity<>("Pre-uploaded file not found!", HttpStatus.BAD_REQUEST);
            }

            // Store the file permanently
            FileDB fileToSave = new FileDB(preUploadedFile.getName(), preUploadedFile.getType(), preUploadedFile.getData(), isProfilePicture, userEmail);
            fileService.save(fileToSave);

            // Remove the file from temporary storage
            tempStorage.remove(preUploadId);

            message = "Uploaded the file successfully: " + preUploadedFile.getName();
            return new ResponseEntity<>(message, HttpStatus.OK);
        } catch (Exception e) {
            message = "Could not upload the file!";
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
