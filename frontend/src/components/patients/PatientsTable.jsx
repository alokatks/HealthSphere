import PropTypes from "prop-types";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Typography,
} from "@mui/material";

import PatientStatusChip from "@/components/patients/PatientStatusChip";
import PatientActions from "@/components/patients/PatientActions";

const PatientsTable = ({
  patients,
  onView,
  onEdit,
  onToggleStatus,
  sortBy,
  sortOrder,
  onSort,
  page,
  totalCount,
  pageSize,
  onPageChange,
}) => {
  return (
    <Paper variant="outlined">
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={sortBy === "name" ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === "name"}
                  direction={sortBy === "name" ? sortOrder : "asc"}
                  onClick={() => onSort("name")}
                >
                  Name
                </TableSortLabel>
              </TableCell>

              <TableCell sortDirection={sortBy === "email" ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === "email"}
                  direction={sortBy === "email" ? sortOrder : "asc"}
                  onClick={() => onSort("email")}
                >
                  Email
                </TableSortLabel>
              </TableCell>

              <TableCell>Phone</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Gender</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {patients.map((patient) => (
              <TableRow key={patient.id} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>{patient.name}</Typography>
                </TableCell>

                <TableCell>{patient.email || "-"}</TableCell>
                <TableCell>{patient.phone || "-"}</TableCell>
                <TableCell>{patient.dateOfBirth || "-"}</TableCell>
                <TableCell>{patient.gender || "-"}</TableCell>

                <TableCell>
                  <PatientStatusChip active={patient.active} />
                </TableCell>

                <TableCell align="center">
                  <PatientActions
                    patient={patient}
                    onView={onView}
                    onEdit={onEdit}
                    onToggleStatus={onToggleStatus}
                  />
                </TableCell>
              </TableRow>
            ))}
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

PatientsTable.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      phone: PropTypes.string,
      dateOfBirth: PropTypes.string,
      gender: PropTypes.string,
      active: PropTypes.bool,
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onToggleStatus: PropTypes.func.isRequired,
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(["asc", "desc"]).isRequired,
  onSort: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default PatientsTable;
