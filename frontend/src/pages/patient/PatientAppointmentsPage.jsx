import { useState } from "react";
import { toast } from "react-toastify";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import { Box, Button, Paper, Stack } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";
import ConfirmDialog from "@/components/common/ConfirmDialog";

import AppointmentsToolbar from "@/components/appointments/AppointmentsToolbar";
import AppointmentsTable from "@/components/appointments/AppointmentsTable";
import BookAppointmentDialog from "@/components/appointments/BookAppointmentDialog";

import useMyProfile from "@/hooks/useMyProfile";
import useAppointments from "@/hooks/useAppointments";
import useAvailableDoctors from "@/hooks/useAvailableDoctors";

import appointmentService from "@/services/appointmentService";

const PatientAppointmentsPage = () => {
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
  } = useAppointments({ role: "PATIENT", ownerId: myId });

  const {
    doctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useAvailableDoctors();

  // Appointment pending a cancel confirmation.
  const [cancelTarget, setCancelTarget] = useState(null);

  // Book Appointment dialog open/submitting state.
  const [bookDialogOpen, setBookDialogOpen] = useState(false);
  const [booking, setBooking] = useState(false);

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

  const handleBookSubmit = async ({ doctorId, appointmentTime, mode }) => {
    setBooking(true);
    try {
      // datetime-local inputs omit seconds ("YYYY-MM-DDTHH:mm"); pad it so
      // it parses cleanly against the backend's LocalDateTime field.
      const normalizedTime =
        appointmentTime.length === 16 ? `${appointmentTime}:00` : appointmentTime;

      await appointmentService.bookAppointment({
        patientId: myId,
        doctorId,
        appointmentTime: normalizedTime,
        mode,
      });

      toast.success("Appointment booked.");
      setBookDialogOpen(false);
      await retry();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to book appointment.");
    } finally {
      setBooking(false);
    }
  };

  const isLoading = profileLoading || loading;
  const combinedError = profileError || error;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ alignItems: { sm: "center" }, justifyContent: "space-between" }}
      >
        <SectionHeader
          title="My Appointments"
          subtitle="View and manage your upcoming and past appointments."
        />

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => setBookDialogOpen(true)}
          disabled={!myId}
          sx={{ whiteSpace: "nowrap" }}
        >
          Book Appointment
        </Button>
      </Stack>

      <Paper sx={{ p: 3, mt: 3 }}>
        <AppointmentsToolbar
          status={status}
          onStatusChange={setStatus}
          onReset={() => setStatus("ALL")}
        />

        {isLoading ? (
          <TableSkeleton columns={7} rows={6} />
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
            viewerRole="PATIENT"
            onCancel={setCancelTarget}
            cancelling={cancelling}
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
        description={`Cancel your appointment with Dr. ${cancelTarget?.doctorName}? This cannot be undone.`}
        confirmText="Cancel Appointment"
        confirmColor="error"
        loading={cancelling === cancelTarget?.id}
        onConfirm={handleCancelConfirm}
        onClose={() => setCancelTarget(null)}
      />

      <BookAppointmentDialog
        open={bookDialogOpen}
        onClose={() => setBookDialogOpen(false)}
        onSubmit={handleBookSubmit}
        submitting={booking}
        doctors={doctors}
        doctorsLoading={doctorsLoading}
        doctorsError={doctorsError}
      />
    </Box>
  );
};

export default PatientAppointmentsPage;
