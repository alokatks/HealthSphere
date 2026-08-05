import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import ArrowBackOutlinedIcon from "@mui/icons-material/ArrowBackOutlined";

import {
  Box,
  Button,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
} from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import ErrorState from "@/components/common/ErrorState";

import usePatientDetails from "@/hooks/usePatientDetails";
import { patientUpdateSchema } from "@/validations/patientSchemas";
import ROUTES from "@/constants/routes";
import GENDER_OPTIONS from "@/constants/gender";

const EditPatientPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { patient, loading, error, saving, retry, updatePatient } = usePatientDetails(id);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(patientUpdateSchema),
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      emergencyContact: "",
    },
  });

  // Populate the form once the patient loads — can't set defaultValues
  // before the fetch resolves.
  useEffect(() => {
    if (patient) {
      reset({
        fullName: patient.fullName ?? "",
        phoneNumber: patient.phoneNumber ?? "",
        dateOfBirth: patient.dateOfBirth ?? "",
        gender: patient.gender ?? "",
        address: patient.address ?? "",
        emergencyContact: patient.emergencyContact ?? "",
      });
    }
  }, [patient, reset]);

  const onSubmit = async (values) => {
    try {
      await updatePatient(values);
      toast.success("Patient updated successfully.");
      navigate(ROUTES.ADMIN_PATIENT_DETAILS(id));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update patient.");
    }
  };

  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  if (loading || !patient) {
    return null;
  }

  return (
    <Box>
      <SectionHeader
        title={`Edit ${patient.fullName}`}
        subtitle="Update patient details"
        action={
          <Button
            startIcon={<ArrowBackOutlinedIcon />}
            onClick={() => navigate(ROUTES.ADMIN_PATIENT_DETAILS(id))}
          >
            Back
          </Button>
        }
      />

      <Paper sx={{ p: 3 }} component="form" onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="fullName"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  fullWidth
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="phoneNumber"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Phone Number"
                  fullWidth
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  type="date"
                  label="Date of Birth"
                  fullWidth
                  InputLabelProps={{ shrink: true }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  select
                  label="Gender"
                  fullWidth
                  error={!!errors.gender}
                  helperText={errors.gender?.message}
                >
                  {GENDER_OPTIONS.filter((option) => option.value !== "ALL").map(
                    (option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    )
                  )}
                </TextField>
              )}
            />
          </Grid>

          <Grid size={{ xs: 12 }}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Address"
                  fullWidth
                  multiline
                  minRows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="emergencyContact"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Emergency Contact"
                  fullWidth
                  error={!!errors.emergencyContact}
                  helperText={errors.emergencyContact?.message}
                />
              )}
            />
          </Grid>
        </Grid>

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", mt: 4 }}>
          <Button onClick={() => navigate(ROUTES.ADMIN_PATIENT_DETAILS(id))} disabled={saving}>
            Cancel
          </Button>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
};

export default EditPatientPage;
