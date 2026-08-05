package com.healthsphere.healthsphere.dto;

import java.time.LocalDate;

import lombok.Data;

// Only editable Patient fields — id and the linked User are never
// updated through this DTO.
@Data
public class PatientUpdateDto {
    private String fullName;
    private String phoneNumber;
    private LocalDate dateOfBirth;
    private String gender;
    private String address;
    private String emergencyContact;
}
