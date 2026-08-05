import PropTypes from "prop-types";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import BlockOutlinedIcon from "@mui/icons-material/BlockOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

import { IconButton, Stack, Tooltip } from "@mui/material";

const PatientActions = ({ patient, onView, onEdit, onToggleStatus, size = "small" }) => (
  <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
    <Tooltip title="View Patient">
      <IconButton
        size={size}
        color="primary"
        onClick={() => onView(patient)}
        aria-label="View patient"
      >
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    <Tooltip title="Edit Patient">
      <IconButton
        size={size}
        color="primary"
        onClick={() => onEdit(patient)}
        aria-label="Edit patient"
      >
        <EditOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    <Tooltip title={patient.active ? "Deactivate Patient" : "Activate Patient"}>
      <IconButton
        size={size}
        color={patient.active ? "error" : "success"}
        onClick={() => onToggleStatus(patient)}
        aria-label={patient.active ? "Deactivate patient" : "Activate patient"}
      >
        {patient.active ? (
          <BlockOutlinedIcon fontSize="small" />
        ) : (
          <CheckCircleOutlineOutlinedIcon fontSize="small" />
        )}
      </IconButton>
    </Tooltip>
  </Stack>
);

PatientActions.propTypes = {
  patient: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    active: PropTypes.bool,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default PatientActions;
