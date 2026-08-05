package com.healthsphere.healthsphere.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthsphere.healthsphere.model.Appointment;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.Patient;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByPatient(Patient patient);
    List<Appointment> findByDoctor(Doctor doctor);

    // Used to block double-booking: true if this doctor already has a
    // non-canceled appointment at the exact same time.
    boolean existsByDoctorAndAppointmentTimeAndStatusNot(
            Doctor doctor, LocalDateTime appointmentTime, String status);

    // Used to block a patient from holding two non-canceled appointments at
    // the exact same time (with any doctor).
    boolean existsByPatientAndAppointmentTimeAndStatusNot(
            Patient patient, LocalDateTime appointmentTime, String status);
}