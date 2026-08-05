import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { Box, Paper } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import PatientsToolbar from "@/components/patients/PatientsToolbar";
import PatientsTable from "@/components/patients/PatientsTable";

import usePatients from "@/hooks/usePatients";
import ROUTES from "@/constants/routes";

const PatientsPage = () => {
  const navigate = useNavigate();

  const {
    patients,
    loading,
    error,
    search,
    setSearch,
    gender,
    setGender,
    sortBy,
    sortOrder,
    toggleSort,
    resetFilters,
    page,
    setPage,
    totalCount,
    pageSize,
    statusUpdating,
    toggleStatus,
    retry,
  } = usePatients();

  // Holds the patient pending a status change, so the confirm dialog knows
  // what it's confirming and what the next state should be.
  const [statusTarget, setStatusTarget] = useState(null);

  const handleView = (patient) => navigate(ROUTES.ADMIN_PATIENT_DETAILS(patient.id));
  const handleEdit = (patient) => navigate(ROUTES.ADMIN_PATIENT_EDIT(patient.id));

  const handleToggleStatusRequest = (patient) => setStatusTarget(patient);

  const handleToggleStatusConfirm = async () => {
    if (!statusTarget) return;
    try {
      await toggleStatus(statusTarget.id, !statusTarget.active);
      toast.success(
        statusTarget.active ? "Patient deactivated." : "Patient activated."
      );
      setStatusTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update patient status.");
    }
  };

  return (
    <Box>
      <SectionHeader title="Patients" subtitle="Manage registered patients." />

      <Paper sx={{ p: 3 }}>
        <PatientsToolbar
          search={search}
          onSearch={setSearch}
          gender={gender}
          onGenderChange={setGender}
          onReset={resetFilters}
        />

        {loading ? (
          <TableSkeleton columns={7} rows={8} />
        ) : error ? (
          <ErrorState error={error} onRetry={retry} />
        ) : patients.length === 0 ? (
          <EmptyState
            title="No Patients Found"
            description="No patients match your current filters."
          />
        ) : (
          <PatientsTable
            patients={patients}
            onView={handleView}
            onEdit={handleEdit}
            onToggleStatus={handleToggleStatusRequest}
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

      <ConfirmDialog
        open={!!statusTarget}
        title={statusTarget?.active ? "Deactivate Patient" : "Activate Patient"}
        description={
          statusTarget?.active
            ? `Deactivate ${statusTarget?.name}'s account? They will no longer be able to sign in, but their medical records are retained.`
            : `Reactivate ${statusTarget?.name}'s account?`
        }
        confirmText={statusTarget?.active ? "Deactivate" : "Activate"}
        confirmColor={statusTarget?.active ? "error" : "success"}
        loading={statusUpdating === statusTarget?.id}
        onConfirm={handleToggleStatusConfirm}
        onClose={() => setStatusTarget(null)}
      />
    </Box>
  );
};

export default PatientsPage;
