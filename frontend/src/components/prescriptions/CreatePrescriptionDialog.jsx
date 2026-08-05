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

import { createPrescriptionSchema } from "@/validations/prescriptionSchemas";

const CreatePrescriptionDialog = ({
  open,
  onClose,
  onSubmit,
  submitting,
  patientId,
  doctorId,
  patientName,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createPrescriptionSchema),
    defaultValues: {
      patientId,
      doctorId,
      medication: "",
      dosage: "",
      instructions: "",
    },
  });
  useEffect(() => {
    if (open) {
      reset({
        patientId,
        doctorId,
        medication: "",
        dosage: "",
        instructions: "",
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
      <DialogTitle>Write Prescription</DialogTitle>

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
              label="Medication"
              fullWidth
              {...register("medication")}
              error={!!errors.medication}
              helperText={errors.medication?.message}
            />

            <TextField
              label="Dosage"
              fullWidth
              placeholder="e.g. 500mg twice daily"
              {...register("dosage")}
              error={!!errors.dosage}
              helperText={errors.dosage?.message}
            />

            <TextField
              label="Instructions"
              fullWidth
              multiline
              minRows={2}
              {...register("instructions")}
              error={!!errors.instructions}
              helperText={errors.instructions?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={submitting}>
            {submitting ? "Saving..." : "Save Prescription"}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

CreatePrescriptionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  patientId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  doctorId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  patientName: PropTypes.string,
};

export default CreatePrescriptionDialog;
