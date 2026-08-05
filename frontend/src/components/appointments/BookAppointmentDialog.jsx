import PropTypes from "prop-types";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";

import { bookAppointmentSchema } from "@/validations/appointmentSchemas";
import APPOINTMENT_MODE, { APPOINTMENT_MODE_OPTIONS } from "@/constants/appointmentMode";

const BookAppointmentDialog = ({
  open,
  onClose,
  onSubmit,
  submitting,
  doctors,
  doctorsLoading,
  doctorsError,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(bookAppointmentSchema),
    defaultValues: {
      doctorId: "",
      appointmentTime: "",
      mode: APPOINTMENT_MODE.IN_PERSON,
    },
  });

  const mode = watch("mode");

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
      <DialogTitle>Book Appointment</DialogTitle>

      <Stack component="form" noValidate onSubmit={handleSubmit(submitHandler)}>
        <DialogContent>
          <Stack spacing={2.5}>
            {doctorsError && (
              <Alert severity="error">Couldn&apos;t load the doctor list. Please retry.</Alert>
            )}

            <FormControl fullWidth error={!!errors.doctorId} disabled={doctorsLoading}>
              <InputLabel>Doctor</InputLabel>

              <Controller
                name="doctorId"
                control={control}
                render={({ field }) => (
                  <Select
                    {...field}
                    label="Doctor"
                    startAdornment={
                      doctorsLoading ? (
                        <CircularProgress size={16} sx={{ mr: 1 }} />
                      ) : undefined
                    }
                  >
                    {doctors.map((doctor) => (
                      <MenuItem key={doctor.id} value={doctor.id}>
                        {doctor.name}
                        {doctor.specialization ? ` — ${doctor.specialization}` : ""}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />

              <FormHelperText>{errors.doctorId?.message}</FormHelperText>
            </FormControl>

            <FormControl fullWidth error={!!errors.mode}>
              <InputLabel>How will this happen?</InputLabel>

              <Controller
                name="mode"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="How will this happen?">
                    {APPOINTMENT_MODE_OPTIONS.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />

              <FormHelperText>
                {errors.mode?.message ||
                  (mode === APPOINTMENT_MODE.TELEHEALTH
                    ? "The doctor will add a meeting link once the appointment is confirmed."
                    : "You'll meet the doctor at their clinic.")}
              </FormHelperText>
            </FormControl>

            <TextField
              label="Appointment Date & Time"
              type="datetime-local"
              fullWidth
              InputLabelProps={{ shrink: true }}
              {...register("appointmentTime")}
              error={!!errors.appointmentTime}
              helperText={errors.appointmentTime?.message}
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleClose} disabled={submitting}>
            Cancel
          </Button>

          <Button type="submit" variant="contained" disabled={submitting || doctorsLoading}>
            {submitting ? "Booking..." : "Book Appointment"}
          </Button>
        </DialogActions>
      </Stack>
    </Dialog>
  );
};

BookAppointmentDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  submitting: PropTypes.bool,
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      specialization: PropTypes.string,
    })
  ).isRequired,
  doctorsLoading: PropTypes.bool,
  doctorsError: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
};

export default BookAppointmentDialog;
