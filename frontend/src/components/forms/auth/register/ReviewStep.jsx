import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Divider,
  Grid,
  Stack,
  Typography,
} from "@mui/material";

const ReviewItem = ({ label, value }) => (
  <Stack spacing={0.5}>
    <Typography variant="caption" sx={{ color: "text.secondary" }}>
      {label}
    </Typography>

    <Typography variant="body1">
      {value || "-"}
    </Typography>
  </Stack>
);

ReviewItem.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.any,
};

const ReviewStep = ({ values }) => {
  const isDoctor = values.role === "DOCTOR";

  return (
    <Stack spacing={3}>
      <Card variant="outlined">
        <CardContent>

          <Typography variant="h6" gutterBottom>
            Account Information
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>

            <Grid size={{ xs: 12, md: 6 }}>
              <ReviewItem
                label="Full Name"
                value={values.fullName}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ReviewItem
                label="Email"
                value={values.email}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <ReviewItem
                label="Role"
                value={values.role}
              />
            </Grid>

          </Grid>

        </CardContent>
      </Card>

      <Card variant="outlined">
        <CardContent>

          <Typography variant="h6" gutterBottom>
            {isDoctor ? "Doctor Details" : "Patient Details"}
          </Typography>

          <Divider sx={{ mb: 3 }} />

          <Grid container spacing={3}>

            {isDoctor ? (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Specialization"
                    value={values.specialization}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="License Number"
                    value={values.licenseNumber}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Experience"
                    value={values.yearsOfExperience}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Clinic"
                    value={values.clinicName}
                  />
                </Grid>
              </>
            ) : (
              <>
                <Grid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Phone"
                    value={values.phoneNumber}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Date of Birth"
                    value={values.dateOfBirth}
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 6 }}>
                  <ReviewItem
                    label="Gender"
                    value={values.gender}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <ReviewItem
                    label="Address"
                    value={values.address}
                  />
                </Grid>

                <Grid size={{ xs: 12 }}>
                  <ReviewItem
                    label="Emergency Contact"
                    value={values.emergencyContact}
                  />
                </Grid>
              </>
            )}

          </Grid>

        </CardContent>
      </Card>
    </Stack>
  );
};

ReviewStep.propTypes = {
  values: PropTypes.object.isRequired,
};

export default ReviewStep;