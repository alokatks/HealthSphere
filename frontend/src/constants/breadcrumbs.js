import ROUTES from "./routes";

const breadcrumbConfig = {
  [ROUTES.ADMIN_DASHBOARD]: [
    {
      label: "Admin",
      path: null,
    },
    {
      label: "Dashboard",
      path: ROUTES.ADMIN_DASHBOARD,
    },
  ],

  [ROUTES.ADMIN_PATIENTS]: [
    {
      label: "Admin",
      path: null,
    },
    {
      label: "Patients",
      path: ROUTES.ADMIN_PATIENTS,
    },
  ],

  [ROUTES.ADMIN_DOCTORS]: [
    {
      label: "Admin",
      path: null,
    },
    {
      label: "Doctors",
      path: ROUTES.ADMIN_DOCTORS,
    },
  ],

  [ROUTES.DOCTOR_DASHBOARD]: [
    {
      label: "Doctor",
      path: null,
    },
    {
      label: "Dashboard",
      path: ROUTES.DOCTOR_DASHBOARD,
    },
  ],

  [ROUTES.DOCTOR_APPOINTMENTS]: [
    {
      label: "Doctor",
      path: null,
    },
    {
      label: "Appointments",
      path: ROUTES.DOCTOR_APPOINTMENTS,
    },
  ],

  [ROUTES.DOCTOR_RECORDS]: [
    {
      label: "Doctor",
      path: null,
    },
    {
      label: "Patient Records",
      path: ROUTES.DOCTOR_RECORDS,
    },
  ],

  [ROUTES.PATIENT_DASHBOARD]: [
    {
      label: "Patient",
      path: null,
    },
    {
      label: "Dashboard",
      path: ROUTES.PATIENT_DASHBOARD,
    },
  ],

  [ROUTES.PATIENT_APPOINTMENTS]: [
    {
      label: "Patient",
      path: null,
    },
    {
      label: "Appointments",
      path: ROUTES.PATIENT_APPOINTMENTS,
    },
  ],

  [ROUTES.PATIENT_MEDICAL_RECORDS]: [
    {
      label: "Patient",
      path: null,
    },
    {
      label: "Medical Records",
      path: ROUTES.PATIENT_MEDICAL_RECORDS,
    },
  ],
};

export default breadcrumbConfig;