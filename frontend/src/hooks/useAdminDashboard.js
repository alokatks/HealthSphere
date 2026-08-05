import { useCallback, useEffect, useMemo, useState } from "react";

import reportService from "@/services/reportService";
import adminService from "@/services/adminService";

// Backend-verified sources only:
// - GET /api/reports/dashboard-stats -> { totalAppointments, totalPatients, totalDoctors }
// - GET /api/admin/logs -> List<SecurityLog> { userEmail, timestamp, eventType, details }
//
// There is no backend endpoint for "active prescriptions" totals or for a
// pre-built admin activity feed, so recent activity is derived from the
// real SecurityLog table instead of being invented.
const eventTypeToLabel = (log) => {
  switch (log.eventType) {
    case "LOGIN_SUCCESS":
      return `${log.userEmail ?? "A user"} signed in`;
    case "LOGIN_FAILURE":
      return `Failed sign-in attempt for ${log.userEmail ?? "unknown user"}`;
    default:
      return log.details || log.eventType || "System event";
  }
};

const useAdminDashboard = () => {
  const [stats, setStats] = useState({
    totalAppointments: 0,
    totalPatients: 0,
    totalDoctors: 0,
  });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsRes, logsRes] = await Promise.all([
        reportService.getDashboardStats(),
        adminService.getSecurityLogs(),
      ]);

      setStats({
        totalAppointments: statsRes?.totalAppointments ?? 0,
        totalPatients: statsRes?.totalPatients ?? 0,
        totalDoctors: statsRes?.totalDoctors ?? 0,
      });
      setLogs(logsRes ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const recentActivity = useMemo(() => {
    return [...logs]
      .filter((log) => log.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 6)
      .map((log) => ({
        title: eventTypeToLabel(log),
        time: new Date(log.timestamp).toLocaleString(),
      }));
  }, [logs]);

  return {
    stats,
    recentActivity,
    loading,
    error,
    retry: fetchAll,
  };
};

export default useAdminDashboard;