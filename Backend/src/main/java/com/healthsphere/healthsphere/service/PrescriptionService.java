package com.healthsphere.healthsphere.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthsphere.healthsphere.dto.PrescriptionDto;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.model.Prescription;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.repository.PrescriptionRepository;

@Service
public class PrescriptionService {

    @Autowired
    private PrescriptionRepository prescriptionRepository;

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    public Prescription createPrescription(PrescriptionDto prescriptionDto) {
        Optional<Patient> patientOpt = patientRepository.findById(prescriptionDto.getPatientId());
        Optional<Doctor> doctorOpt = doctorRepository.findById(prescriptionDto.getDoctorId());

        if (patientOpt.isPresent() && doctorOpt.isPresent()) {
            Prescription prescription = new Prescription();
            prescription.setPatient(patientOpt.get());
            prescription.setDoctor(doctorOpt.get());
            prescription.setMedication(prescriptionDto.getMedication());
            prescription.setDosage(prescriptionDto.getDosage());
            prescription.setInstructions(prescriptionDto.getInstructions());
            prescription.setPrescriptionDate(LocalDate.now());
            return prescriptionRepository.save(prescription);
        }
        throw new IllegalArgumentException("Patient or Doctor not found.");
    }

    public List<Prescription> getPrescriptionsByPatientId(Long patientId) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isPresent()) {
            return prescriptionRepository.findByPatient(patientOpt.get());
        }
        throw new IllegalArgumentException("Patient not found.");
    }

    public List<Prescription> getPrescriptionsByDoctorId(Long doctorId) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isPresent()) {
            return prescriptionRepository.findByDoctor(doctorOpt.get());
        }
        throw new IllegalArgumentException("Doctor not found.");
    }
}