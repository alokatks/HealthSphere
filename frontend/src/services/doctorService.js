import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

// Backend: POST /api/files/upload-certificate/{doctorId} (FileUploadController).
// @PreAuthorize hasRole('DOCTOR'), and the controller additionally checks
// the authenticated user's email matches doctorOpt.get().getUser().getEmail()
// — a doctor can only upload their own certificate. Returns the updated
// Doctor entity (same shape as GET /api/profile for a doctor).
const uploadCertificate = async (doctorId, formData) => {
  const response = await api.post(
    API_ENDPOINTS.DOCTOR.UPLOAD_CERTIFICATE(doctorId),
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};

// Backend: GET /api/doctors (DoctorController), @PreAuthorize hasRole('PATIENT').
// Returns verified doctors only (status === "VERIFIED"), as raw Doctor
// entities: { id, fullName, specialization, clinicName, yearsOfExperience, ... }.
const getAvailableDoctors = async () => {
  const response = await api.get(API_ENDPOINTS.DOCTOR.AVAILABLE);

  return response.data;
};

const doctorService = {
  uploadCertificate,
  getAvailableDoctors,
};

export default doctorService;