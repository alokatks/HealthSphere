import { useCallback, useEffect, useState } from "react";

import adminService from "@/services/adminService";

const normalizePatient = (patient) => ({
  id: patient.id,
  fullName: patient.fullName,
  email: patient.user?.email,
  phoneNumber: patient.phoneNumber,
  dateOfBirth: patient.dateOfBirth,
  gender: patient.gender,
  address: patient.address,
  emergencyContact: patient.emergencyContact,
  active: patient.user?.active ?? true,
});

const usePatientDetails = (patientId) => {
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchPatient = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getPatientById(patientId);
      setPatient(normalizePatient(response));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchPatient();
  }, [fetchPatient]);

  // formValues must match PatientUpdateDto exactly: fullName, phoneNumber,
  // dateOfBirth, gender, address, emergencyContact.
  const updatePatient = useCallback(
    async (formValues) => {
      setSaving(true);
      try {
        const response = await adminService.updatePatient(patientId, formValues);
        setPatient(normalizePatient(response));
        return response;
      } finally {
        setSaving(false);
      }
    },
    [patientId]
  );

  return {
    patient,
    loading,
    error,
    saving,
    retry: fetchPatient,
    updatePatient,
  };
};

export default usePatientDetails;
