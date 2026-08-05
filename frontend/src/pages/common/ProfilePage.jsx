import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import {
  Box,
  Button,
  Chip,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import ErrorState from "@/components/common/ErrorState";
import UploadCertificateDialog from "@/components/doctors/UploadCertificateDialog";

import useMyProfile from "@/hooks/useMyProfile";
import { useAuth } from "@/context/AuthContext";
import ROLES from "@/constants/roles";
import GENDER_OPTIONS from "@/constants/gender";
import doctorService from "@/services/doctorService";
import downloadFile from "@/utils/downloadFile";
import {
  patientProfileUpdateSchema,
  doctorProfileUpdateSchema,
} from "@/validations/profileSchemas";

// Backend serves ONE shared ProfileUpdateDto for both roles (see
// ProfileController + ProfileUpdateDto). We only send the subset of
// fields relevant to the signed-in user's role.
const PATIENT_DEFAULTS = {
  fullName: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "",
  address: "",
  emergencyContact: "",
};

const DOCTOR_DEFAULTS = {
  fullName: "",
  specialization: "",
  clinicName: "",
  licenseNumber: "",
  yearsOfExperience: "",
};

const ProfilePage = () => {
  const { role } = useAuth();
  const { profile, loading, error, saving, retry, updateProfile } = useMyProfile();

  const isDoctor = role === ROLES.DOCTOR;

  const schema = isDoctor ? doctorProfileUpdateSchema : patientProfileUpdateSchema;
  const defaultValues = isDoctor ? DOCTOR_DEFAULTS : PATIENT_DEFAULTS;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  // Certificate upload state — only relevant for doctors. Uploading calls
  // the verified POST /api/files/upload-certificate/{doctorId} endpoint,
  // then refetches the profile so certificateFilePath / verification
  // status reflect the backend's actual state.
  const [certDialogOpen, setCertDialogOpen] = useState(false);
  const [uploadingCert, setUploadingCert] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  // Populate the form once the profile loads — can't set defaultValues
  // before the fetch resolves.
  useEffect(() => {
    if (!profile) return;

    if (isDoctor) {
      reset({
        fullName: profile.fullName ?? "",
        specialization: profile.specialization ?? "",
        clinicName: profile.clinicName ?? "",
        licenseNumber: profile.licenseNumber ?? "",
        yearsOfExperience: profile.yearsOfExperience ?? "",
      });
    } else {
      reset({
        fullName: profile.fullName ?? "",
        phoneNumber: profile.phoneNumber ?? "",
        dateOfBirth: profile.dateOfBirth ?? "",
        gender: profile.gender ?? "",
        address: profile.address ?? "",
        emergencyContact: profile.emergencyContact ?? "",
      });
    }
  }, [profile, isDoctor, reset]);

  const onSubmit = async (values) => {
    try {
      await updateProfile(values);
      toast.success("Profile updated successfully.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile.");
    }
  };

  const handleUploadCertificate = async (file) => {
    setUploadingCert(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      await doctorService.uploadCertificate(profile.id, formData);
      await retry();

      toast.success("Certificate uploaded. An admin will review it shortly.");
      setCertDialogOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload certificate.");
    } finally {
      setUploadingCert(false);
    }
  };

  const handleDownloadCertificate = async () => {
    setDownloadingCert(true);
    try {
      await downloadFile(profile.certificateFilePath, `${profile.fullName}-certificate`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to download certificate.");
    } finally {
      setDownloadingCert(false);
    }
  };

  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  if (loading || !profile) {
    return null;
  }

  const email = profile.user?.email ?? profile.email ?? "—";
  // Doctor verification status lives on the nested User (PENDING/VERIFIED).
  const verificationStatus = isDoctor ? profile.user?.status : null;

  return (
    <Box>
      <SectionHeader
        title="My Profile"
        subtitle="View and update your account details"
      />

      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center", flexWrap: "wrap" }}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{email}</Typography>
          </Box>

          {verificationStatus && (
            <Chip
              label={verificationStatus === "VERIFIED" ? "Verified" : "Pending Verification"}
              color={verificationStatus === "VERIFIED" ? "success" : "warning"}
              size="small"
            />
          )}
        </Stack>
      </Paper>

      {isDoctor && (
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack spacing={1.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              Verification Certificate
            </Typography>

            <Typography variant="body2" color="text.secondary">
              {verificationStatus === "VERIFIED"
                ? "Your certificate has been reviewed and your account is verified."
                : "Upload your medical license or qualification certificate so an administrator can verify your account."}
            </Typography>

            <Stack direction="row" spacing={2} sx={{ flexWrap: "wrap" }}>
              {profile.certificateFilePath && (
                <Button
                  variant="outlined"
                  startIcon={<DownloadRoundedIcon />}
                  disabled={downloadingCert}
                  onClick={handleDownloadCertificate}
                >
                  {downloadingCert ? "Downloading..." : "Download Uploaded Certificate"}
                </Button>
              )}

              <Button
                variant="contained"
                startIcon={<UploadFileRoundedIcon />}
                onClick={() => setCertDialogOpen(true)}
              >
                {profile.certificateFilePath ? "Replace Certificate" : "Upload Certificate"}
              </Button>
            </Stack>
          </Stack>
        </Paper>
      )}

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

          {isDoctor ? (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="specialization"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Specialization"
                      fullWidth
                      error={!!errors.specialization}
                      helperText={errors.specialization?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="clinicName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="Clinic Name"
                      fullWidth
                      error={!!errors.clinicName}
                      helperText={errors.clinicName?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="licenseNumber"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      label="License Number"
                      fullWidth
                      error={!!errors.licenseNumber}
                      helperText={errors.licenseNumber?.message}
                    />
                  )}
                />
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Controller
                  name="yearsOfExperience"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Years of Experience"
                      fullWidth
                      error={!!errors.yearsOfExperience}
                      helperText={errors.yearsOfExperience?.message}
                    />
                  )}
                />
              </Grid>
            </>
          ) : (
            <>
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
            </>
          )}
        </Grid>

        <Stack direction="row" spacing={2} sx={{ justifyContent: "flex-end", mt: 4 }}>
          <Button type="submit" variant="contained" disabled={saving}>
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </Stack>
      </Paper>

      {isDoctor && (
        <UploadCertificateDialog
          open={certDialogOpen}
          onClose={() => setCertDialogOpen(false)}
          onSubmit={handleUploadCertificate}
          submitting={uploadingCert}
        />
      )}
    </Box>
  );
};

export default ProfilePage;
