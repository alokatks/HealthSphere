package com.healthsphere.healthsphere.model;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Doctor {
    @Id
    private Long id;

    @OneToOne
    @MapsId
     @JoinColumn(name = "id")
    private User user;

    private String fullName;
    private String specialization;
    private String licenseNumber;
    private String certificateFilePath;
    private Integer yearsOfExperience;
    private String clinicName;
}