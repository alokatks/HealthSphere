package com.healthsphere.healthsphere.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileStorageService {

    private final String uploadDir = "uploads";

    public String storeFile(MultipartFile file) {
        Path filePath = writeToDisk(file);
        return filePath.toString();
    }

    /**
     * Same storage behavior as storeFile(), but returns only the generated
     * filename (not the full relative path), which is what's needed to build
     * a stable /api/files/download/{filename} URL for the frontend.
     */
    public String storeFileAndGetFilename(MultipartFile file) {
        Path filePath = writeToDisk(file);
        return filePath.getFileName().toString();
    }

    public Resource loadFileAsResource(String filename) {
        try {
            Path uploadPath = Paths.get(uploadDir).toAbsolutePath().normalize();
            Path filePath = uploadPath.resolve(filename).normalize();

            // Guard against path traversal (e.g. "../../etc/passwd")
            if (!filePath.startsWith(uploadPath)) {
                throw new RuntimeException("Invalid file path.");
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            }
            throw new RuntimeException("File not found: " + filename);
        } catch (Exception e) {
            throw new RuntimeException("Could not read file: " + filename, e);
        }
    }

    private Path writeToDisk(MultipartFile file) {
        // Create the directory if it doesn't exist
        Path uploadPath = Paths.get(uploadDir);
        try {
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }
        } catch (IOException e) {
            throw new RuntimeException("Could not create upload directory.", e);
        }

        // Generate a unique filename to prevent conflicts
        String originalFilename = file.getOriginalFilename();
        String extension = originalFilename != null && originalFilename.contains(".")
                ? originalFilename.substring(originalFilename.lastIndexOf("."))
                : "";
        String uniqueFilename = UUID.randomUUID().toString() + extension;
        Path filePath = uploadPath.resolve(uniqueFilename);

        try {
            Files.copy(file.getInputStream(), filePath);
            return filePath;
        } catch (IOException e) {
            throw new RuntimeException("Could not store the file.", e);
        }
    }
}