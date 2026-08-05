import PropTypes from "prop-types";

import { Chip } from "@mui/material";

const PatientStatusChip = ({ active = true }) => (
  <Chip
    label={active ? "Active" : "Inactive"}
    color={active ? "success" : "default"}
    size="small"
    variant={active ? "filled" : "outlined"}
  />
);

PatientStatusChip.propTypes = {
  active: PropTypes.bool,
};

export default PatientStatusChip;
