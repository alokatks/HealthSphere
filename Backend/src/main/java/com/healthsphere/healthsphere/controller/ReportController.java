package com.healthsphere.healthsphere.controller;

import java.util.HashMap;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.healthsphere.repository.AppointmentRepository;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;

@RestController
@RequestMapping("/api/reports")
@PreAuthorize("hasRole('ADMIN')")
public class ReportController {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping("/dashboard-stats")
    public ResponseEntity<Map<String, Long>> getDashboardStats() {
        long totalAppointments = appointmentRepository.count();
        long totalPatients = patientRepository.count();
        long totalDoctors = doctorRepository.count();
        
        Map<String, Long> stats = new HashMap<>();
        stats.put("totalAppointments", totalAppointments);
        stats.put("totalPatients", totalPatients);
        stats.put("totalDoctors", totalDoctors);
        
        return new ResponseEntity<>(stats, HttpStatus.OK);
    }
}