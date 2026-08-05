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

import DoctorStatusChip from "@/components/doctors/DoctorStatusChip";
import DoctorActions from "@/components/doctors/DoctorActions";

const DoctorsTable = ({
  doctors,
  onView,
  onVerify,
  verifying,
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

              <TableCell sortDirection={sortBy === "specialization" ? sortOrder : false}>
                <TableSortLabel
                  active={sortBy === "specialization"}
                  direction={sortBy === "specialization" ? sortOrder : "asc"}
                  onClick={() => onSort("specialization")}
                >
                  Specialization
                </TableSortLabel>
              </TableCell>

              <TableCell>License No.</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Clinic</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="center">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {doctors.map((doctor) => (
              <TableRow key={doctor.id} hover>
                <TableCell>
                  <Typography sx={{ fontWeight: 600 }}>{doctor.name}</Typography>
                </TableCell>

                <TableCell>{doctor.email || "-"}</TableCell>
                <TableCell>{doctor.specialization || "-"}</TableCell>
                <TableCell>{doctor.licenseNumber || "-"}</TableCell>
                <TableCell>
                  {doctor.yearsOfExperience != null
                    ? `${doctor.yearsOfExperience} yrs`
                    : "-"}
                </TableCell>
                <TableCell>{doctor.clinicName || "-"}</TableCell>

                <TableCell>
                  <DoctorStatusChip status={doctor.status} />
                </TableCell>

                <TableCell align="center">
                  <DoctorActions
                    doctor={doctor}
                    onView={onView}
                    onVerify={onVerify}
                    verifying={verifying === doctor.id}
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

DoctorsTable.propTypes = {
  doctors: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      name: PropTypes.string,
      email: PropTypes.string,
      specialization: PropTypes.string,
      licenseNumber: PropTypes.string,
      yearsOfExperience: PropTypes.number,
      clinicName: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
  onView: PropTypes.func.isRequired,
  onVerify: PropTypes.func.isRequired,
  verifying: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  sortBy: PropTypes.string.isRequired,
  sortOrder: PropTypes.oneOf(["asc", "desc"]).isRequired,
  onSort: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  totalCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
};

export default DoctorsTable;
