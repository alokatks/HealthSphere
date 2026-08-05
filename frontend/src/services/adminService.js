import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const getPatients = async () => {
  const response = await api.get(
    API_ENDPOINTS.ADMIN.PATIENTS
  );

  return response.data;
};

const getPatientById = async (patientId) => {
  const response = await api.get(
    API_ENDPOINTS.ADMIN.PATIENT(patientId)
  );

  return response.data;
};

const updatePatient = async (patientId, patientData) => {
  const response = await api.put(
    API_ENDPOINTS.ADMIN.UPDATE_PATIENT(patientId),
    patientData
  );

  return response.data;
};

const updatePatientStatus = async (
  patientId,
  active
) => {
  const response = await api.patch(
    API_ENDPOINTS.ADMIN.UPDATE_PATIENT_STATUS(patientId),
    {
      active,
    }
  );

  return response.data;
};

const getDoctors = async () => {
  const response = await api.get(
    API_ENDPOINTS.ADMIN.DOCTORS
  );

  return response.data;
};

const verifyDoctor = async (doctorId) => {
  const response = await api.post(
    API_ENDPOINTS.ADMIN.VERIFY_DOCTOR(doctorId)
  );

  return response.data;
};

const getSecurityLogs = async () => {
  const response = await api.get(
    API_ENDPOINTS.ADMIN.SECURITY_LOGS
  );

  return response.data;
};

const adminService = {
  getPatients,
  getPatientById,
  updatePatient,
  updatePatientStatus,
  getDoctors,
  verifyDoctor,
  getSecurityLogs,
};

export default adminService;