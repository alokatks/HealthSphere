package com.healthsphere.healthsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.model.Prescription;

public interface PrescriptionRepository extends JpaRepository<Prescription, Long> {
    List<Prescription> findByPatient(Patient patient);
    List<Prescription> findByDoctor(Doctor doctor);
}