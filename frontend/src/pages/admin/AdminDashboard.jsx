import { PeopleAlt, LocalHospital, EventAvailable } from "@mui/icons-material";

import { Alert, Box, Grid, Stack, Typography } from "@mui/material";

import DashboardNotice from "@/components/dashboard/admin/DashboardNotice";
import RecentActivity from "@/components/dashboard/admin/RecentActivity";
import QuickActions from "@/components/dashboard/admin/QuickActions";
import StatsCards from "@/components/dashboard/admin/StatsCards";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import useAdminDashboard from "@/hooks/useAdminDashboard";
import ROUTES from "@/constants/routes";

const AdminDashboard = () => {
  const { stats, recentActivity, loading, error, retry } = useAdminDashboard();

  if (loading) {
    return <TableSkeleton columns={4} rows={5} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  // Backend (GET /api/reports/dashboard-stats) only provides these three
  // counts. There is no "active prescriptions" total on the backend, so
  // that placeholder card has been removed rather than left fake.
  const statCards = [
    {
      title: "Total Patients",
      value: stats.totalPatients,
      icon: PeopleAlt,
      color: "#1976d2",
    },
    {
      title: "Doctors",
      value: stats.totalDoctors,
      icon: LocalHospital,
      color: "#2e7d32",
    },
    {
      title: "Total Appointments",
      value: stats.totalAppointments,
      icon: EventAvailable,
      color: "#ed6c02",
    },
  ];

  const quickActions = [
    {
      title: "Manage Patients",
      path: ROUTES.ADMIN_PATIENTS,
    },
    {
      title: "Manage Doctors",
      path: ROUTES.ADMIN_DOCTORS,
    },
    {
      title: "Reports",
      path: ROUTES.ADMIN_REPORTS,
    },
    {
      title: "My Profile",
      path: ROUTES.ADMIN_PROFILE,
    },
  ];

  return (
    <Box>
      <Stack spacing={1} sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Welcome, Admin
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          Here's an overview of your healthcare platform.
        </Typography>
      </Stack>

      <StatsCards stats={statCards} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        <Grid
          size={{
            xs: 12,
            lg: 8,
          }}
        >
          {recentActivity.length > 0 ? (
            <RecentActivity activities={recentActivity} />
          ) : (
            <Alert severity="info">No recent activity yet.</Alert>
          )}
        </Grid>

        <Grid
          size={{
            xs: 12,
            lg: 4,
          }}
        >
          <QuickActions actions={quickActions} />
        </Grid>
      </Grid>

      <Box sx={{ mt: 3 }}>
        <DashboardNotice />
      </Box>
    </Box>
  );
};

export default AdminDashboard;
