import { z } from "zod";

// Mirrors com.healthsphere.healthsphere.dto.PrescriptionDto exactly.
// Do not add fields here that the DTO doesn't have.
export const createPrescriptionSchema = z.object({
  patientId: z.union([z.string(), z.number()]),
  doctorId: z.union([z.string(), z.number()]),

  medication: z.string().trim().min(1, "Medication is required."),

  dosage: z.string().trim().min(1, "Dosage is required."),

  instructions: z.string().trim().optional().or(z.literal("")),
});
