const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/api/auth/login",
    REGISTER: "/api/auth/register",
    FORGOT_PASSWORD: "/api/auth/forgot-password",
    RESET_PASSWORD: "/api/auth/reset-password",
  },

  PROFILE: {
    GET: "/api/profile",
    UPDATE: "/api/profile/update",
  },

  ADMIN: {
    PATIENTS: "/api/admin/users/patients",

    PATIENT: (patientId) => `/api/admin/patients/${patientId}`,

    UPDATE_PATIENT: (patientId) => `/api/admin/patients/${patientId}`,

    UPDATE_PATIENT_STATUS: (patientId) => `/api/admin/patients/${patientId}/status`,

    DOCTORS: "/api/admin/users/doctors",

    VERIFY_DOCTOR: (doctorId) => `/api/admin/doctors/verify/${doctorId}`,

    SECURITY_LOGS: "/api/admin/logs",
  },

  PATIENT: {
    UPLOAD_REPORT: "/api/patient/upload-report",
    REPORTS: (patientId) => `/api/patient/reports/${patientId}`,
  },

  DOCTOR: {
    UPLOAD_CERTIFICATE: (doctorId) => `/api/files/upload-certificate/${doctorId}`,

    // Backend: DoctorController GET /api/doctors, @PreAuthorize hasRole('PATIENT').
    // Returns doctorRepository.findByUser_Status("VERIFIED") — verified doctors
    // only, used to populate the booking dropdown for patients.
    AVAILABLE: "/api/doctors",
  },

  APPOINTMENT: {
    BOOK: "/api/appointments/book",
    BY_PATIENT: (patientId) => `/api/appointments/patient/${patientId}`,
    BY_DOCTOR: (doctorId) => `/api/appointments/doctor/${doctorId}`,
    CANCEL: (appointmentId) => `/api/appointments/${appointmentId}/cancel`,
    SET_TELEHEALTH_LINK: (appointmentId) =>
      `/api/appointments/${appointmentId}/telehealth-link`,
  },

  EHR: {
    CREATE: "/api/ehr/create",
    BY_PATIENT: (patientId) => `/api/ehr/patient/${patientId}`,
    BY_DOCTOR: (doctorId) => `/api/ehr/doctor/${doctorId}`,
  },

  PRESCRIPTION: {
    CREATE: "/api/prescriptions/create",
    BY_PATIENT: (patientId) => `/api/prescriptions/patient/${patientId}`,
    BY_DOCTOR: (doctorId) => `/api/prescriptions/doctor/${doctorId}`,
  },

  FILE: {
    // Serves both doctor certificates and patient report uploads — the
    // backend resolves the stored filename regardless of who uploaded it.
    DOWNLOAD: (filename) => `/api/files/download/${filename}`,
  },

  NOTIFICATION: {
    USER: (userId) => `/api/notifications/user/${userId}`,
    MARK_READ: (notificationId) => `/api/notifications/${notificationId}/read`,
  },

  REPORT: {
    DASHBOARD_STATS: "/api/reports/dashboard-stats",
  },
};

export default API_ENDPOINTS;
