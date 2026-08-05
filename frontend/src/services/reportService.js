import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

// Backend: GET /api/reports/dashboard-stats (ReportController, @PreAuthorize
// hasRole('ADMIN')). Returns Map<String, Long> with exactly three keys:
// totalAppointments, totalPatients, totalDoctors. Do not assume any other
// keys exist — the backend does not compute prescriptions/records counts
// here.
const getDashboardStats = async () => {
  const response = await api.get(API_ENDPOINTS.REPORT.DASHBOARD_STATS);

  return response.data;
};

const reportService = {
  getDashboardStats,
};

export default reportService;
