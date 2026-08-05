import PropTypes from "prop-types";

import { Card, CardContent, Chip, Divider, Grid, Stack, Typography } from "@mui/material";

const RecordField = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>

    <Typography variant="body2">{value || "-"}</Typography>
  </Stack>
);

RecordField.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.string,
};

const EHRRecordsList = ({ records, viewerRole }) => {
  const counterpartLabel = viewerRole === "DOCTOR" ? "Patient" : "Doctor";

  return (
    <Stack spacing={2}>
      {records.map((record) => (
        <Card key={record.id} variant="outlined">
          <CardContent>
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center", mb: 2 }}
            >
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {counterpartLabel}:{" "}
                {viewerRole === "DOCTOR" ? record.patientName : record.doctorName}
              </Typography>

              <Chip
                size="small"
                label={record.visitDate || "-"}
                variant="outlined"
              />
            </Stack>

            <Divider sx={{ mb: 2 }} />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <RecordField label="Diagnosis" value={record.diagnosis} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <RecordField label="Medications" value={record.medications} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <RecordField label="Lab Results" value={record.labResults} />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <RecordField label="Notes" value={record.notes} />
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      ))}
    </Stack>
  );
};

EHRRecordsList.propTypes = {
  records: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      patientName: PropTypes.string,
      doctorName: PropTypes.string,
      visitDate: PropTypes.string,
      diagnosis: PropTypes.string,
      medications: PropTypes.string,
      labResults: PropTypes.string,
      notes: PropTypes.string,
    })
  ).isRequired,
  viewerRole: PropTypes.oneOf(["PATIENT", "DOCTOR"]).isRequired,
};

export default EHRRecordsList;
