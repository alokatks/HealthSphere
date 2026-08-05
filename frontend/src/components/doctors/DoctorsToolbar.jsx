import PropTypes from "prop-types";

import RestartAltOutlinedIcon from "@mui/icons-material/RestartAltOutlined";

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";

import SearchInput from "@/components/common/SearchInput";
import { DOCTOR_STATUS_OPTIONS } from "@/constants/doctorStatus";

const DoctorsToolbar = ({ search, onSearch, status, onStatusChange, onReset }) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ alignItems: { md: "center" }, mb: 3 }}
    >
      <SearchInput
        value={search}
        onSearch={onSearch}
        placeholder="Search by name, email, specialization or license..."
      />

      <FormControl sx={{ minWidth: 200 }}>
        <InputLabel>Status</InputLabel>

        <Select
          value={status}
          label="Status"
          onChange={(event) => onStatusChange(event.target.value)}
        >
          {DOCTOR_STATUS_OPTIONS.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button
        variant="text"
        startIcon={<RestartAltOutlinedIcon />}
        onClick={onReset}
        sx={{ whiteSpace: "nowrap" }}
      >
        Reset Filters
      </Button>
    </Stack>
  );
};

DoctorsToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  status: PropTypes.string.isRequired,
  onStatusChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default DoctorsToolbar;
