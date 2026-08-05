import { useState } from "react";
import { toast } from "react-toastify";

import { Box, Paper } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import AppointmentsToolbar from "@/components/appointments/AppointmentsToolbar";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import SetTelehealthLinkDialog from "@/components/appointments/SetTelehealthLinkDialog";
import CreateEHRDialog from "@/components/ehr/CreateEHRDialog";
import CreatePrescriptionDialog from "@/components/prescriptions/CreatePrescriptionDialog";

import useMyProfile from "@/hooks/useMyProfile";
import useAppointments from "@/hooks/useAppointments";
import ehrService from "@/services/ehrService";
import appointmentService from "@/services/appointmentService";
import prescriptionService from "@/services/prescriptionService";

const DoctorAppointmentsPage = () => {
  const { myId, loading: profileLoading, error: profileError, retry: retryProfile } =
    useMyProfile();

  const {
    appointments,
    loading,
    error,
    status,
    setStatus,
    page,
    setPage,
    totalCount,
    pageSize,
    cancelling,
    cancelAppointment,
    retry,
  } = useAppointments({ role: "DOCTOR", ownerId: myId });

  // Appointment pending a cancel confirmation.
  const [cancelTarget, setCancelTarget] = useState(null);

  // Appointment currently selected for adding a medical record.
  const [recordTarget, setRecordTarget] = useState(null);
  const [creatingRecord, setCreatingRecord] = useState(false);

  // Appointment currently selected for writing a prescription.
  const [prescriptionTarget, setPrescriptionTarget] = useState(null);
  const [creatingPrescription, setCreatingPrescription] = useState(false);

  // Appointment currently selected for adding/editing a telehealth link.
  const [linkTarget, setLinkTarget] = useState(null);
  const [savingLink, setSavingLink] = useState(false);

  const handleCreateRecord = async (data) => {
    setCreatingRecord(true);
    try {
      await ehrService.createEHR(data);
      toast.success("Medical record added.");
      setRecordTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add medical record.");
    } finally {
      setCreatingRecord(false);
    }
  };

  const handleCreatePrescription = async (data) => {
    setCreatingPrescription(true);
    try {
      await prescriptionService.createPrescription(data);
      toast.success("Prescription added.");
      setPrescriptionTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add prescription.");
    } finally {
      setCreatingPrescription(false);
    }
  };

  const handleCancelConfirm = async () => {
    if (!cancelTarget) return;
    try {
      await cancelAppointment(cancelTarget.id);
      toast.success("Appointment canceled.");
      setCancelTarget(null);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel appointment.");
    }
  };

  const handleSetTelehealthLink = async ({ telehealthLink }) => {
    if (!linkTarget) return;
    setSavingLink(true);
    try {
      await appointmentService.setTelehealthLink(linkTarget.id, telehealthLink);
      toast.success("Meeting link saved.");
      setLinkTarget(null);
      await retry();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save meeting link.");
    } finally {
      setSavingLink(false);
    }
  };

  const isLoading = profileLoading || loading;
  const combinedError = profileError || error;

  return (
    <Box>
      <SectionHeader
        title="My Appointments"
        subtitle="View and manage appointments booked with you."
      />

      <Paper sx={{ p: 3 }}>
        <AppointmentsToolbar
          status={status}
          onStatusChange={setStatus}
          onReset={() => setStatus("ALL")}
        />

        {isLoading ? (
          <TableSkeleton columns={6} rows={6} />
        ) : combinedError ? (
          <ErrorState error={combinedError} onRetry={profileError ? retryProfile : retry} />
        ) : appointments.length === 0 ? (
          <EmptyState
            title="No Appointments Found"
            description="No appointments match your current filters."
          />
        ) : (
          <AppointmentsTable
            appointments={appointments}
            viewerRole="DOCTOR"
            onCancel={setCancelTarget}
            cancelling={cancelling}
            onAddRecord={setRecordTarget}
            onAddPrescription={setPrescriptionTarget}
            onSetTelehealthLink={setLinkTarget}
            page={page}
            totalCount={totalCount}
            pageSize={pageSize}
            onPageChange={setPage}
          />
        )}
      </Paper>

      <ConfirmDialog
        open={!!cancelTarget}
        title="Cancel Appointment"
        description={`Cancel the appointment with ${cancelTarget?.patientName}? This cannot be undone.`}
        confirmText="Cancel Appointment"
        confirmColor="error"
        loading={cancelling === cancelTarget?.id}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelTarget(null)}
      />

      <CreateEHRDialog
        open={!!recordTarget}
        onClose={() => setRecordTarget(null)}
        onSubmit={handleCreateRecord}
        submitting={creatingRecord}
        patientId={recordTarget?.patientId}
        doctorId={recordTarget?.doctorId}
        patientName={recordTarget?.patientName}
      />

      <CreatePrescriptionDialog
        open={!!prescriptionTarget}
        onClose={() => setPrescriptionTarget(null)}
        onSubmit={handleCreatePrescription}
        submitting={creatingPrescription}
        patientId={prescriptionTarget?.patientId}
        doctorId={prescriptionTarget?.doctorId}
        patientName={prescriptionTarget?.patientName}
      />

      <SetTelehealthLinkDialog
        open={!!linkTarget}
        onClose={() => setLinkTarget(null)}
        onSubmit={handleSetTelehealthLink}
        submitting={savingLink}
        patientName={linkTarget?.patientName}
        currentLink={linkTarget?.telehealthLink}
      />
    </Box>
  );
};

export default DoctorAppointmentsPage;