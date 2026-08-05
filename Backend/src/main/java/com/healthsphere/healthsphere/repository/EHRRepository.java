package com.healthsphere.healthsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.EHR;
import com.healthsphere.healthsphere.model.Patient;

public interface EHRRepository extends JpaRepository<EHR, Long> {
    List<EHR> findByPatient(Patient patient);
    List<EHR> findByDoctor(Doctor doctor);
}