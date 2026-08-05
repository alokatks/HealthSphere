import PropTypes from "prop-types";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import VerifiedOutlinedIcon from "@mui/icons-material/VerifiedOutlined";

import { CircularProgress, IconButton, Stack, Tooltip } from "@mui/material";

import DOCTOR_STATUS from "@/constants/doctorStatus";

const DoctorActions = ({ doctor, onView, onVerify, verifying, size = "small" }) => (
  <Stack direction="row" spacing={1} sx={{ justifyContent: "center" }}>
    <Tooltip title="View Doctor">
      <IconButton
        size={size}
        color="primary"
        onClick={() => onView(doctor)}
        aria-label="View doctor"
      >
        <VisibilityOutlinedIcon fontSize="small" />
      </IconButton>
    </Tooltip>

    {doctor.status === DOCTOR_STATUS.PENDING && (
      <Tooltip title="Verify Doctor">
        <span>
          <IconButton
            size={size}
            color="success"
            disabled={verifying}
            onClick={() => onVerify(doctor)}
            aria-label={verifying ? "Verifying doctor" : "Verify doctor"}
          >
            {verifying ? (
              <CircularProgress size={16} color="inherit" />
            ) : (
              <VerifiedOutlinedIcon fontSize="small" />
            )}
          </IconButton>
        </span>
      </Tooltip>
    )}
  </Stack>
);

DoctorActions.propTypes = {
  doctor: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    status: PropTypes.string,
  }).isRequired,
  onView: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
  verifying: PropTypes.bool,
  size: PropTypes.oneOf(["small", "medium", "large"]),
};

export default DoctorActions;
