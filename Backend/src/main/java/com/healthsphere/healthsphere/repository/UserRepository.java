package com.healthsphere.healthsphere.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.healthsphere.healthsphere.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    User findByEmail(String email);
}