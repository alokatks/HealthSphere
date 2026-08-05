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
import GENDER_OPTIONS from "@/constants/gender";

const PatientsToolbar = ({ search, onSearch, gender, onGenderChange, onReset }) => {
  return (
    <Stack
      direction={{ xs: "column", md: "row" }}
      spacing={2}
      sx={{ alignItems: { md: "center" }, mb: 3 }}
    >
      <SearchInput
        value={search}
        onSearch={onSearch}
        placeholder="Search by name, email or phone..."
      />

      <FormControl sx={{ minWidth: 180 }}>
        <InputLabel>Gender</InputLabel>

        <Select
          value={gender}
          label="Gender"
          onChange={(event) => onGenderChange(event.target.value)}
        >
          {GENDER_OPTIONS.map((option) => (
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

PatientsToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onSearch: PropTypes.func.isRequired,
  gender: PropTypes.string.isRequired,
  onGenderChange: PropTypes.func.isRequired,
  onReset: PropTypes.func.isRequired,
};

export default PatientsToolbar;
