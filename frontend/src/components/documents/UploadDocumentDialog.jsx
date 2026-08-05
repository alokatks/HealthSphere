import { useState } from "react";
import PropTypes from "prop-types";

import UploadFileRoundedIcon from "@mui/icons-material/UploadFileRounded";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";

const UploadDocumentDialog = ({ open, onClose, onSubmit, submitting }) => {
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState(null);

  const handleClose = () => {
    setFile(null);
    setFileError(null);
    onClose();
  };

  const handleFileChange = (event) => {
    const selected = event.target.files?.[0] ?? null;
    setFile(selected);
    setFileError(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setFileError("Please choose a file to upload.");
      return;
    }

    await onSubmit(file);
    setFile(null);
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : handleClose} maxWidth="xs" fullWidth>
      <DialogTitle>Upload Document</DialogTitle>

      <Stack component="form" noValidate onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={2}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Upload a lab report or other medical document. It will be
              visible only to you and your care team.
            </Typography>

            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileRoundedIcon />}
            >
              {file ? file.name : "Choose File"}
              <input type="file" hidden onChange={handleFileChange} />
            </Button>

            {fileError && (
              <Typography variant="caption" color="error">
                {fileError}
              </Typography>
            )}
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Uploading..." : "Upload"}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

UploadDocumentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
};

export default UploadDocumentDialog;
