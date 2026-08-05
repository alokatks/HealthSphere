package com.healthsphere.healthsphere.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class ProfileUpdateDto {
    private String fullName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String emergencyContact;
    private String specialization;
    private String clinicName;
    private String licenseNumber;
    private Integer yearsOfExperience;
}