import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const createPrescription = async ({ patientId, doctorId, medication, dosage, instructions }) => {
  const response = await api.post(API_ENDPOINTS.PRESCRIPTION.CREATE, {
    patientId,
    doctorId,
    medication,
    dosage,
    instructions,
  });

  return response.data;
};

const getPrescriptionsByPatient = async (patientId) => {
  const response = await api.get(API_ENDPOINTS.PRESCRIPTION.BY_PATIENT(patientId));

  return response.data;
};

const getPrescriptionsByDoctor = async (doctorId) => {
  const response = await api.get(API_ENDPOINTS.PRESCRIPTION.BY_DOCTOR(doctorId));

  return response.data;
};

const prescriptionService = {
  createPrescription,
  getPrescriptionsByPatient,
  getPrescriptionsByDoctor,
};

export default prescriptionService;
