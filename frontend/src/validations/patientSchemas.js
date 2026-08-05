import { z } from "zod";

// Mirrors com.healthsphere.healthsphere.dto.PatientUpdateDto exactly.
// Do not add fields here that the DTO doesn't have.
export const patientUpdateSchema = z.object({
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
