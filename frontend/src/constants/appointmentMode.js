const APPOINTMENT_MODE = {
  IN_PERSON: "IN_PERSON",
  TELEHEALTH: "TELEHEALTH",
};

export const APPOINTMENT_MODE_OPTIONS = [
  { label: "In-Person", value: APPOINTMENT_MODE.IN_PERSON },
  { label: "Telehealth", value: APPOINTMENT_MODE.TELEHEALTH },
];

export const APPOINTMENT_MODE_LABELS = {
  [APPOINTMENT_MODE.IN_PERSON]: "In-Person",
  [APPOINTMENT_MODE.TELEHEALTH]: "Telehealth",
};

export default APPOINTMENT_MODE;
