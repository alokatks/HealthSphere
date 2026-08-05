import { useCallback, useEffect, useState } from "react";

import doctorService from "@/services/doctorService";

// Backend Doctor entity -> UI model. Keeps raw DTO field names (fullName,
// specialization, clinicName) out of the booking dialog component.
const normalizeDoctor = (doctor) => ({
  id: doctor.id,
  name: doctor.fullName,
  specialization: doctor.specialization,
  clinicName: doctor.clinicName,
});

// Fetches the list of verified doctors a patient can book an appointment
// with. Backed by GET /api/doctors (hasRole('PATIENT')).
const useAvailableDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await doctorService.getAvailableDoctors();
      setDoctors(response.map(normalizeDoctor));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  return {
    doctors,
    loading,
    error,
    retry: fetchDoctors,
  };
};

export default useAvailableDoctors;
