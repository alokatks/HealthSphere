package com.healthsphere.healthsphere.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class EHRDto {
    private Long patientId;
    private Long doctorId;
    private LocalDate visitDate;
    private String diagnosis;
    private String medications;
    private String labResults;
    private String notes;
}