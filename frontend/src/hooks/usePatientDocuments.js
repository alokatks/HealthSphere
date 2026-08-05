import { useCallback, useEffect, useState } from "react";

import patientService from "@/services/patientService";

// Backend PatientDocument shape: { id, patient, originalFilename,
// storedFilename, uploadedAt }. `storedFilename` is the UUID-based name on
// disk used to build the download URL; `originalFilename` is what we show
// and use as the downloaded file's name.
const normalizeDocument = (document) => ({
  id: document.id,
  originalFilename: document.originalFilename,
  storedFilename: document.storedFilename,
  uploadedAt: document.uploadedAt,
});

const usePatientDocuments = (patientId) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    if (!patientId) {
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await patientService.getReports(patientId);
      setDocuments(response.map(normalizeDocument));
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [patientId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const uploadDocument = useCallback(
    async (file) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        await patientService.uploadReport(formData);
        await fetchDocuments();
      } finally {
        setUploading(false);
      }
    },
    [fetchDocuments]
  );

  return {
    documents,
    loading,
    error,
    uploading,
    uploadDocument,
    retry: fetchDocuments,
  };
};

export default usePatientDocuments;
