-- Baseline schema for HealthSphere, generated to match the current JPA
-- entities as of the Item 9 audit. This mirrors what Hibernate's
-- ddl-auto=update had already been creating.
--
-- IMPORTANT: on your current dev database this script does not run. See
-- spring.flyway.baseline-on-migrate / spring.flyway.baseline-version in
-- application.properties — Flyway detects the existing (non-empty, already
-- Hibernate-managed) schema and marks this version as already applied
-- instead of executing it. This file only creates the schema for real on a
-- genuinely empty database (a fresh clone, CI, a new environment). Verify
-- it against a throwaway database before relying on it for a real fresh
-- install, since it was written by hand from the entity classes rather than
-- exported from a running database.

CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    status VARCHAR(255),
    active TINYINT(1) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE patient (
    id BIGINT NOT NULL,
    full_name VARCHAR(255),
    phone_number VARCHAR(255),
    date_of_birth DATE,
    gender VARCHAR(255),
    address VARCHAR(255),
    emergency_contact VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_patient_user FOREIGN KEY (id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE doctor (
    id BIGINT NOT NULL,
    full_name VARCHAR(255),
    specialization VARCHAR(255),
    license_number VARCHAR(255),
    certificate_file_path VARCHAR(255),
    years_of_experience INT,
    clinic_name VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_doctor_user FOREIGN KEY (id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE appointments (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    appointment_time DATETIME,
    status VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_appointments_patient FOREIGN KEY (patient_id) REFERENCES patient (id),
    CONSTRAINT fk_appointments_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id)
) ENGINE=InnoDB;

CREATE TABLE ehr_records (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    visit_date DATE,
    diagnosis VARCHAR(255),
    medications VARCHAR(255),
    lab_results VARCHAR(255),
    notes VARCHAR(255),
    PRIMARY KEY (id),
    CONSTRAINT fk_ehr_patient FOREIGN KEY (patient_id) REFERENCES patient (id),
    CONSTRAINT fk_ehr_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id)
) ENGINE=InnoDB;

CREATE TABLE prescriptions (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    doctor_id BIGINT NOT NULL,
    medication VARCHAR(255),
    dosage VARCHAR(255),
    instructions VARCHAR(255),
    prescription_date DATE,
    PRIMARY KEY (id),
    CONSTRAINT fk_prescriptions_patient FOREIGN KEY (patient_id) REFERENCES patient (id),
    CONSTRAINT fk_prescriptions_doctor FOREIGN KEY (doctor_id) REFERENCES doctor (id)
) ENGINE=InnoDB;

CREATE TABLE notifications (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_id BIGINT NOT NULL,
    message VARCHAR(255),
    timestamp DATETIME,
    is_read TINYINT(1) NOT NULL,
    PRIMARY KEY (id),
    CONSTRAINT fk_notifications_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE password_reset_tokens (
    id BIGINT NOT NULL AUTO_INCREMENT,
    token VARCHAR(255),
    user_id BIGINT NOT NULL,
    expiry_date DATETIME,
    PRIMARY KEY (id),
    UNIQUE KEY uk_password_reset_tokens_user (user_id),
    CONSTRAINT fk_password_reset_tokens_user FOREIGN KEY (user_id) REFERENCES users (id)
) ENGINE=InnoDB;

CREATE TABLE patient_documents (
    id BIGINT NOT NULL AUTO_INCREMENT,
    patient_id BIGINT NOT NULL,
    original_filename VARCHAR(255),
    stored_filename VARCHAR(255),
    uploaded_at DATETIME,
    PRIMARY KEY (id),
    CONSTRAINT fk_patient_documents_patient FOREIGN KEY (patient_id) REFERENCES patient (id)
) ENGINE=InnoDB;

CREATE TABLE security_logs (
    id BIGINT NOT NULL AUTO_INCREMENT,
    user_email VARCHAR(255),
    timestamp DATETIME,
    event_type VARCHAR(255),
    details VARCHAR(255),
    PRIMARY KEY (id)
) ENGINE=InnoDB;
