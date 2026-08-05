import PropTypes from "prop-types";

import {
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

const TableSkeleton = ({
  columns = 5,
  rows = 8,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            {Array.from({ length: columns }).map((_, index) => (
              <TableCell key={index}>
                <Skeleton
                  variant="text"
                  width="80%"
                  height={28}
                />
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {Array.from({ length: columns }).map((_, columnIndex) => (
                <TableCell key={columnIndex}>
                  <Stack spacing={0.5}>
                    <Skeleton
                      variant="text"
                      width="90%"
                    />
                    <Skeleton
                      variant="text"
                      width="60%"
                    />
                  </Stack>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

TableSkeleton.propTypes = {
  columns: PropTypes.number,
  rows: PropTypes.number,
};

export default TableSkeleton;