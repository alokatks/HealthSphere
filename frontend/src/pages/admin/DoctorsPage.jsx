import { useState } from "react";
import { toast } from "react-toastify";

import { Box, Paper } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import DoctorsToolbar from "@/components/doctors/DoctorsToolbar";
import DoctorsTable from "@/components/doctors/DoctorsTable";
import DoctorDetailsDialog from "@/components/doctors/DoctorDetailsDialog";

import useDoctors from "@/hooks/useDoctors";

const DoctorsPage = () => {
  const {
    doctors,
    loading,
    error,
    search,
    setSearch,
    status,
    setStatus,
    sortBy,
    sortOrder,
    toggleSort,
    resetFilters,
    page,
    setPage,
    totalCount,
    pageSize,
    verifying,
    verifyDoctor,
    retry,
  } = useDoctors();

  // Doctor being previewed in the read-only details dialog.
  const [viewTarget, setViewTarget] = useState(null);

  // Doctor pending a verify confirmation.
  const [verifyTarget, setVerifyTarget] = useState(null);

  const handleView = (doctor) => setViewTarget(doctor);
  const handleVerifyRequest = (doctor) => setVerifyTarget(doctor);

  const handleVerifyConfirm = async () => {
    if (!verifyTarget) return;
    try {
      await verifyDoctor(verifyTarget.id);
      toast.success(`${verifyTarget.name} has been verified.`);
      setVerifyTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to verify doctor.");
    }
  };

  return (
    <Box>
      <SectionHeader
        title="Doctors"
        subtitle="Review registered doctors and verify pending accounts."
      />

      <Paper sx={{ p: 3 }}>
        <DoctorsToolbar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatusChange={setStatus}
          onReset={resetFilters}
        />

        {loading ? (
          <TableSkeleton columns={8} rows={8} />
        ) : error ? (
          <ErrorState error={error} onRetry={retry} />
        ) : doctors.length === 0 ? (
          <EmptyState
            title="No Doctors Found"
            description="No doctors match your current filters."
          />
        ) : (
          <DoctorsTable
            doctors={doctors}
            onView={handleView}
            onVerify={handleVerifyRequest}
            verifying={verifying}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={toggleSort}
            page={page}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </Paper>

      <DoctorDetailsDialog
        doctor={viewTarget}
        open={!!viewTarget}
        onClose={() => setViewTarget(null)}
      />

      <ConfirmDialog
        open={!!verifyTarget}
        title="Verify Doctor"
        description={`Verify ${verifyTarget?.name}'s account? This confirms their license and credentials are valid.`}
        confirmText="Verify"
        confirmColor="success"
        loading={verifying === verifyTarget?.id}
        onConfirm={handleVerifyConfirm}
        onClose={() => setVerifyTarget(null)}
      />
    </Box>
  );
};

export default DoctorsPage;
