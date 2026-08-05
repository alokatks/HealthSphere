import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

const getProfile = async () => {
  const response = await api.get(API_ENDPOINTS.PROFILE.GET);

  return response.data;
};

// Backend: PUT /api/profile/update, body = ProfileUpdateDto, returns the
// updated Patient/Doctor/User entity (same shape as getProfile()).
const updateProfile = async (payload) => {
  const response = await api.put(API_ENDPOINTS.PROFILE.UPDATE, payload);

  return response.data;
};

const profileService = {
  getProfile,
  updateProfile,
};

export default profileService;