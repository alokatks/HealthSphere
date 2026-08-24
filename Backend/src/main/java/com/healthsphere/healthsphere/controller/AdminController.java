package com.healthsphere.healthsphere.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.healthsphere.dto.PatientUpdateDto;
import com.healthsphere.healthsphere.dto.StatusUpdateDto;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.model.SecurityLog;
import com.healthsphere.healthsphere.model.User;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.repository.SecurityLogRepository;
import com.healthsphere.healthsphere.repository.UserRepository;
import com.healthsphere.healthsphere.service.AuthService;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private AuthService authService;

    @Autowired
    private SecurityLogRepository securityLogRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private UserRepository userRepository;

    @PostMapping("/doctors/verify/{id}")
    public ResponseEntity<Doctor> verifyDoctor(@PathVariable Long id) {
        try {
            Doctor verifiedDoctor = authService.verifyDoctor(id);
            return new ResponseEntity<>(verifiedDoctor, HttpStatus.OK);
        } catch (IllegalArgumentException e) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/users/patients")
    public ResponseEntity<List<Patient>> getAllPatients() {
        List<Patient> patients = patientRepository.findAll();
        return new ResponseEntity<>(patients, HttpStatus.OK);
    }

    @GetMapping("/patients/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        return patientRepository.findById(id)
                .map(patient -> new ResponseEntity<>(patient, HttpStatus.OK))
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @PutMapping("/patients/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id,
                                                  @RequestBody PatientUpdateDto updateDto) {
        return patientRepository.findById(id)
                .map(patient -> {
                    patient.setFullName(updateDto.getFullName());
                    patient.setPhoneNumber(updateDto.getPhoneNumber());
                    patient.setDateOfBirth(updateDto.getDateOfBirth());
                    patient.setGender(updateDto.getGender());
                    patient.setAddress(updateDto.getAddress());
                    patient.setEmergencyContact(updateDto.getEmergencyContact());
                    Patient saved = patientRepository.save(patient);
                    return new ResponseEntity<>(saved, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    // Soft delete: deactivates the linked User account rather than removing
    // the patient record, since medical history needs to be retained.
    @PatchMapping("/patients/{id}/status")
    public ResponseEntity<Patient> updatePatientStatus(@PathVariable Long id,
                                                        @RequestBody StatusUpdateDto statusDto) {
        return patientRepository.findById(id)
                .map(patient -> {
                    User user = patient.getUser();
                    user.setActive(statusDto.getActive());
                    userRepository.save(user);
                    return new ResponseEntity<>(patient, HttpStatus.OK);
                })
                .orElseGet(() -> new ResponseEntity<>(HttpStatus.NOT_FOUND));
    }

    @GetMapping("/users/doctors")
    public ResponseEntity<List<Doctor>> getAllDoctors() {
        List<Doctor> doctors = doctorRepository.findAll();
        return new ResponseEntity<>(doctors, HttpStatus.OK);
    }

    @GetMapping("/logs")
    public ResponseEntity<List<SecurityLog>> getSecurityLogs() {
        List<SecurityLog> logs = securityLogRepository.findAll();
        return new ResponseEntity<>(logs, HttpStatus.OK);
    }
}
