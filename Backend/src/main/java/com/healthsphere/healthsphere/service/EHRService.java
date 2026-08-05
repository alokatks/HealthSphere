package com.healthsphere.healthsphere.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.healthsphere.healthsphere.dto.EHRDto;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.EHR;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.EHRRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;

@Service
public class EHRService {

    @Autowired
    private EHRRepository ehrRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private PatientRepository patientRepository;

    public EHR createEHR(EHRDto ehrDto) {
        Optional<Patient> patientOpt = patientRepository.findById(ehrDto.getPatientId());
        Optional<Doctor> doctorOpt = doctorRepository.findById(ehrDto.getDoctorId());

        if (patientOpt.isPresent() && doctorOpt.isPresent()) {
            EHR ehr = new EHR();
            ehr.setPatient(patientOpt.get());
            ehr.setDoctor(doctorOpt.get());
            ehr.setVisitDate(LocalDate.now()); // Sets the visit date to the current date
            ehr.setDiagnosis(ehrDto.getDiagnosis());
            ehr.setMedications(ehrDto.getMedications());
            ehr.setLabResults(ehrDto.getLabResults());
            ehr.setNotes(ehrDto.getNotes());
            return ehrRepository.save(ehr);
        }
        throw new IllegalArgumentException("Patient or Doctor not found.");
    }

    public List<EHR> getRecordsByPatientId(Long patientId) {
        Optional<Patient> patientOpt = patientRepository.findById(patientId);
        if (patientOpt.isPresent()) {
            return ehrRepository.findByPatient(patientOpt.get());
        }
        throw new IllegalArgumentException("Patient not found.");
    }

    public List<EHR> getRecordsByDoctorId(Long doctorId) {
        Optional<Doctor> doctorOpt = doctorRepository.findById(doctorId);
        if (doctorOpt.isPresent()) {
            return ehrRepository.findByDoctor(doctorOpt.get());
        }
        throw new IllegalArgumentException("Doctor not found.");
    }
}