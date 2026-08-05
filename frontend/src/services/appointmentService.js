import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const bookAppointment = async ({ patientId, doctorId, appointmentTime, mode }) => {
  const response = await api.post(API_ENDPOINTS.APPOINTMENT.BOOK, {
    patientId,
    doctorId,
    appointmentTime,
    mode,
  });

  return response.data;
};

const getAppointmentsByPatient = async (patientId) => {
  const response = await api.get(
    API_ENDPOINTS.APPOINTMENT.BY_PATIENT(patientId)
  );

  return response.data;
};

const getAppointmentsByDoctor = async (doctorId) => {
  const response = await api.get(
    API_ENDPOINTS.APPOINTMENT.BY_DOCTOR(doctorId)
  );

  return response.data;
};

const cancelAppointment = async (appointmentId) => {
  const response = await api.put(
    API_ENDPOINTS.APPOINTMENT.CANCEL(appointmentId)
  );

  return response.data;
};

// Backend: PUT /api/appointments/{id}/telehealth-link (hasRole('DOCTOR')),
// only the doctor on the appointment may call this.
const setTelehealthLink = async (appointmentId, telehealthLink) => {
  const response = await api.put(
    API_ENDPOINTS.APPOINTMENT.SET_TELEHEALTH_LINK(appointmentId),
    { telehealthLink }
  );

  return response.data;
};

const appointmentService = {
  bookAppointment,
  getAppointmentsByPatient,
  getAppointmentsByDoctor,
  cancelAppointment,
  setTelehealthLink,
};

export default appointmentService;
