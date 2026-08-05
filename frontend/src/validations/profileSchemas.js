import { z } from "zod";

// Mirrors com.healthsphere.healthsphere.dto.ProfileUpdateDto exactly.
// The backend uses ONE shared DTO for both roles — every field below exists
// on ProfileUpdateDto. Do not add fields the DTO doesn't have.
//
// ProfileUpdateDto fields:
// fullName, phoneNumber, dateOfBirth, gender, address, emergencyContact,
// specialization, clinicName, licenseNumber, yearsOfExperience

// Fields relevant to a PATIENT profile update.
export const patientProfileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),

  phoneNumber: z
    .string()
    .trim()
    .min(7, "Enter a valid phone number.")
    .max(15, "Enter a valid phone number."),

  dateOfBirth: z.string().min(1, "Date of birth is required."),

  gender: z.enum(["MALE", "FEMALE", "OTHER"], {
    errorMap: () => ({ message: "Please select a gender." }),
  }),

  address: z.string().trim().min(1, "Address is required."),

  emergencyContact: z.string().trim().min(1, "Emergency contact is required."),
});

// Fields relevant to a DOCTOR profile update.
export const doctorProfileUpdateSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required."),

  specialization: z.string().trim().min(1, "Specialization is required."),

  clinicName: z.string().trim().min(1, "Clinic name is required."),

  licenseNumber: z.string().trim().min(1, "License number is required."),

  yearsOfExperience: z
    .coerce
    .number({ invalid_type_error: "Years of experience must be a number." })
    .int("Years of experience must be a whole number.")
    .min(0, "Years of experience cannot be negative.")
    .max(70, "Enter a valid number of years."),
});