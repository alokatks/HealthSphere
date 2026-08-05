package com.healthsphere.healthsphere.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthsphere.healthsphere.model.Doctor;

public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    List<Doctor> findByUser_Status(String status);
}