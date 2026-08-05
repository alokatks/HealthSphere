package com.healthsphere.healthsphere.dto;

import lombok.Data;

@Data
public class PrescriptionDto {
    private Long patientId;
    private Long doctorId;
    private String medication;
    private String dosage;
    private String instructions;
}