import PropTypes from "prop-types";

import { Chip } from "@mui/material";

import APPOINTMENT_MODE, { APPOINTMENT_MODE_LABELS } from "@/constants/appointmentMode";

const AppointmentModeChip = ({ mode = APPOINTMENT_MODE.IN_PERSON }) => {
  const isTelehealth = mode === APPOINTMENT_MODE.TELEHEALTH;

  return (
    <Chip
      label={APPOINTMENT_MODE_LABELS[mode] || mode}
      color={isTelehealth ? "info" : "default"}
      size="small"
      variant="outlined"
    />
  );
};

AppointmentModeChip.propTypes = {
  mode: PropTypes.string,
};

export default AppointmentModeChip;
