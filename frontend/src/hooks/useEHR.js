import { useCallback, useEffect, useState } from "react";

import ehrService from "@/services/ehrService";

// Backend EHR shape: { id, patient: { id, fullName, ... }, doctor: { id,
// fullName, ... }, visitDate, diagnosis, medications, labResults, notes }.
// Flatten the nested patient/doctor names so the UI never touches raw
// backend DTO naming.
const normalizeRecord = (record) => ({
  id: record.id,
  patientId: record.patient?.id,
  doctorId: record.doctor?.id,
  patientName: record.patient?.fullName,
  doctorName: record.doctor?.fullName,
  visitDate: record.visitDate,
  diagnosis: record.diagnosis,
  medications: record.medications,
  labResults: record.labResults,
  notes: record.notes,
});

// `role` is "PATIENT" or "DOCTOR" — determines which endpoint is called.
const useEHR = ({ role, ownerId }) => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = useCallback(async () => {
    if (!ownerId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response =
        role === "DOCTOR"
          ? await ehrService.getRecordsByDoctor(ownerId)
          : await ehrService.getRecordsByPatient(ownerId);

      setRecords(response.map(normalizeRecord));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role, ownerId]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  return {
    records,
    loading,
    error,
    retry: fetchRecords,
  };
};

export default useEHR;
