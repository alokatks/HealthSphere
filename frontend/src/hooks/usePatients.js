import { useCallback, useEffect, useMemo, useState } from "react";

import adminService from "@/services/adminService";
import PAGINATION from "@/constants/pagination";

// Backend Patient shape: { id, user: { email, role, status, active }, fullName,
// phoneNumber, dateOfBirth, gender, address, emergencyContact }.
// email/active live on the nested `user`, not on the patient itself.
// There is no registration-date field on the backend, so we don't invent one.
const normalizePatient = (patient) => ({
  id: patient.id,
  name: patient.fullName,
  email: patient.user?.email,
  phone: patient.phoneNumber,
  dateOfBirth: patient.dateOfBirth,
  gender: patient.gender,
  address: patient.address,
  emergencyContact: patient.emergencyContact,
  active: patient.user?.active ?? true,
});

const usePatients = () => {
  const [patients, setPatients] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [gender, setGender] = useState("ALL");

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);

  // Tracks which patient a status-change request is in flight for, so the
  // UI can show a per-row/dialog loading state without a global spinner.
  const [statusUpdating, setStatusUpdating] = useState(null);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getPatients();

      setPatients(response.map(normalizePatient));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const toggleSort = useCallback((field) => {
    setSortBy((currentField) => {
      if (currentField === field) {
        setSortOrder((currentOrder) => (currentOrder === "asc" ? "desc" : "asc"));
        return currentField;
      }
      setSortOrder("asc");
      return field;
    });
  }, []);

  const resetFilters = useCallback(() => {
    setSearch("");
    setGender("ALL");
    setSortBy("name");
    setSortOrder("asc");
    setPage(PAGINATION.DEFAULT_PAGE);
  }, []);

  // Deactivates/reactivates a patient's account, then refreshes the list so
  // the status chip reflects the backend's actual state rather than an
  // optimistic guess.
  const toggleStatus = useCallback(
    async (patientId, nextActive) => {
      setStatusUpdating(patientId);
      try {
        await adminService.updatePatientStatus(patientId, nextActive);
        await fetchPatients();
      } finally {
        setStatusUpdating(null);
      }
    },
    [fetchPatients]
  );

  const filteredPatients = useMemo(() => {
    let data = [...patients];

    if (gender !== "ALL") {
      data = data.filter((patient) => patient.gender === gender);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (patient) =>
          patient.name?.toLowerCase().includes(keyword) ||
          patient.email?.toLowerCase().includes(keyword) ||
          patient.phone?.toLowerCase().includes(keyword)
      );
    }

    data.sort((a, b) => {
      const aValue = (a[sortBy] ?? "").toString().toLowerCase();
      const bValue = (b[sortBy] ?? "").toString().toLowerCase();

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return data;
  }, [patients, gender, search, sortBy, sortOrder]);

  const totalCount = filteredPatients.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGINATION.PAGE_SIZE));

  const paginatedPatients = useMemo(() => {
    const start = (page - 1) * PAGINATION.PAGE_SIZE;

    return filteredPatients.slice(start, start + PAGINATION.PAGE_SIZE);
  }, [filteredPatients, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  return {
    patients: paginatedPatients,

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
    totalPages,
    totalCount,
    pageSize: PAGINATION.PAGE_SIZE,

    statusUpdating,
    toggleStatus,

    retry: fetchPatients,
  };
};

export default usePatients;
