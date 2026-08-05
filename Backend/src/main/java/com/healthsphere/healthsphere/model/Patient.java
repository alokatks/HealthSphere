package com.healthsphere.healthsphere.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapsId;
import jakarta.persistence.OneToOne;
import lombok.Data;

@Data
@Entity
public class Patient {
    @Id
    private Long id;

    @OneToOne
    @MapsId
     @JoinColumn(name = "id")
    private User user;

    private String fullName;
    private String phoneNumber; 
    private LocalDate dateOfBirth; 
    private String gender; 
    private String address; 
    private String emergencyContact; 
}