package com.healthsphere.healthsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthsphere.healthsphere.model.SecurityLog;

public interface SecurityLogRepository extends JpaRepository<SecurityLog, Long> {
}