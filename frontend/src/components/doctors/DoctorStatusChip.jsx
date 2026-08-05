import PropTypes from "prop-types";

import { Chip } from "@mui/material";

import DOCTOR_STATUS from "@/constants/doctorStatus";

const DoctorStatusChip = ({ status = DOCTOR_STATUS.PENDING }) => {
  const isVerified = status === DOCTOR_STATUS.VERIFIED;

  return (
    <Chip
      label={isVerified ? "Verified" : "Pending"}
      color={isVerified ? "success" : "warning"}
      size="small"
      variant={isVerified ? "filled" : "outlined"}
    />
  );
};

DoctorStatusChip.propTypes = {
  status: PropTypes.oneOf([DOCTOR_STATUS.PENDING, DOCTOR_STATUS.VERIFIED]),
};

export default DoctorStatusChip;
