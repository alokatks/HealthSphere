package com.healthsphere.healthsphere.dto;

import java.time.LocalDate;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class UserRegistrationDto {
    @NotBlank
    @Email
    private String email;

    @NotBlank
    @Size(min = 8, message = "Password must be at least 8 characters")
    private String password;

    @NotBlank
    private String role;

    @NotBlank
    private String fullName;
    private String specialization;
    private String licenseNumber;
    private Integer yearsOfExperience;
    private String clinicName;
    private String phoneNumber; 
    private LocalDate dateOfBirth; 
    private String gender; 
    private String address; 
    private String emergencyContact;
}