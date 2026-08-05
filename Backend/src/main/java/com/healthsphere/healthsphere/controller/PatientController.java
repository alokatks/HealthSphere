package com.healthsphere.healthsphere.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
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

import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.model.PatientDocument;
import com.healthsphere.healthsphere.repository.PatientDocumentRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.service.FileStorageService;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private static final java.util.Set<String> ALLOWED_CONTENT_TYPES = java.util.Set.of(
            "application/pdf", "image/png", "image/jpeg");

    @Autowired
    private FileStorageService fileStorageService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private PatientDocumentRepository patientDocumentRepository;

    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/upload-report")
    public ResponseEntity<PatientDocument> uploadLabReport(@RequestParam("file") MultipartFile file, @AuthenticationPrincipal UserDetails userDetails) {
        if (file.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        if (!ALLOWED_CONTENT_TYPES.contains(file.getContentType())) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            Patient patient = patientRepository.findByUser_Email(userDetails.getUsername())
                    .orElseThrow(() -> new IllegalArgumentException("Patient not found."));

            String storedFilename = fileStorageService.storeFileAndGetFilename(file);

            PatientDocument document = new PatientDocument();
            document.setPatient(patient);
            document.setOriginalFilename(file.getOriginalFilename());
            document.setStoredFilename(storedFilename);
            document.setUploadedAt(LocalDateTime.now());
            PatientDocument saved = patientDocumentRepository.save(document);

            return new ResponseEntity<>(saved, HttpStatus.OK);
        } catch (RuntimeException e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/reports/{patientId}")
    public ResponseEntity<List<PatientDocument>> getMyReports(@PathVariable Long patientId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isPresent() && userDetails.getUsername().equals(patientOpt.get().getUser().getEmail())) {
            return new ResponseEntity<>(patientDocumentRepository.findByPatient(patientOpt.get()), HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Patient can only view their own reports
    }
}