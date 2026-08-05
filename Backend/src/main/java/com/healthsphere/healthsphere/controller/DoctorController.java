package com.healthsphere.healthsphere.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.repository.DoctorRepository;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorRepository doctorRepository;

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping
    public ResponseEntity<List<Doctor>> getVerifiedDoctors() {
        return new ResponseEntity<>(doctorRepository.findByUser_Status("VERIFIED"), HttpStatus.OK);
    }
}
