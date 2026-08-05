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
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.healthsphere.healthsphere.dto.AppointmentDto;
import com.healthsphere.healthsphere.dto.TelehealthLinkDto;
import com.healthsphere.healthsphere.model.Appointment;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.repository.AppointmentRepository;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.service.AppointmentService;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentService appointmentService;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @PreAuthorize("hasRole('PATIENT')")
    @PostMapping("/book")
    public ResponseEntity<Appointment> bookAppointment(@RequestBody AppointmentDto appointmentDto) {
        Appointment newAppointment = appointmentService.bookAppointment(appointmentDto);
        return new ResponseEntity<>(newAppointment, HttpStatus.CREATED);
    }

    @PreAuthorize("hasRole('PATIENT')")
    @GetMapping("/patient/{patientId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByPatient(@PathVariable Long patientId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isPresent() && userDetails.getUsername().equals(patientOpt.get().getUser().getEmail())) {
            List<Appointment> appointments = appointmentService.getAppointmentsByPatientId(patientId);
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Patient can only view their own appointments
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @GetMapping("/doctor/{doctorId}")
    public ResponseEntity<List<Appointment>> getAppointmentsByDoctor(@PathVariable Long doctorId, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isPresent() && userDetails.getUsername().equals(doctorOpt.get().getUser().getEmail())) {
            List<Appointment> appointments = appointmentService.getAppointmentsByDoctorId(doctorId);
            return new ResponseEntity<>(appointments, HttpStatus.OK);
        }
        return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Doctor can only view their own appointments
    }

    @PreAuthorize("hasAnyRole('PATIENT', 'DOCTOR')")
    @PutMapping("/{id}/cancel")
    public ResponseEntity<Appointment> cancelAppointment(@PathVariable Long id, @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        Appointment appointment = appointmentOpt.get();
        String patientEmail = appointment.getPatient().getUser().getEmail();
        String doctorEmail = appointment.getDoctor().getUser().getEmail();
        String requester = userDetails.getUsername();

        if (!requester.equals(patientEmail) && !requester.equals(doctorEmail)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only the patient or doctor on this appointment may cancel it
        }

        Appointment cancelled = appointmentService.cancelAppointment(id);
        return new ResponseEntity<>(cancelled, HttpStatus.OK);
    }

    @PreAuthorize("hasRole('DOCTOR')")
    @PutMapping("/{id}/telehealth-link")
    public ResponseEntity<Appointment> setTelehealthLink(
            @PathVariable Long id,
            @RequestBody TelehealthLinkDto telehealthLinkDto,
            @AuthenticationPrincipal UserDetails userDetails) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(id);
        if (appointmentOpt.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        String doctorEmail = appointmentOpt.get().getDoctor().getUser().getEmail();
        if (!userDetails.getUsername().equals(doctorEmail)) {
            return new ResponseEntity<>(HttpStatus.FORBIDDEN); // Only the doctor on this appointment may add a link
        }

        Appointment updated =
                appointmentService.setTelehealthLink(id, telehealthLinkDto.getTelehealthLink());
        return new ResponseEntity<>(updated, HttpStatus.OK);
    }
}