import DashboardRoundedIcon from "@mui/icons-material/DashboardRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import LocalHospitalRoundedIcon from "@mui/icons-material/LocalHospitalRounded";
import CalendarMonthRoundedIcon from "@mui/icons-material/CalendarMonthRounded";
import MedicalInformationRoundedIcon from "@mui/icons-material/MedicalInformationRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import MedicationRoundedIcon from "@mui/icons-material/MedicationRounded";
import FolderCopyRoundedIcon from "@mui/icons-material/FolderCopyRounded";
import AssessmentRoundedIcon from "@mui/icons-material/AssessmentRounded";

import ROLES from "./roles";
import ROUTES from "./routes";

export const navigationConfig = {
  [ROLES.ADMIN]: [
    {
      id: "admin-dashboard",
      label: "Dashboard",
      path: ROUTES.ADMIN_DASHBOARD,
      icon: DashboardRoundedIcon,
      permission: ROLES.ADMIN,
      hidden: false,
      children: [],
    },
    {
      id: "admin-doctors",
      label: "Doctors",
      path: ROUTES.ADMIN_DOCTORS,
      icon: LocalHospitalRoundedIcon,
      permission: ROLES.ADMIN,
      hidden: false,
      children: [],
    },
    {
      id: "admin-patients",
      label: "Patients",
      path: ROUTES.ADMIN_PATIENTS,
      icon: PeopleRoundedIcon,
      permission: ROLES.ADMIN,
      hidden: false,
      children: [],
    },
    {
      id: "admin-reports",
      label: "Reports",
      path: ROUTES.ADMIN_REPORTS,
      icon: AssessmentRoundedIcon,
      permission: ROLES.ADMIN,
      hidden: false,
      children: [],
    },
    {
      id: "admin-profile",
      label: "Profile",
      path: ROUTES.ADMIN_PROFILE,
      icon: PersonRoundedIcon,
      permission: ROLES.ADMIN,
      hidden: false,
      children: [],
    },
  ],

  [ROLES.DOCTOR]: [
    {
      id: "doctor-dashboard",
      label: "Dashboard",
      path: ROUTES.DOCTOR_DASHBOARD,
      icon: DashboardRoundedIcon,
      permission: ROLES.DOCTOR,
      hidden: false,
      children: [],
    },
    {
      id: "doctor-appointments",
      label: "Appointments",
      path: ROUTES.DOCTOR_APPOINTMENTS,
      icon: CalendarMonthRoundedIcon,
      permission: ROLES.DOCTOR,
      hidden: false,
      children: [],
    },
    {
      id: "doctor-records",
      label: "Patient Records",
      path: ROUTES.DOCTOR_RECORDS,
      icon: MedicalInformationRoundedIcon,
      permission: ROLES.DOCTOR,
      hidden: false,
      children: [],
    },
    {
      id: "doctor-prescriptions",
      label: "Prescriptions",
      path: ROUTES.DOCTOR_PRESCRIPTIONS,
      icon: MedicationRoundedIcon,
      permission: ROLES.DOCTOR,
      hidden: false,
      children: [],
    },
    {
      id: "doctor-profile",
      label: "Profile",
      path: ROUTES.DOCTOR_PROFILE,
      icon: PersonRoundedIcon,
      permission: ROLES.DOCTOR,
      hidden: false,
      children: [],
    },
  ],

  [ROLES.PATIENT]: [
    {
      id: "patient-dashboard",
      label: "Dashboard",
      path: ROUTES.PATIENT_DASHBOARD,
      icon: DashboardRoundedIcon,
      permission: ROLES.PATIENT,
      hidden: false,
      children: [],
    },
    {
      id: "patient-appointments",
      label: "Appointments",
      path: ROUTES.PATIENT_APPOINTMENTS,
      icon: CalendarMonthRoundedIcon,
      permission: ROLES.PATIENT,
      hidden: false,
      children: [],
    },
    {
      id: "patient-medical-records",
      label: "Medical Records",
      path: ROUTES.PATIENT_MEDICAL_RECORDS,
      icon: MedicalInformationRoundedIcon,
      permission: ROLES.PATIENT,
      hidden: false,
      children: [],
    },
    {
      id: "patient-prescriptions",
      label: "Prescriptions",
      path: ROUTES.PATIENT_PRESCRIPTIONS,
      icon: MedicationRoundedIcon,
      permission: ROLES.PATIENT,
      hidden: false,
      children: [],
    },
    {
      id: "patient-documents",
      label: "Documents",
      path: ROUTES.PATIENT_DOCUMENTS,
      icon: FolderCopyRoundedIcon,
      permission: ROLES.PATIENT,
      hidden: false,
      children: [],
    },
    {
      id: "patient-profile",
      label: "Profile",
      path: ROUTES.PATIENT_PROFILE,
      icon: PersonRoundedIcon,
      permission: ROLES.PATIENT,
      hidden: false,
      children: [],
    },
  ],
};