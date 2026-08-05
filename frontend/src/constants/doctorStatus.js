const DOCTOR_STATUS = {
  PENDING: "PENDING",
  VERIFIED: "VERIFIED",
};

export const DOCTOR_STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Pending Verification", value: DOCTOR_STATUS.PENDING },
  { label: "Verified", value: DOCTOR_STATUS.VERIFIED },
];

export default DOCTOR_STATUS;
