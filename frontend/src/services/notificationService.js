import api from "@/services/api/axiosInstance";
import API_ENDPOINTS from "@/constants/apiEndpoints";

// Backend verified endpoint: GET /api/notifications/user/{userId}
// (NotificationController.java — @PreAuthorize hasAnyRole('PATIENT','DOCTOR'))
// Returns List<Notification>: [{ id, user, message, timestamp, read }]
const getUserNotifications = async (userId) => {
  const response = await api.get(API_ENDPOINTS.NOTIFICATION.USER(userId));

  return response.data;
};

// Backend verified endpoint: PATCH /api/notifications/{id}/read
// (NotificationController.java — @PreAuthorize hasAnyRole('PATIENT','DOCTOR'))
// Returns the updated Notification.
const markNotificationAsRead = async (notificationId) => {
  const response = await api.patch(API_ENDPOINTS.NOTIFICATION.MARK_READ(notificationId));

  return response.data;
};

const notificationService = {
  getUserNotifications,
  markNotificationAsRead,
};

export default notificationService;