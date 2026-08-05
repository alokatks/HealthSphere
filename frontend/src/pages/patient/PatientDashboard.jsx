import {
  EventAvailable,
  FolderCopy,
  Medication,
  MedicalInformation,
} from "@mui/icons-material";

import { Alert, Box, Grid, Stack, Typography } from "@mui/material";

import StatsCards from "@/components/dashboard/admin/StatsCards";
import RecentActivity from "@/components/dashboard/admin/RecentActivity";
import QuickActions from "@/components/dashboard/admin/QuickActions";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import useMyProfile from "@/hooks/useMyProfile";
import usePatientDashboard from "@/hooks/usePatientDashboard";
import ROUTES from "@/constants/routes";

const PatientDashboard = () => {
  const {
    profile,
    myId,
    loading: profileLoading,
    error: profileError,
    retry: retryProfile,
  } = useMyProfile();

  const { stats, nextAppointment, recentActivity, loading, error, retry } =
    usePatientDashboard(myId);

  const isLoading = profileLoading || loading;
  const combinedError = profileError || error;

  if (isLoading) {
    return <TableSkeleton columns={4} rows={5} />;
  }

  if (combinedError) {
    return (
      <ErrorState error={combinedError} onRetry={profileError ? retryProfile : retry} />
    );
  }

  const statCards = [
    {
      title: "Upcoming Appointments",
      value: stats.upcomingAppointments,
      icon: EventAvailable,
      color: "#1976d2",
    },
    {
      title: "Active Prescriptions",
      value: stats.activePrescriptions,
      icon: Medication,
      color: "#9c27b0",
    },
    {
      title: "Medical Records",
      value: stats.medicalRecords,
      icon: MedicalInformation,
      color: "#2e7d32",
    },
    {
      title: "Uploaded Documents",
      value: stats.uploadedDocuments,
      icon: FolderCopy,
      color: "#ed6c02",
    },
  ];

  const quickActions = [
    { title: "Book / View Appointments", path: ROUTES.PATIENT_APPOINTMENTS },
    { title: "Medical Records", path: ROUTES.PATIENT_MEDICAL_RECORDS },
    { title: "Prescriptions", path: ROUTES.PATIENT_PRESCRIPTIONS },
    { title: "My Documents", path: ROUTES.PATIENT_DOCUMENTS },
  ];

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome, {profile?.fullName ?? ""}
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Here's an overview of your health records.
        </Typography>
      </Stack>

      {nextAppointment && (
        <Alert severity="info" sx={{ mb: 3 }}>
          Your next appointment with Dr. {nextAppointment.doctor?.fullName ?? "—"} is on{" "}
          {new Date(nextAppointment.appointmentTime).toLocaleString()}.
        </Alert>
      )}

      <StatsCards stats={statCards} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid size={{ xs: 12, lg: 8 }}>
          {recentActivity.length > 0 ? (
            <RecentActivity activities={recentActivity} />
          ) : (
            <Alert severity="info">No recent activity yet.</Alert>
          )}
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <QuickActions actions={quickActions} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default PatientDashboard;