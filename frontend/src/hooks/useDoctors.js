import { useCallback, useEffect, useMemo, useState } from "react";

import adminService from "@/services/adminService";
import PAGINATION from "@/constants/pagination";

// Backend Doctor shape: { id, user: { email, role, status, active }, fullName,
// specialization, licenseNumber, certificateFilePath, yearsOfExperience,
// clinicName }. Verification state lives on user.status ("PENDING" |
// "VERIFIED"); there is no separate active/inactive toggle for doctors on
// the backend, so we don't invent one.
const normalizeDoctor = (doctor) => ({
  id: doctor.id,
  name: doctor.fullName,
  email: doctor.user?.email,
  specialization: doctor.specialization,
  licenseNumber: doctor.licenseNumber,
  certificateFilePath: doctor.certificateFilePath,
  yearsOfExperience: doctor.yearsOfExperience,
  clinicName: doctor.clinicName,
  status: doctor.user?.status ?? "PENDING",
});

const useDoctors = () => {
  const [doctors, setDoctors] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("ALL");

  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);

  // Tracks which doctor a verify request is in flight for, so the UI can
  // show a per-row/dialog loading state without a global spinner.
  const [verifying, setVerifying] = useState(null);

  const fetchDoctors = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await adminService.getDoctors();

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
    setStatus("ALL");
    setSortBy("name");
    setSortOrder("asc");
    setPage(PAGINATION.DEFAULT_PAGE);
  }, []);

  // Verifies a pending doctor's account, then refreshes the list so the
  // status chip reflects the backend's actual state rather than an
  // optimistic guess.
  const verifyDoctor = useCallback(
    async (doctorId) => {
      setVerifying(doctorId);
      try {
        await adminService.verifyDoctor(doctorId);
        await fetchDoctors();
      } finally {
        setVerifying(null);
      }
    },
    [fetchDoctors]
  );

  const filteredDoctors = useMemo(() => {
    let data = [...doctors];

    if (status !== "ALL") {
      data = data.filter((doctor) => doctor.status === status);
    }

    if (search.trim()) {
      const keyword = search.toLowerCase();

      data = data.filter(
        (doctor) =>
          doctor.name?.toLowerCase().includes(keyword) ||
          doctor.email?.toLowerCase().includes(keyword) ||
          doctor.specialization?.toLowerCase().includes(keyword) ||
          doctor.licenseNumber?.toLowerCase().includes(keyword)
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
  }, [doctors, status, search, sortBy, sortOrder]);

  const totalCount = filteredDoctors.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / PAGINATION.PAGE_SIZE));

  const paginatedDoctors = useMemo(() => {
    const start = (page - 1) * PAGINATION.PAGE_SIZE;

    return filteredDoctors.slice(start, start + PAGINATION.PAGE_SIZE);
  }, [filteredDoctors, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

  return {
    doctors: paginatedDoctors,

    loading,
    error,

    search,
    setSearch,

    status,
    setStatus,

    sortBy,
    sortOrder,
    toggleSort,

    resetFilters,

    page,
    setPage,
    totalPages,
    totalCount,
    pageSize: PAGINATION.PAGE_SIZE,

    verifying,
    verifyDoctor,

    retry: fetchDoctors,
  };
};

export default useDoctors;
