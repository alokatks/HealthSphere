const ROUTES = {
  HOME: "/",

  LOGIN: "/login",
  REGISTER: "/register",

  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",

  ADMIN_DASHBOARD: "/dashboard/admin",
  DOCTOR_DASHBOARD: "/dashboard/doctor",
  PATIENT_DASHBOARD: "/dashboard/patient",

  // Admin
  ADMIN_PATIENTS: "/dashboard/admin/patients",
  ADMIN_PATIENT_DETAILS: (id) => `/dashboard/admin/patients/${id}`,
  ADMIN_PATIENT_EDIT: (id) => `/dashboard/admin/patients/${id}/edit`,
  ADMIN_DOCTORS: "/dashboard/admin/doctors",
  ADMIN_REPORTS: "/dashboard/admin/reports",
  ADMIN_PROFILE: "/dashboard/admin/profile",

  // Doctor
  DOCTOR_APPOINTMENTS: "/dashboard/doctor/appointments",
  DOCTOR_RECORDS: "/dashboard/doctor/records",
  DOCTOR_PRESCRIPTIONS: "/dashboard/doctor/prescriptions",
  DOCTOR_PROFILE: "/dashboard/doctor/profile",

  // Patient
  PATIENT_APPOINTMENTS: "/dashboard/patient/appointments",
  PATIENT_MEDICAL_RECORDS: "/dashboard/patient/medical-records",
  PATIENT_PRESCRIPTIONS: "/dashboard/patient/prescriptions",
  PATIENT_DOCUMENTS: "/dashboard/patient/documents",
  PATIENT_PROFILE: "/dashboard/patient/profile",

  // Shared
  PROFILE: "/profile",

  UNAUTHORIZED: "/unauthorized",

  NOT_FOUND: "*",
};

export default ROUTES;