import { useCallback, useEffect, useMemo, useState } from "react";

import appointmentService from "@/services/appointmentService";
import PAGINATION from "@/constants/pagination";

// Backend Appointment shape: { id, patient: {...}, doctor: {...},
// appointmentTime, status, mode, telehealthLink }. We flatten the nested
// patient/doctor names for display without exposing raw backend DTO naming
// to the UI.
const normalizeAppointment = (appointment) => ({
  id: appointment.id,
  patientId: appointment.patient?.id,
  doctorId: appointment.doctor?.id,
  patientName: appointment.patient?.fullName,
  doctorName: appointment.doctor?.fullName,
  specialization: appointment.doctor?.specialization,
  clinicName: appointment.doctor?.clinicName,
  appointmentTime: appointment.appointmentTime,
  status: appointment.status,
  mode: appointment.mode,
  telehealthLink: appointment.telehealthLink,
});

// `role` is "PATIENT" or "DOCTOR" — determines which endpoint is called.
const useAppointments = ({ role, ownerId }) => {
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [status, setStatus] = useState("ALL");
  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);

  // Tracks which appointment a cancel request is in flight for.
  const [cancelling, setCancelling] = useState(null);

  const fetchAppointments = useCallback(async () => {
    if (!ownerId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response =
        role === "DOCTOR"
          ? await appointmentService.getAppointmentsByDoctor(ownerId)
          : await appointmentService.getAppointmentsByPatient(ownerId);

      setAppointments(response.map(normalizeAppointment));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role, ownerId]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const cancelAppointment = useCallback(
    async (appointmentId) => {
      setCancelling(appointmentId);
      try {
        await appointmentService.cancelAppointment(appointmentId);
        await fetchAppointments();
      } finally {
        setCancelling(null);
      }
    },
    [fetchAppointments]
  );

  const filteredAppointments = useMemo(() => {
    let data = [...appointments];

    if (status !== "ALL") {
      data = data.filter((appointment) => appointment.status === status);
    }

    data.sort(
      (a, b) => new Date(b.appointmentTime) - new Date(a.appointmentTime)
    );

    return data;
  }, [appointments, status]);

  const totalCount = filteredAppointments.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGINATION.PAGE_SIZE));

  const paginatedAppointments = useMemo(() => {
    const start = (page - 1) * PAGINATION.PAGE_SIZE;

    return filteredAppointments.slice(start, start + PAGINATION.PAGE_SIZE);
  }, [filteredAppointments, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  return {
    appointments: paginatedAppointments,

    loading,
    error,

    status,
    setStatus,

    page,
    setPage,
    totalPages,
    totalCount,
    pageSize: PAGINATION.PAGE_SIZE,

    cancelling,
    cancelAppointment,

    retry: fetchAppointments,
  };
};

export default useAppointments;
