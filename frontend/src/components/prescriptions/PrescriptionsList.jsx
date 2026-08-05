import PropTypes from "prop-types";

import { Card, CardContent, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

const PrescriptionField = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>

    <Typography variant="body2">{value || "-"}</Typography>
  </Stack>
);

PrescriptionField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const PrescriptionsList = ({ prescriptions, viewerRole }) => {
  const counterpartLabel = viewerRole === "DOCTOR" ? "Patient" : "Doctor";

  return (
    <Stack spacing={2}>
      {prescriptions.map((prescription) => (
        <Card key={prescription.id} variant="outlined">
          <CardContent>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {counterpartLabel}:{" "}
                {viewerRole === "DOCTOR" ? prescription.patientName : prescription.doctorName}
              </Typography>

              <Chip
                size="small"
                label={prescription.prescriptionDate || "-"}
                variant="outlined"
              />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <PrescriptionField label="Medication" value={prescription.medication} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <PrescriptionField label="Dosage" value={prescription.dosage} />
              </Grid>

              <Grid size={{ xs: 12 }}>
                <PrescriptionField label="Instructions" value={prescription.instructions} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

PrescriptionsList.propTypes = {
  prescriptions: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      patientName: PropTypes.string,
      doctorName: PropTypes.string,
      prescriptionDate: PropTypes.string,
      medication: PropTypes.string,
      dosage: PropTypes.string,
      instructions: PropTypes.string,
    })
  ).isRequired,
  viewerRole: PropTypes.oneOf(["PATIENT", "DOCTOR"]).isRequired,
};

export default PrescriptionsList;
