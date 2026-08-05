import { Alert, Box, Paper } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import PrescriptionsList from "@/components/prescriptions/PrescriptionsList";

import useMyProfile from "@/hooks/useMyProfile";
import usePrescriptions from "@/hooks/usePrescriptions";

const DoctorPrescriptionsPage = () => {
  const { myId, loading: profileLoading, error: profileError, retry: retryProfile } =
    useMyProfile();

  const { prescriptions, loading, error, retry } = usePrescriptions({
    role: "DOCTOR",
    ownerId: myId,
  });

  const isLoading = profileLoading || loading;
  const combinedError = profileError || error;

  return (
    <Box>
      <SectionHeader
        title="Prescriptions"
        subtitle="Prescriptions you've written for your patients."
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        To write a new prescription, open the <strong>Appointments</strong>{" "}
        page and use "Prescribe" on the relevant appointment.
      </Alert>

      <Paper sx={{ p: 3 }}>
        {isLoading ? (
          <TableSkeleton columns={4} rows={4} />
        ) : combinedError ? (
          <ErrorState error={combinedError} onRetry={profileError ? retryProfile : retry} />
        ) : prescriptions.length === 0 ? (
          <EmptyState
            title="No Prescriptions Found"
            description="You haven't written any prescriptions yet."
          />
        ) : (
          <PrescriptionsList prescriptions={prescriptions} viewerRole="DOCTOR" />
        )}
      </Paper>
    </Box>
  );
};

export default DoctorPrescriptionsPage;
