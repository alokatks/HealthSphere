import { useEffect, useState, useCallback } from "react";

import { PeopleAlt, LocalHospital, EventAvailable } from "@mui/icons-material";
import { Box, Paper, Grid } from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import StatsCards from "@/components/dashboard/admin/StatsCards";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import reportService from "@/services/reportService";

// Only real backend fields are visualized here: totalPatients, totalDoctors,
// totalAppointments from GET /api/reports/dashboard-stats. No time-series
// data exists on the backend, so no trend-over-time chart is rendered —
// that would require inventing data the backend doesn't provide.
const PIE_COLORS = ["#1976d2", "#2e7d32", "#ed6c02"];

const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await reportService.getDashboardStats();
      setStats(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) {
    return <TableSkeleton columns={3} rows={6} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={fetchStats} />;
  }

  const chartData = [
    { name: "Patients", value: stats?.totalPatients ?? 0 },
    { name: "Doctors", value: stats?.totalDoctors ?? 0 },
    { name: "Appointments", value: stats?.totalAppointments ?? 0 },
  ];

  const statCards = [
    {
      title: "Total Patients",
      value: stats?.totalPatients ?? 0,
      icon: PeopleAlt,
      color: "#1976d2",
    },
    {
      title: "Total Doctors",
      value: stats?.totalDoctors ?? 0,
      icon: LocalHospital,
      color: "#2e7d32",
    },
    {
      title: "Total Appointments",
      value: stats?.totalAppointments ?? 0,
      icon: EventAvailable,
      color: "#ed6c02",
    },
  ];

  return (
    <Box>
      <SectionHeader
        title="Reports"
        subtitle="Platform-wide statistics from live backend data"
      />

      <Box sx={{ mb: 3 }}>
        <StatsCards stats={statCards} />
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 7 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Bar dataKey="value" fill="#1976d2" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 5 }}>
          <Paper sx={{ p: 3, borderRadius: 3, height: 380 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;
