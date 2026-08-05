import { useEffect } from "react";
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

import { createEHRSchema } from "@/validations/ehrSchemas";

const CreateEHRDialog = ({ open, onClose, onSubmit, submitting, patientId, doctorId, patientName }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createEHRSchema),
    defaultValues: {
      patientId,
      doctorId,
      visitDate: new Date().toISOString().slice(0, 10),
      diagnosis: "",
      medications: "",
      labResults: "",
      notes: "",
    },
  });
  useEffect(() => {
    if (open) {
      reset({
        patientId,
        doctorId,
        visitDate: new Date().toISOString().slice(0, 10),
        diagnosis: "",
        medications: "",
        labResults: "",
        notes: "",
      });
    }
  }, [open, patientId, doctorId, reset]);

  const handleClose = () => {
    reset();
    onClose();
  };

  const submitHandler = async (data) => {
    await onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={submitting ? undefined : handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Medical Record</DialogTitle>

      <Stack
        component="form"
        noValidate
        onSubmit={handleSubmit(submitHandler)}
      >
        <DialogContent>
          <Stack spacing={2.5}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              For patient: <strong>{patientName}</strong>
            </Typography>

            <TextField
              label="Visit Date"
              type="date"
              fullWidth
              slotProps={{ inputLabel: { shrink: true } }}
              {...register("visitDate")}
              error={!!errors.visitDate}
              helperText={errors.visitDate?.message}
            />

            <TextField
              label="Diagnosis"
              fullWidth
              multiline
              minRows={2}
              {...register("diagnosis")}
              error={!!errors.diagnosis}
              helperText={errors.diagnosis?.message}
            />

            <TextField
              label="Medications"
              fullWidth
              multiline
              minRows={2}
              {...register("medications")}
              error={!!errors.medications}
              helperText={errors.medications?.message}
            />

            <TextField
              label="Lab Results"
              fullWidth
              multiline
              minRows={2}
              {...register("labResults")}
              error={!!errors.labResults}
              helperText={errors.labResults?.message}
            />

            <TextField
              label="Notes"
              fullWidth
              multiline
              minRows={2}
              {...register("notes")}
              error={!!errors.notes}
              helperText={errors.notes?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Save Record"}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

CreateEHRDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  patientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  doctorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  patientName: PropTypes.string,
};

export default CreateEHRDialog;
