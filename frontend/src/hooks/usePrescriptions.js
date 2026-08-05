import { useCallback, useEffect, useState } from "react";

import prescriptionService from "@/services/prescriptionService";

// Backend Prescription shape: { id, patient: { id, fullName, ... },
// doctor: { id, fullName, ... }, medication, dosage, instructions,
// prescriptionDate }. Flatten nested patient/doctor names so the UI never
// touches raw backend DTO naming.
const normalizePrescription = (prescription) => ({
  id: prescription.id,
  patientId: prescription.patient?.id,
  doctorId: prescription.doctor?.id,
  patientName: prescription.patient?.fullName,
  doctorName: prescription.doctor?.fullName,
  medication: prescription.medication,
  dosage: prescription.dosage,
  instructions: prescription.instructions,
  prescriptionDate: prescription.prescriptionDate,
});

// `role` is "PATIENT" or "DOCTOR" — determines which endpoint is called.
const usePrescriptions = ({ role, ownerId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPrescriptions = useCallback(async () => {
    if (!ownerId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response =
        role === "DOCTOR"
          ? await prescriptionService.getPrescriptionsByDoctor(ownerId)
          : await prescriptionService.getPrescriptionsByPatient(ownerId);

      setPrescriptions(response.map(normalizePrescription));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [role, ownerId]);

  useEffect(() => {
    fetchPrescriptions();
  }, [fetchPrescriptions]);

  return {
    prescriptions,
    loading,
    error,
    retry: fetchPrescriptions,
  };
};

export default usePrescriptions;
