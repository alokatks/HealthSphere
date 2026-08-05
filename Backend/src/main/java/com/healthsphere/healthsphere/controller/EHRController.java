package com.healthsphere.healthsphere.controller;

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
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.healthsphere.dto.EHRDto;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.EHR;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.service.EHRService;

@RestController
@RequestMapping("/api/ehr")
public class EHRController {

    @Autowired
    private EHRService ehrService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/create")
    public ResponseEntity<EHR> createEHR(@RequestBody EHRDto ehrDto) {
        EHR newEHR = ehrService.createEHR(ehrDto);
        return new ResponseEntity<>(newEHR, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<EHR>> getEHRsByPatientId(@PathVariable Long patientId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isPresent() && userDetails.getUsername().equals(patientOpt.get().getUser().getEmail())) {
            List<EHR> ehrList = ehrService.getRecordsByPatientId(patientId);
            return new ResponseEntity<>(ehrList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Patient can only view their own records
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<EHR>> getEHRsByDoctorId(@PathVariable Long doctorId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isPresent() && userDetails.getUsername().equals(doctorOpt.get().getUser().getEmail())) {
            List<EHR> ehrList = ehrService.getRecordsByDoctorId(doctorId);
            return new ResponseEntity<>(ehrList, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Doctor can only view records they created
    }
}