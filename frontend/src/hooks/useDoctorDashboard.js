import { useCallback, useEffect, useMemo, useState } from "react";

import appointmentService from "@/services/appointmentService";
import prescriptionService from "@/services/prescriptionService";
import ehrService from "@/services/ehrService";
import APPOINTMENT_STATUS from "@/constants/appointmentStatus";

// This hook intentionally bypasses the paginated table hooks
// (useAppointments/usePrescriptions/useEHR) and calls the underlying
// services directly — the dashboard needs full, unpaginated data to
// compute accurate stats (today's count, unique patients, etc.),
// whereas the table hooks only expose the current page.
//
// All three backend calls below are the SAME verified endpoints already
// used by DoctorAppointmentsPage / DoctorPrescriptionsPage / DoctorRecordsPage:
// GET /api/appointments/doctor/{doctorId}
// GET /api/prescriptions/doctor/{doctorId}
// GET /api/ehr/doctor/{doctorId}
const isSameDay = (isoString, reference) => {
  if (!isoString) return false;
  const date = new Date(isoString);
  return (
    date.getFullYear() === reference.getFullYear() &&
    date.getMonth() === reference.getMonth() &&
    date.getDate() === reference.getDate()
  );
};

const useDoctorDashboard = (doctorId) => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [records, setRecords] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!doctorId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [appointmentsRes, prescriptionsRes, recordsRes] = await Promise.all([
        appointmentService.getAppointmentsByDoctor(doctorId),
        prescriptionService.getPrescriptionsByDoctor(doctorId),
        ehrService.getRecordsByDoctor(doctorId),
      ]);

      setAppointments(appointmentsRes ?? []);
      setPrescriptions(prescriptionsRes ?? []);
      setRecords(recordsRes ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = useMemo(() => {
    const today = new Date();

    const activeAppointments = appointments.filter(
      (a) => a.status !== APPOINTMENT_STATUS.CANCELED
    );

    const todaysAppointments = activeAppointments.filter((a) =>
      isSameDay(a.appointmentTime, today)
    );

    const uniquePatientIds = new Set(
      appointments.map((a) => a.patient?.id).filter(Boolean)
    );

    return {
      totalAppointments: appointments.length,
      todaysAppointments: todaysAppointments.length,
      totalPatients: uniquePatientIds.size,
      totalPrescriptions: prescriptions.length,
    };
  }, [appointments, prescriptions]);

  const recentActivity = useMemo(() => {
    const appointmentEvents = appointments.map((a) => ({
      title: `Appointment with ${a.patient?.fullName ?? "a patient"} — ${
        a.status === APPOINTMENT_STATUS.CANCELED ? "canceled" : "scheduled"
      }`,
      timestamp: a.appointmentTime,
    }));

    const prescriptionEvents = prescriptions.map((p) => ({
      title: `Prescription issued to ${p.patient?.fullName ?? "a patient"}`,
      timestamp: p.prescriptionDate,
    }));

    const recordEvents = records.map((r) => ({
      title: `Medical record added for ${r.patient?.fullName ?? "a patient"}`,
      timestamp: r.visitDate,
    }));

    return [...appointmentEvents, ...prescriptionEvents, ...recordEvents]
      .filter((event) => event.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 6)
      .map((event) => ({
        title: event.title,
        time: new Date(event.timestamp).toLocaleDateString(),
      }));
  }, [appointments, prescriptions, records]);

  return {
    stats,
    recentActivity,
    loading,
    error,
    retry: fetchAll,
  };
};

export default useDoctorDashboard;