package com.healthsphere.healthsphere.dto;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class AppointmentDto {
    private Long patientId;
    private Long doctorId;
    private LocalDateTime appointmentTime;
    private String status;

    // "IN_PERSON" or "TELEHEALTH", set by the patient at booking time.
    // Defaults to "IN_PERSON" if omitted.
    private String mode;
}