import { createContext, useContext, useMemo } from "react";

import { useAuth } from "@/context/AuthContext";
import useMyProfile from "@/hooks/useMyProfile";
import useNotifications from "@/hooks/useNotifications";
import ROLES from "@/constants/roles";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const { isAuthenticated, role } = useAuth();

  // Backend restricts GET /api/notifications/user/{userId} to
  // hasAnyRole('PATIENT', 'DOCTOR') — Admins have no notifications
  // endpoint at all, so we don't even attempt the fetch for them.
  const eligible =
    isAuthenticated && (role === ROLES.PATIENT || role === ROLES.DOCTOR);

  const { myId } = useMyProfile(eligible);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    retry,
    markAsRead,
    markAllAsRead,
  } = useNotifications(eligible ? myId : null);

  const value = useMemo(
    () => ({
      notifications,
      unreadCount,
      loading,
      error,
      retry,
      markAsRead,
      markAllAsRead,
    }),
    [notifications, unreadCount, loading, error, retry, markAsRead, markAllAsRead]
  );

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

// Context and its consumer hook are intentionally co-located in one file
// (standard pattern) rather than split into a separate hook file just to
// satisfy Fast Refresh's component-only-exports preference.
// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider.");
  }

  return context;
}