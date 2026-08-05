package com.healthsphere.healthsphere.service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.healthsphere.healthsphere.dto.LoginDto;
import com.healthsphere.healthsphere.dto.ProfileUpdateDto;
import com.healthsphere.healthsphere.dto.UserRegistrationDto;
import com.healthsphere.healthsphere.model.Doctor;
import com.healthsphere.healthsphere.model.PasswordResetToken;
import com.healthsphere.healthsphere.model.Patient;
import com.healthsphere.healthsphere.model.SecurityLog;
import com.healthsphere.healthsphere.model.User;
import com.healthsphere.healthsphere.notification.NotificationService;
import com.healthsphere.healthsphere.repository.DoctorRepository;
import com.healthsphere.healthsphere.repository.PasswordResetTokenRepository;
import com.healthsphere.healthsphere.repository.PatientRepository;
import com.healthsphere.healthsphere.repository.SecurityLogRepository;
import com.healthsphere.healthsphere.repository.UserRepository;
import com.healthsphere.healthsphere.security.JwtTokenProvider;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;
    private final PasswordEncoder passwordEncoder;
    private final PasswordResetTokenRepository passwordResetTokenRepository;
    private final NotificationService notificationService;
    private final SecurityLogRepository securityLogRepository;
    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider tokenProvider; // New dependency

    @Value("${app.frontend-url}")
    private String frontendUrl;

    public AuthService(UserRepository userRepository, PatientRepository patientRepository, DoctorRepository doctorRepository, PasswordEncoder passwordEncoder, PasswordResetTokenRepository passwordResetTokenRepository, NotificationService notificationService, SecurityLogRepository securityLogRepository, AuthenticationManager authenticationManager, JwtTokenProvider tokenProvider) {
        this.userRepository = userRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
        this.passwordEncoder = passwordEncoder;
        this.passwordResetTokenRepository = passwordResetTokenRepository;
        this.notificationService = notificationService;
        this.securityLogRepository = securityLogRepository;
        this.authenticationManager = authenticationManager;
        this.tokenProvider = tokenProvider;
    }

    @Transactional
    public User registerUser(UserRegistrationDto registrationDto) {
        if (userRepository.findByEmail(registrationDto.getEmail()) != null) {
            throw new IllegalStateException("Email already registered.");
        }
        String role = registrationDto.getRole().toUpperCase();
        if (!role.equals("PATIENT") && !role.equals("DOCTOR")) {
            throw new IllegalStateException("Invalid role. Only PATIENT or DOCTOR may self-register.");
        }

        User user = new User();
        user.setEmail(registrationDto.getEmail());
        user.setPassword(passwordEncoder.encode(registrationDto.getPassword()));
        user.setRole(role);
        user.setStatus("DOCTOR".equals(user.getRole()) ? "PENDING" : "VERIFIED");
        User savedUser = userRepository.save(user);

        if ("PATIENT".equals(savedUser.getRole())) {
            Patient patient = new Patient();
            patient.setUser(savedUser);
            patient.setFullName(registrationDto.getFullName());
            patient.setPhoneNumber(registrationDto.getPhoneNumber());
            patient.setDateOfBirth(registrationDto.getDateOfBirth());
            patient.setGender(registrationDto.getGender());
            patient.setAddress(registrationDto.getAddress());
            patient.setEmergencyContact(registrationDto.getEmergencyContact());
            patientRepository.save(patient);
        } else if ("DOCTOR".equals(savedUser.getRole())) {
            Doctor doctor = new Doctor();
            doctor.setUser(savedUser);
            doctor.setFullName(registrationDto.getFullName());
            doctor.setSpecialization(registrationDto.getSpecialization());
            doctor.setLicenseNumber(registrationDto.getLicenseNumber());
            doctor.setYearsOfExperience(registrationDto.getYearsOfExperience());
            doctor.setClinicName(registrationDto.getClinicName());
            doctorRepository.save(doctor);
        }
        return savedUser;
    }
    
    public String loginUser(LoginDto loginDto) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginDto.getEmail(), loginDto.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // Log a successful login
            SecurityLog successLog = new SecurityLog();
            successLog.setUserEmail(loginDto.getEmail());
            successLog.setEventType("LOGIN_SUCCESS");
            successLog.setTimestamp(LocalDateTime.now());
            securityLogRepository.save(successLog);

            String token = tokenProvider.generateToken(authentication);
            return token;
        } catch (AuthenticationException e) {
            // Log a failed login
            SecurityLog failureLog = new SecurityLog();
            failureLog.setUserEmail(loginDto.getEmail());
            failureLog.setEventType("LOGIN_FAILURE");
            failureLog.setTimestamp(LocalDateTime.now());
            securityLogRepository.save(failureLog);

            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Transactional
    public Doctor verifyDoctor(Long doctorId) {
        return doctorRepository.findById(doctorId)
                .map(doctor -> {
                    doctor.getUser().setStatus("VERIFIED");
                    return doctorRepository.save(doctor);
                })
                .orElseThrow(() -> new IllegalArgumentException("Doctor not found."));
    }

    @Transactional
    public Object updateUserProfile(String userEmail, ProfileUpdateDto profileDto) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new IllegalArgumentException("User not found.");
        }

        if ("PATIENT".equals(user.getRole())) {
            Patient patient = patientRepository.findById(user.getId()).orElseThrow();
            if (profileDto.getFullName() != null) patient.setFullName(profileDto.getFullName());
            if (profileDto.getPhoneNumber() != null) patient.setPhoneNumber(profileDto.getPhoneNumber());
            if (profileDto.getDateOfBirth() != null) patient.setDateOfBirth(profileDto.getDateOfBirth());
            if (profileDto.getGender() != null) patient.setGender(profileDto.getGender());
            if (profileDto.getAddress() != null) patient.setAddress(profileDto.getAddress());
            if (profileDto.getEmergencyContact() != null) patient.setEmergencyContact(profileDto.getEmergencyContact());
            patientRepository.save(patient);
            return patient;

        } else if ("DOCTOR".equals(user.getRole())) {
            Doctor doctor = doctorRepository.findById(user.getId()).orElseThrow();
            if (profileDto.getFullName() != null) doctor.setFullName(profileDto.getFullName());
            if (profileDto.getSpecialization() != null) doctor.setSpecialization(profileDto.getSpecialization());
            if (profileDto.getLicenseNumber() != null) doctor.setLicenseNumber(profileDto.getLicenseNumber());
            if (profileDto.getYearsOfExperience() != null) doctor.setYearsOfExperience(profileDto.getYearsOfExperience());
            if (profileDto.getClinicName() != null) doctor.setClinicName(profileDto.getClinicName());
            doctorRepository.save(doctor);
            return doctor;
        }

        return user;
    }

    public void generatePasswordResetToken(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User with this email not found.");
        }
        Optional<PasswordResetToken> existingToken = passwordResetTokenRepository.findByUser(user);
        existingToken.ifPresent(passwordResetTokenRepository::delete);
        String token = UUID.randomUUID().toString();
        LocalDateTime expiryTime = LocalDateTime.now().plusHours(24);
        PasswordResetToken resetToken = new PasswordResetToken();
        resetToken.setToken(token);
        resetToken.setUser(user);
        resetToken.setExpiryDate(expiryTime);
        passwordResetTokenRepository.save(resetToken);
        String resetLink = frontendUrl + "/reset-password?token=" + token;
        String subject = "HealthSphere Password Reset Link";
        String body = "Please use the following link to reset your password: " + resetLink;
        notificationService.sendEmail(email, subject, body);
    }
    
    public boolean resetPassword(String token, String newPassword) {
        Optional<PasswordResetToken> resetTokenOpt = passwordResetTokenRepository.findByToken(token);
        if (resetTokenOpt.isPresent() && resetTokenOpt.get().getExpiryDate().isAfter(LocalDateTime.now())) {
            User user = resetTokenOpt.get().getUser();
            user.setPassword(passwordEncoder.encode(newPassword));
            userRepository.save(user);
            passwordResetTokenRepository.delete(resetTokenOpt.get());
            return true;
        }
        return false;
    }
}