import { useNavigate, useParams } from "react-router-dom";

import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import { Box, Button, Grid, Paper, Stack, Typography } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import ErrorState from "@/components/common/ErrorState";
import PatientStatusChip from "@/components/patients/PatientStatusChip";

import usePatientDetails from "@/hooks/usePatientDetails";
import ROUTES from "@/constants/routes";

const Field = ({ label, value }) => (
  <Box>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>
    <Typography variant="body1">{value || "-"}</Typography>
  </Box>
);

const PatientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { patient, loading, error, retry } = usePatientDetails(id);

  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  if (loading || !patient) {
    return null; // TableSkeleton is list-shaped; a detail page just waits briefly.
  }

  return (
    <Box>
      <SectionHeader
        title={patient.fullName}
        subtitle="Patient details"
        action={
          <Stack direction="row" spacing={1}>
            <Button
              startIcon={<ArrowBackOutlinedIcon />}
              onClick={() => navigate(ROUTES.ADMIN_PATIENTS)}
            >
              Back
            </Button>
            <Button
              variant="contained"
              startIcon={<EditOutlinedIcon />}
              onClick={() => navigate(ROUTES.ADMIN_PATIENT_EDIT(patient.id))}
            >
              Edit
            </Button>
          </Stack>
        }
      />

      <Paper sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", mb: 3 }}>
          <PatientStatusChip active={patient.active} />
        </Stack>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Email" value={patient.email} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Phone Number" value={patient.phoneNumber} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Date of Birth" value={patient.dateOfBirth} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Gender" value={patient.gender} />
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Field label="Address" value={patient.address} />
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Field label="Emergency Contact" value={patient.emergencyContact} />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default PatientDetailsPage;
