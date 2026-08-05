import { z } from "zod";

import APPOINTMENT_MODE from "@/constants/appointmentMode";

// Mirrors com.healthsphere.healthsphere.dto.AppointmentDto for the fields the
// patient actually submits. patientId is injected by the page (from
// useMyProfile), not collected in the form. `status` is set by the backend
// (defaults to "PENDING") and is never sent from the client.
export const bookAppointmentSchema = z.object({
  doctorId: z.union([z.string(), z.number()]).refine((value) => value !== "", {
    message: "Please select a doctor.",
  }),

  appointmentTime: z
    .string()
    .min(1, "Please choose a date and time.")
    .refine((value) => new Date(value).getTime() > Date.now(), {
      message: "Appointment time must be in the future.",
    }),

  mode: z.enum([APPOINTMENT_MODE.IN_PERSON, APPOINTMENT_MODE.TELEHEALTH], {
    errorMap: () => ({ message: "Please choose how the appointment will happen." }),
  }),
});

// Mirrors com.healthsphere.healthsphere.dto.TelehealthLinkDto. Used by a
// doctor to add/edit the meeting link on a TELEHEALTH appointment.
export const telehealthLinkSchema = z.object({
  telehealthLink: z
    .string()
    .trim()
    .min(1, "Meeting link is required.")
    .url("Enter a valid URL (e.g. https://meet.example.com/xyz)."),
});
