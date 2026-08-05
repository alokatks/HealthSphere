import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  password: z.string().min(1, "Password is required."),
});

export const registerSchema = z
  .object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name is required."),

    email: z
      .string()
      .trim()
      .min(1, "Email is required.")
      .email("Please enter a valid email address."),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters."),

    confirmPassword: z
      .string()
      .min(1, "Please confirm your password."),

    role: z.enum(["PATIENT", "DOCTOR"]),

    // Doctor Fields
    specialization: z.string().optional(),
    licenseNumber: z.string().optional(),
    yearsOfExperience: z.coerce.number().optional(),
    clinicName: z.string().optional(),

    // Patient Fields
    phoneNumber: z.string().optional(),
    dateOfBirth: z.string().optional(),
    gender: z.string().optional(),
    address: z.string().optional(),
    emergencyContact: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // Confirm Password
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["confirmPassword"],
        message: "Passwords do not match.",
      });
    }

    // Doctor Validation
    if (data.role === "DOCTOR") {
      if (!data.specialization?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["specialization"],
          message: "Specialization is required.",
        });
      }

      if (!data.licenseNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["licenseNumber"],
          message: "License number is required.",
        });
      }

      if (
        data.yearsOfExperience === undefined ||
        Number.isNaN(data.yearsOfExperience)
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["yearsOfExperience"],
          message: "Years of experience is required.",
        });
      }

      if (!data.clinicName?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["clinicName"],
          message: "Clinic name is required.",
        });
      }
    }

    // Patient Validation
    if (data.role === "PATIENT") {
      if (!data.phoneNumber?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["phoneNumber"],
          message: "Phone number is required.",
        });
      }

      if (!data.dateOfBirth) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["dateOfBirth"],
          message: "Date of birth is required.",
        });
      }

      if (!data.gender?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["gender"],
          message: "Gender is required.",
        });
      }

      if (!data.address?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["address"],
          message: "Address is required.",
        });
      }

      if (!data.emergencyContact?.trim()) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["emergencyContact"],
          message: "Emergency contact is required.",
        });
      }
    }
  });