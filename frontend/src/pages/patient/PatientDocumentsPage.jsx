import { useState } from "react";
import { toast } from "react-toastify";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";

import { Box, Button, Paper } from "@mui/material";

import SectionHeader from "@/components/dashboard/common/SectionHeader";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import TableSkeleton from "@/components/common/TableSkeleton";

import DocumentsList from "@/components/documents/DocumentsList";
import UploadDocumentDialog from "@/components/documents/UploadDocumentDialog";

import useMyProfile from "@/hooks/useMyProfile";
import usePatientDocuments from "@/hooks/usePatientDocuments";

const PatientDocumentsPage = () => {
  const { myId, loading: profileLoading, error: profileError, retry: retryProfile } =
    useMyProfile();

  const { documents, loading, error, uploading, uploadDocument, retry } =
    usePatientDocuments(myId);

  const [uploadOpen, setUploadOpen] = useState(false);

  const handleUpload = async (file) => {
    try {
      await uploadDocument(file);
      toast.success("Document uploaded.");
      setUploadOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to upload document.");
    }
  };

  const isLoading = profileLoading || loading;
  const combinedError = profileError || error;

  return (
    <Box>
      <SectionHeader
        title="Documents"
        subtitle="Lab reports and other medical documents you've uploaded."
        action={
          <Button
            variant="contained"
            startIcon={<UploadFileRoundedIcon />}
            onClick={() => setUploadOpen(true)}
          >
            Upload Document
          </Button>
        }
      />

      <Paper sx={{ p: 3 }}>
        {isLoading ? (
          <TableSkeleton columns={2} rows={4} />
        ) : combinedError ? (
          <ErrorState error={combinedError} onRetry={profileError ? retryProfile : retry} />
        ) : documents.length === 0 ? (
          <EmptyState
            title="No Documents Found"
            description="You haven't uploaded any documents yet."
          />
        ) : (
          <DocumentsList documents={documents} />
        )}
      </Paper>

      <UploadDocumentDialog
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onSubmit={handleUpload}
        submitting={uploading}
      />
    </Box>
  );
};

export default PatientDocumentsPage;
