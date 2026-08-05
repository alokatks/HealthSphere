package com.healthsphere.healthsphere.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthsphere.healthsphere.dto.AppointmentDto;
import com.healthsphere.healthsphere.model.Appointment;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.repository.AppointmentRepository;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;

@Service
public class AppointmentService {

    private static final String STATUS_CANCELED = "CANCELED";
    private static final String MODE_IN_PERSON = "IN_PERSON";
    private static final String MODE_TELEHEALTH = "TELEHEALTH";

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public Appointment bookAppointment(AppointmentDto appointmentDto) {
        Optional<Patient> patientOpt = patientRepository.findById(appointmentDto.getPatientId());
        Optional<Doctor> doctorOpt = doctorRepository.findById(appointmentDto.getDoctorId());

        if (patientOpt.isEmpty() || doctorOpt.isEmpty()) {
            throw new IllegalArgumentException("Patient or Doctor not found.");
        }

        LocalDateTime appointmentTime = appointmentDto.getAppointmentTime();
        if (appointmentTime == null || !appointmentTime.isAfter(LocalDateTime.now())) {
            throw new IllegalStateException("Appointment time must be in the future.");
        }

        Doctor doctor = doctorOpt.get();
        Patient patient = patientOpt.get();

        if (appointmentRepository.existsByDoctorAndAppointmentTimeAndStatusNot(
                doctor, appointmentTime, STATUS_CANCELED)) {
            throw new IllegalStateException(
                    "This doctor already has an appointment at that time. Please choose a different time.");
        }

        if (appointmentRepository.existsByPatientAndAppointmentTimeAndStatusNot(
                patient, appointmentTime, STATUS_CANCELED)) {
            throw new IllegalStateException(
                    "You already have an appointment booked at that time.");
        }

        String mode = appointmentDto.getMode();
        if (mode == null || mode.isBlank()) {
            mode = MODE_IN_PERSON;
        } else if (!mode.equals(MODE_IN_PERSON) && !mode.equals(MODE_TELEHEALTH)) {
            throw new IllegalStateException("Mode must be either IN_PERSON or TELEHEALTH.");
        }

        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentTime(appointmentTime);
        appointment.setStatus("PENDING"); // Default status is pending
        appointment.setMode(mode);
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAppointmentsByPatientId(Long patientId) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isPresent()) {
            return appointmentRepository.findByPatient(patientOpt.get());
        }
        throw new IllegalArgumentException("Patient not found.");
    }

    public List<Appointment> getAppointmentsByDoctorId(Long doctorId) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isPresent()) {
            return appointmentRepository.findByDoctor(doctorOpt.get());
        }
        throw new IllegalArgumentException("Doctor not found.");
    }

    public Appointment cancelAppointment(Long appointmentId) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isPresent()) {
            Appointment appointment = appointmentOpt.get();
            appointment.setStatus(STATUS_CANCELED);
            return appointmentRepository.save(appointment);
        }
        throw new IllegalArgumentException("Appointment not found.");
    }

    // Ownership (requester must be the doctor on this appointment) is
    // verified by the controller before this is called, same pattern as
    // cancelAppointment's authorization check.
    public Appointment setTelehealthLink(Long appointmentId, String telehealthLink) {
        Optional<Appointment> appointmentOpt = appointmentRepository.findById(appointmentId);
        if (appointmentOpt.isEmpty()) {
            throw new IllegalArgumentException("Appointment not found.");
        }

        Appointment appointment = appointmentOpt.get();

        if (!MODE_TELEHEALTH.equals(appointment.getMode())) {
            throw new IllegalStateException(
                    "A meeting link can only be added to a telehealth appointment.");
        }

        if (STATUS_CANCELED.equals(appointment.getStatus())) {
            throw new IllegalStateException("Cannot add a link to a canceled appointment.");
        }

        if (telehealthLink == null || telehealthLink.isBlank()) {
            throw new IllegalStateException("Meeting link cannot be empty.");
        }

        appointment.setTelehealthLink(telehealthLink.trim());
        return appointmentRepository.save(appointment);
    }
}