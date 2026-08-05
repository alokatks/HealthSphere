package com.healthsphere.healthsphere.model;

import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Data
@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    // WRITE_ONLY: still accepted on the way in (registration, password reset)
    // but never included when this entity (or Patient/Doctor, which embed it)
    // is serialized back out to a JSON response.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    @Column(nullable = false)
    private String password; // Will be stored as a hashed string

    @Column(nullable = false)
    private String role; // "PATIENT", "DOCTOR", or "ADMIN"

    private String status; // For doctor verification: "PENDING" or "VERIFIED"

    // Soft-delete flag, used instead of hard-deleting a user record.
    // Health records typically need to be retained even when an account
    // is no longer in active use, so admins deactivate rather than delete.
    @Column(nullable = false)
    private Boolean active = true;
}