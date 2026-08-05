import { useCallback, useEffect, useMemo, useState } from "react";

import notificationService from "@/services/notificationService";

// Normalizes the backend Notification entity into a UI model. Backend
// field is `read` (boolean `isRead` on the entity, serialized as `read`
// by Jackson) — we keep our own name so components never touch the raw
// DTO shape.
const normalize = (raw) => ({
  id: raw.id,
  message: raw.message,
  timestamp: raw.timestamp,
  read: Boolean(raw.read),
});

// `userId` should be the signed-in user's own id (from useMyProfile's
// `myId`), matching what NotificationController checks against the
// authenticated principal.
const useNotifications = (userId) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await notificationService.getUserNotifications(userId);
      setNotifications((data ?? []).map(normalize));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const items = useMemo(
    () =>
      [...notifications].sort(
        (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
      ),
    [notifications]
  );

  const unreadCount = useMemo(
    () => items.filter((n) => !n.read).length,
    [items]
  );

  // Optimistically flips the item locally, then persists via the real
  // PATCH /api/notifications/{id}/read endpoint. Rolls back on failure.
  const markAsRead = useCallback(async (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await notificationService.markNotificationAsRead(id);
    } catch (err) {
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: false } : n))
      );
      setError(err);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;

    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));

    try {
      await Promise.all(
        unread.map((n) => notificationService.markNotificationAsRead(n.id))
      );
    } catch (err) {
      setError(err);
      fetchNotifications();
    }
  }, [notifications, fetchNotifications]);

  return {
    notifications: items,
    unreadCount,
    loading,
    error,
    retry: fetchNotifications,
    markAsRead,
    markAllAsRead,
  };
};

export default useNotifications;