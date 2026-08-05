import {
  EventAvailable,
  Medication,
  People,
  Today,
} from "@mui/icons-material";

import { Alert, Box, Grid, Stack, Typography } from "@mui/material";

import StatsCards from "@/components/dashboard/admin/StatsCards";
import RecentActivity from "@/components/dashboard/admin/RecentActivity";
import QuickActions from "@/components/dashboard/admin/QuickActions";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import useMyProfile from "@/hooks/useMyProfile";
import useDoctorDashboard from "@/hooks/useDoctorDashboard";
import ROUTES from "@/constants/routes";

const DoctorDashboard = () => {
  const {
    profile,
    myId,
    loading: profileLoading,
    error: profileError,
    retry: retryProfile,
  } = useMyProfile();

  const { stats, recentActivity, loading, error, retry } = useDoctorDashboard(myId);

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

  const isPendingVerification = profile?.user?.status !== "VERIFIED";

  const statCards = [
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: EventAvailable,
      color: "#1976d2",
    },
    {
      title: "Today's Appointments",
      value: stats.todaysAppointments,
      icon: Today,
      color: "#ed6c02",
    },
    {
      title: "My Patients",
      value: stats.totalPatients,
      icon: People,
      color: "#2e7d32",
    },
    {
      title: "Prescriptions Issued",
      value: stats.totalPrescriptions,
      icon: Medication,
      color: "#9c27b0",
    },
  ];

  const quickActions = [
    { title: "My Appointments", path: ROUTES.DOCTOR_APPOINTMENTS },
    { title: "Medical Records", path: ROUTES.DOCTOR_RECORDS },
    { title: "Prescriptions", path: ROUTES.DOCTOR_PRESCRIPTIONS },
    { title: "My Profile", path: ROUTES.DOCTOR_PROFILE },
  ];

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome, Dr. {profile?.fullName ?? ""}
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Here's an overview of your practice.
        </Typography>
      </Stack>

      {isPendingVerification && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Your account is pending verification by an administrator. Some
          features may be limited until your credentials are verified.
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

export default DoctorDashboard;