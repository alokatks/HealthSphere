import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const createEHR = async ({
  patientId,
  doctorId,
  visitDate,
  diagnosis,
  medications,
  labResults,
  notes,
}) => {
  const response = await api.post(API_ENDPOINTS.EHR.CREATE, {
    patientId,
    doctorId,
    visitDate,
    diagnosis,
    medications,
    labResults,
    notes,
  });

  return response.data;
};

const getRecordsByPatient = async (patientId) => {
  const response = await api.get(API_ENDPOINTS.EHR.BY_PATIENT(patientId));

  return response.data;
};

const getRecordsByDoctor = async (doctorId) => {
  const response = await api.get(API_ENDPOINTS.EHR.BY_DOCTOR(doctorId));

  return response.data;
};

const ehrService = {
  createEHR,
  getRecordsByPatient,
  getRecordsByDoctor,
};

export default ehrService;
