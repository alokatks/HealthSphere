import { useCallback, useEffect, useState } from "react";

import profileService from "@/services/profileService";

// Backend returns the Patient or Doctor entity directly (id === user id,
// via @MapsId), or the raw User for an Admin. We only need `id` here.
//
// `enabled` lets callers (e.g. NotificationContext, which is mounted above
// the route guards) skip the fetch entirely when there's no signed-in user
// yet, instead of firing a doomed request against a public page.
const useMyProfile = (enabled = true) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProfile = useCallback(async () => {
    if (!enabled) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  useEffect(() => {
    if (!enabled) {
      setProfile(null);
    }
  }, [enabled]);

  // Sends only the fields the backend's ProfileUpdateDto accepts. The
  // caller (ProfilePage) is responsible for shaping `payload` to that DTO.
  const updateProfile = useCallback(async (payload) => {
    setSaving(true);

    try {
      const updated = await profileService.updateProfile(payload);
      setProfile(updated);
      return updated;
    } finally {
      setSaving(false);
    }
  }, []);

  return {
    profile,
    myId: profile?.id ?? null,
    loading,
    error,
    saving,
    retry: fetchProfile,
    updateProfile,
  };
};

export default useMyProfile;