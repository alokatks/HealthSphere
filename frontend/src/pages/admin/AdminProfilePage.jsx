import { Box, Chip, Paper, Stack, Typography } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import useMyProfile from "@/hooks/useMyProfile";

// Backend note: ProfileController#getProfile returns the raw User entity
// for ADMIN accounts (no Patient/Doctor row exists), and
// AuthService#updateUserProfile has no ADMIN branch — it returns the User
// unchanged. There is nothing to edit for an admin account today, so this
// page is intentionally read-only rather than reusing the Patient/Doctor
// edit form.
const AdminProfilePage = () => {
  const { profile, loading, error, retry } = useMyProfile();

  if (loading || !profile) {
    return <TableSkeleton columns={2} rows={4} />;
  }

  if (error) {
    return <ErrorState error={error} onRetry={retry} />;
  }

  return (
    <Box>
      <SectionHeader
        title="My Profile"
        subtitle="Administrator account details"
      />

      <Paper sx={{ p: 3, maxWidth: 480 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="overline" color="text.secondary">
              Email
            </Typography>
            <Typography variant="body1">{profile.email ?? "—"}</Typography>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Role
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip label={profile.role ?? "ADMIN"} color="primary" size="small" />
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">
              Account Status
            </Typography>
            <Box sx={{ mt: 0.5 }}>
              <Chip
                label={profile.active === false ? "Inactive" : "Active"}
                color={profile.active === false ? "default" : "success"}
                size="small"
              />
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary">
            Administrator profile details are managed at the system level and
            cannot be edited here.
          </Typography>
        </Stack>
      </Paper>
    </Box>
  );
};

export default AdminProfilePage;
