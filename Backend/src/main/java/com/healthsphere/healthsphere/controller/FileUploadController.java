package com.healthsphere.healthsphere.controller;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.service.FileStorageService;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private static final java.util.Set<String> ALLOWED_CONTENT_TYPES = java.util.Set.of(
            "application/pdf", "image/png", "image/jpeg");

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private DoctorRepository doctorRepository;

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/upload-certificate/{doctorId}")
    public ResponseEntity<Doctor> uploadCertificate(@PathVariable Long doctorId, @RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails) {
        if (file.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isEmpty() || !userDetails.getUsername().equals(doctorOpt.get().getUser().getEmail())) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Doctor can only upload their own certificate
        }
        try {
            String storedFilename = fileStorageService.storeFileAndGetFilename(file);
            Doctor doctor = doctorOpt.get();
            doctor.setCertificateFilePath(storedFilename);
            Doctor saved = doctorRepository.save(doctor);
            return new ResponseEntity<>(saved, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping("/download/{filename}")
    public ResponseEntity<Resource> downloadFile(@PathVariable String filename) {
        try {
            Resource resource = fileStorageService.loadFileAsResource(filename);
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + resource.getFilename() + "\"")
                    .body(resource);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
}   