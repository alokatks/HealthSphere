const APPOINTMENT_STATUS = {
  PENDING: "PENDING",
  CANCELED: "CANCELED",
};

export const APPOINTMENT_STATUS_OPTIONS = [
  { label: "All", value: "ALL" },
  { label: "Pending", value: APPOINTMENT_STATUS.PENDING },
  { label: "Canceled", value: APPOINTMENT_STATUS.CANCELED },
];

export default APPOINTMENT_STATUS;
