import { useState } from "react";
import PropTypes from "prop-types";
import { toast } from "react-toastify";

import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";

import DoctorStatusChip from "@/components/doctors/DoctorStatusChip";

import downloadFile from "@/utils/downloadFile";

const DetailItem = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>

    <Typography variant="body1">{value || "-"}</Typography>
  </Stack>
);

DetailItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};

const DoctorDetailsDialog = ({ doctor, open, onClose }) => {
  const [downloadingCertificate, setDownloadingCertificate] = useState(false);

  if (!doctor) {
    return null;
  }

  // certificateFilePath is the backend-stored filename (see
  // FileUploadController#uploadCertificate). GET /api/files/download/{filename}
  // is `isAuthenticated()` on the backend, so any signed-in admin can fetch
  // it — reusing the same downloadFile util already used for patient
  // documents, since that endpoint requires a JWT and can't be a plain <a>.
  const handleDownloadCertificate = async () => {
    setDownloadingCertificate(true);
    try {
      await downloadFile(doctor.certificateFilePath, `${doctor.name}-certificate`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download certificate.");
    } finally {
      setDownloadingCertificate(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle
        sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}
      >
        Doctor Details
        <IconButton onClick={onClose} size="small" aria-label="Close dialog">
          <CloseRoundedIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3}>
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {doctor.name}
            </Typography>

            <DoctorStatusChip status={doctor.status} />
          </Stack>

          <Divider />

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem label="Email" value={doctor.email} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem label="Specialization" value={doctor.specialization} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem label="License Number" value={doctor.licenseNumber} />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <DetailItem
                label="Years of Experience"
                value={
                  doctor.yearsOfExperience != null
                    ? `${doctor.yearsOfExperience} years`
                    : null
                }
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <DetailItem label="Clinic" value={doctor.clinicName} />
            </Grid>
          </Grid>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="caption" sx={{ color: "text.secondary" }}>
              Certificate
            </Typography>

            {doctor.certificateFilePath ? (
              <Button
                variant="outlined"
                startIcon={<DownloadRoundedIcon />}
                disabled={downloadingCertificate}
                onClick={handleDownloadCertificate}
                sx={{ alignSelf: "flex-start" }}
              >
                {downloadingCertificate ? "Downloading..." : "Download Certificate"}
              </Button>
            ) : (
              <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                <InsertDriveFileOutlinedIcon fontSize="small" color="disabled" />
                <Typography variant="body2" color="text.secondary">
                  No certificate uploaded yet.
                </Typography>
              </Stack>
            )}
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

DoctorDetailsDialog.propTypes = {
  doctor: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string,
    specialization: PropTypes.string,
    licenseNumber: PropTypes.string,
    yearsOfExperience: PropTypes.number,
    clinicName: PropTypes.string,
    status: PropTypes.string,
    certificateFilePath: PropTypes.string,
  }),
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default DoctorDetailsDialog;
