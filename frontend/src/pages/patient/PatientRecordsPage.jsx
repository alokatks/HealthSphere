import { Box, Paper } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import EHRRecordsList from "@/components/ehr/EHRRecordsList";

import useMyProfile from "@/hooks/useMyProfile";
import useEHR from "@/hooks/useEHR";

const PatientRecordsPage = () => {
  const { myId, loading: profileLoading, error: profileError, retry: retryProfile } =
    useMyProfile();

  const { records, loading, error, retry } = useEHR({ role: "PATIENT", ownerId: myId });

  const isLoading = profileLoading || loading;
  const combinedError = profileError || error;

  return (
    <Box>
      <SectionHeader
        title="Medical Records"
        subtitle="Your visit history, diagnoses, and prescribed medications."
      />

      <Paper sx={{ p: 3 }}>
        {isLoading ? (
          <TableSkeleton columns={4} rows={4} />
        ) : combinedError ? (
          <ErrorState error={combinedError} onRetry={profileError ? retryProfile : retry} />
        ) : records.length === 0 ? (
          <EmptyState
            title="No Records Found"
            description="You don't have any medical records yet."
          />
        ) : (
          <EHRRecordsList records={records} viewerRole="PATIENT" />
        )}
      </Paper>
    </Box>
  );
};

export default PatientRecordsPage;
