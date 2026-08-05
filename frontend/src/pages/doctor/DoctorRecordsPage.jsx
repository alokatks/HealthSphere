import { Alert, Box, Paper } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import EHRRecordsList from "@/components/ehr/EHRRecordsList";

import useMyProfile from "@/hooks/useMyProfile";
import useEHR from "@/hooks/useEHR";

const DoctorRecordsPage = () => {
  const { myId, loading: profileLoading, error: profileError, retry: retryProfile } =
    useMyProfile();

  const { records, loading, error, retry } = useEHR({ role: "DOCTOR", ownerId: myId });

  const isLoading = profileLoading || loading;
  const combinedError = profileError || error;

  return (
    <Box>
      <SectionHeader
        title="Patient Records"
        subtitle="Medical records you've created for your patients."
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        To add a new record, open the{" "}
        <strong>Appointments</strong> page and use "Add Record" on the
        relevant appointment.
      </Alert>

      <Paper sx={{ p: 3 }}>
        {isLoading ? (
          <TableSkeleton columns={4} rows={4} />
        ) : combinedError ? (
          <ErrorState error={combinedError} onRetry={profileError ? retryProfile : retry} />
        ) : records.length === 0 ? (
          <EmptyState
            title="No Records Found"
            description="You haven't added any medical records yet."
          />
        ) : (
          <EHRRecordsList records={records} viewerRole="DOCTOR" />
        )}
      </Paper>
    </Box>
  );
};

export default DoctorRecordsPage;
