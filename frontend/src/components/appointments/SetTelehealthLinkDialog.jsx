import PropTypes from "prop-types";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { telehealthLinkSchema } from "@/validations/appointmentSchemas";

const SetTelehealthLinkDialog = ({
  open,
  onClose,
  onSubmit,
  submitting,
  patientName,
  currentLink,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(telehealthLinkSchema),
    values: { telehealthLink: currentLink || "" },
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitHandler = async (data) => {
    await onSubmit(data);
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{currentLink ? "Edit Meeting Link" : "Add Meeting Link"}</DialogTitle>

      <Stack component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack spacing={2.5}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              For appointment with: <strong>{patientName}</strong>
            </Typography>

            <TextField
              label="Meeting Link"
              fullWidth
              placeholder="https://meet.example.com/xyz"
              {...register("telehealthLink")}
              error={!!errors.telehealthLink}
              helperText={errors.telehealthLink?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Save Link"}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

SetTelehealthLinkDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  patientName: PropTypes.string,
  currentLink: PropTypes.string,
};

export default SetTelehealthLinkDialog;
