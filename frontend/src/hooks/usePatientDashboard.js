import { useCallback, useEffect, useMemo, useState } from "react";

import appointmentService from "@/services/appointmentService";
import prescriptionService from "@/services/prescriptionService";
import ehrService from "@/services/ehrService";
import patientService from "@/services/patientService";
import APPOINTMENT_STATUS from "@/constants/appointmentStatus";

// Bypasses the paginated table hooks (useAppointments/usePrescriptions/
// useEHR/usePatientDocuments) and calls the underlying services directly —
// the dashboard needs full, unpaginated data to compute accurate stats
// (upcoming count, etc.), whereas the table hooks only expose the current
// page.
//
// All four backend calls below are the SAME verified endpoints already
// used by PatientAppointmentsPage / PatientPrescriptionsPage /
// PatientRecordsPage / PatientDocumentsPage:
// GET /api/appointments/patient/{patientId}
// GET /api/prescriptions/patient/{patientId}
// GET /api/ehr/patient/{patientId}
// GET /api/patient/reports/{patientId}
const usePatientDashboard = (patientId) => {
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [records, setRecords] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAll = useCallback(async () => {
    if (!patientId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [appointmentsRes, prescriptionsRes, recordsRes, documentsRes] =
        await Promise.all([
          appointmentService.getAppointmentsByPatient(patientId),
          prescriptionService.getPrescriptionsByPatient(patientId),
          ehrService.getRecordsByPatient(patientId),
          patientService.getReports(patientId),
        ]);

      setAppointments(appointmentsRes ?? []);
      setPrescriptions(prescriptionsRes ?? []);
      setRecords(recordsRes ?? []);
      setDocuments(documentsRes ?? []);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = useMemo(() => {
    const now = new Date();

    const upcomingAppointments = appointments.filter(
      (a) =>
        a.status !== APPOINTMENT_STATUS.CANCELED &&
        a.appointmentTime &&
        new Date(a.appointmentTime) >= now
    );

    return {
      upcomingAppointments: upcomingAppointments.length,
      activePrescriptions: prescriptions.length,
      medicalRecords: records.length,
      uploadedDocuments: documents.length,
    };
  }, [appointments, prescriptions, records, documents]);

  const nextAppointment = useMemo(() => {
    const now = new Date();

    return appointments
      .filter(
        (a) =>
          a.status !== APPOINTMENT_STATUS.CANCELED &&
          a.appointmentTime &&
          new Date(a.appointmentTime) >= now
      )
      .sort((a, b) => new Date(a.appointmentTime) - new Date(b.appointmentTime))[0];
  }, [appointments]);

  const recentActivity = useMemo(() => {
    const appointmentEvents = appointments.map((a) => ({
      title: `Appointment with Dr. ${a.doctor?.fullName ?? "your doctor"} — ${
        a.status === APPOINTMENT_STATUS.CANCELED ? "canceled" : "scheduled"
      }`,
      timestamp: a.appointmentTime,
    }));

    const prescriptionEvents = prescriptions.map((p) => ({
      title: `Prescription received from Dr. ${p.doctor?.fullName ?? "your doctor"}`,
      timestamp: p.prescriptionDate,
    }));

    const recordEvents = records.map((r) => ({
      title: `Medical record added by Dr. ${r.doctor?.fullName ?? "your doctor"}`,
      timestamp: r.visitDate,
    }));

    const documentEvents = documents.map((d) => ({
      title: `Document uploaded: ${d.originalFilename ?? "report"}`,
      timestamp: d.uploadedAt,
    }));

    return [
      ...appointmentEvents,
      ...prescriptionEvents,
      ...recordEvents,
      ...documentEvents,
    ]
      .filter((event) => event.timestamp)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 6)
      .map((event) => ({
        title: event.title,
        time: new Date(event.timestamp).toLocaleDateString(),
      }));
  }, [appointments, prescriptions, records, documents]);

  return {
    stats,
    nextAppointment,
    recentActivity,
    loading,
    error,
    retry: fetchAll,
  };
};

export default usePatientDashboard;