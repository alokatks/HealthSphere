import PropTypes from "prop-types";

import {
  Button,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  Typography,
} from "@mui/material";

import AppointmentStatusChip from "@/components/appointments/AppointmentStatusChip";
import AppointmentModeChip from "@/components/appointments/AppointmentModeChip";
import APPOINTMENT_STATUS from "@/constants/appointmentStatus";
import APPOINTMENT_MODE from "@/constants/appointmentMode";

const formatDateTime = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
};

const AppointmentsTable = ({
  appointments,
  viewerRole,
  onCancel,
  cancelling,
  onAddRecord,
  onAddPrescription,
  onSetTelehealthLink,
  page,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  const counterpartLabel = viewerRole === "DOCTOR" ? "Patient" : "Doctor";

  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>{counterpartLabel}</TableCell>
              {viewerRole === "PATIENT" && <TableCell>Specialization</TableCell>}
              <TableCell>Date &amp; Time</TableCell>
              <TableCell>Mode</TableCell>
              <TableCell>Where</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {appointments.map((appointment) => {
              const isTelehealth = appointment.mode === APPOINTMENT_MODE.TELEHEALTH;
              const isCanceled = appointment.status === APPOINTMENT_STATUS.CANCELED;

              return (
                <TableRow key={appointment.id} hover>
                  <TableCell>
                    <Typography sx={{ fontWeight: 600 }}>
                      {viewerRole === "DOCTOR"
                        ? appointment.patientName
                        : appointment.doctorName}
                    </Typography>
                  </TableCell>

                  {viewerRole === "PATIENT" && (
                    <TableCell>{appointment.specialization || "-"}</TableCell>
                  )}

                  <TableCell>{formatDateTime(appointment.appointmentTime)}</TableCell>

                  <TableCell>
                    <AppointmentModeChip mode={appointment.mode} />
                  </TableCell>

                  <TableCell>
                    {isTelehealth ? (
                      appointment.telehealthLink ? (
                        <Link
                          href={appointment.telehealthLink}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          Meeting link
                        </Link>
                      ) : (
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                          Link not added yet
                        </Typography>
                      )
                    ) : (
                      appointment.clinicName || "-"
                    )}
                  </TableCell>

                  <TableCell>
                    <AppointmentStatusChip status={appointment.status} />
                  </TableCell>

                  <TableCell align="center">
                    <Button
                      size="small"
                      color="error"
                      disabled={
                        appointment.status !== APPOINTMENT_STATUS.PENDING ||
                        cancelling === appointment.id
                      }
                      onClick={() => onCancel(appointment)}
                    >
                      {cancelling === appointment.id ? "Cancelling..." : "Cancel"}
                    </Button>

                    {onAddRecord && (
                      <Button size="small" onClick={() => onAddRecord(appointment)}>
                        Add Record
                      </Button>
                    )}

                    {onAddPrescription && (
                      <Button size="small" onClick={() => onAddPrescription(appointment)}>
                        Prescribe
                      </Button>
                    )}

                    {onSetTelehealthLink && isTelehealth && !isCanceled && (
                      <Button size="small" onClick={() => onSetTelehealthLink(appointment)}>
                        {appointment.telehealthLink ? "Edit Link" : "Add Link"}
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={totalCount}
        page={page - 1}
        onPageChange={(_, newPage) => onPageChange(newPage + 1)}
        rowsPerPage={pageSize}
        rowsPerPageOptions={[pageSize]}
      />
    </Paper>
  );
};

AppointmentsTable.propTypes = {
  appointments: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      patientName: PropTypes.string,
      doctorName: PropTypes.string,
      specialization: PropTypes.string,
      clinicName: PropTypes.string,
      appointmentTime: PropTypes.string,
      status: PropTypes.string,
      mode: PropTypes.string,
      telehealthLink: PropTypes.string,
    })
  ).isRequired,
  viewerRole: PropTypes.oneOf(["PATIENT", "DOCTOR"]).isRequired,
  onCancel: PropTypes.func.isRequired,
  cancelling: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onAddRecord: PropTypes.func,
  onAddPrescription: PropTypes.func,
  onSetTelehealthLink: PropTypes.func,
  page: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default AppointmentsTable;
