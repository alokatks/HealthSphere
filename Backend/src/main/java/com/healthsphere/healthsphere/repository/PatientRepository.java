package com.healthsphere.healthsphere.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthsphere.healthsphere.model.Patient;

public interface PatientRepository extends JpaRepository<Patient, Long> {
    // Spring Data JPA automatically provides methods like save(), findById(), etc.
    Optional<Patient> findByUser_Email(String email);
}