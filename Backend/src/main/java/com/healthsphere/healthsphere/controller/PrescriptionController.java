package com.healthsphere.healthsphere.controller;

import com.healthsphere.healthsphere.dto.PrescriptionDto;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.model.Prescription;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.service.PrescriptionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/prescriptions")
public class PrescriptionController {

    @Autowired
    private PrescriptionService prescriptionService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @PreAuthorize("hasRole('DOCTOR')")
    @PostMapping("/create")
    public ResponseEntity<Prescription> createPrescription(@RequestBody PrescriptionDto prescriptionDto) {
        Prescription newPrescription = prescriptionService.createPrescription(prescriptionDto);
        return new ResponseEntity<>(newPrescription, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByPatient(@PathVariable Long patientId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isPresent() && userDetails.getUsername().equals(patientOpt.get().getUser().getEmail())) {
            List<Prescription> prescriptions = prescriptionService.getPrescriptionsByPatientId(patientId);
            return new ResponseEntity<>(prescriptions, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Patient can only view their own prescriptions
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Prescription>> getPrescriptionsByDoctor(@PathVariable Long doctorId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isPresent() && userDetails.getUsername().equals(doctorOpt.get().getUser().getEmail())) {
            List<Prescription> prescriptions = prescriptionService.getPrescriptionsByDoctorId(doctorId);
            return new ResponseEntity<>(prescriptions, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Doctor can only view prescriptions they wrote
    }
}