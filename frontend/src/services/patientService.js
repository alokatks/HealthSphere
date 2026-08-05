import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const uploadReport = async (formData) => {
  const response = await api.post(
    API_ENDPOINTS.PATIENT.UPLOAD_REPORT,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

const getReports = async (patientId) => {
  const response = await api.get(
    API_ENDPOINTS.PATIENT.REPORTS(patientId)
  );

  return response.data;
};

const patientService = {
  uploadReport,
  getReports,
};

export default patientService;