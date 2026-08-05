import { z } from "zod";

// Mirrors com.healthsphere.healthsphere.dto.EHRDto exactly.
// Do not add fields here that the DTO doesn't have.
export const createEHRSchema = z.object({
  patientId: z.union([z.string(), z.number()]),
  doctorId: z.union([z.string(), z.number()]),

  visitDate: z.string().min(1, "Visit date is required."),

  diagnosis: z.string().trim().min(1, "Diagnosis is required."),

  medications: z.string().trim().optional().or(z.literal("")),

  labResults: z.string().trim().optional().or(z.literal("")),

  notes: z.string().trim().optional().or(z.literal("")),
});
