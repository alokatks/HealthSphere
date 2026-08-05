import PropTypes from "prop-types";

import { Chip } from "@mui/material";

import APPOINTMENT_STATUS from "@/constants/appointmentStatus";

const AppointmentStatusChip = ({ status = APPOINTMENT_STATUS.PENDING }) => {
  const isCanceled = status === APPOINTMENT_STATUS.CANCELED;

  return (
    <Chip
      label={isCanceled ? "Canceled" : "Pending"}
      color={isCanceled ? "default" : "warning"}
      size="small"
      variant={isCanceled ? "outlined" : "filled"}
    />
  );
};

AppointmentStatusChip.propTypes = {
  status: PropTypes.string,
};

export default AppointmentStatusChip;
