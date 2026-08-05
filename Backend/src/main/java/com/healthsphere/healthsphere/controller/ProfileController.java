package com.healthsphere.healthsphere.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.healthsphere.dto.ProfileUpdateDto;
import com.healthsphere.healthsphere.model.User;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.repository.UserRepository;
import com.healthsphere.healthsphere.service.AuthService;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private final AuthService authService;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final UserRepository userRepository; // Added UserRepository

    public ProfileController(AuthService authService, PatientRepository patientRepository, DoctorRepository doctorRepository, UserRepository userRepository) {
        this.authService = authService;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.userRepository = userRepository; // Added
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping
    public ResponseEntity<Object> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        try {
            User user = userRepository.findByEmail(userDetails.getUsername());
            if (user == null) {
                return new ResponseEntity<>("User not found.", HttpStatus.NOT_FOUND);
            }
            
            if ("PATIENT".equals(user.getRole())) {
                return patientRepository.findById(user.getId())
                                        .map(patient -> new ResponseEntity<Object>(patient, HttpStatus.OK))
                                        .orElse(new ResponseEntity<>("Patient profile not found.", HttpStatus.NOT_FOUND));
            } else if ("DOCTOR".equals(user.getRole())) {
                return doctorRepository.findById(user.getId())
                                       .map(doctor -> new ResponseEntity<Object>(doctor, HttpStatus.OK))
                                       .orElse(new ResponseEntity<>("Doctor profile not found.", HttpStatus.NOT_FOUND));
            }
            
            return new ResponseEntity<>(user, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping("/update")
    public ResponseEntity<Object> updateProfile(@AuthenticationPrincipal UserDetails userDetails, @RequestBody ProfileUpdateDto profileDto) {
        try {
            Object updatedProfile = authService.updateUserProfile(userDetails.getUsername(), profileDto);
            return new ResponseEntity<>(updatedProfile, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(e.getMessage(), HttpStatus.NOT_FOUND);
        } catch (Exception e) {
             return new ResponseEntity<>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}