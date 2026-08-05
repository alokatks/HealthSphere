import { useEffect, useState } from "react";
import PropTypes from "prop-types";

import SearchIcon from "@mui/icons-material/Search";

import {
  InputAdornment,
  TextField,
} from "@mui/material";

const SearchInput = ({
  value = "",
  onSearch,
  placeholder = "Search...",
  delay = 400,
  fullWidth = true,
  ...props
}) => {
  const [searchValue, setSearchValue] = useState(value);

  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch?.(searchValue.trim());
    }, delay);

    return () => clearTimeout(timer);
  }, [searchValue, delay, onSearch]);

  return (
    <TextField
      {...props}
      fullWidth={fullWidth}
      value={searchValue}
      placeholder={placeholder}
      onChange={(event) => setSearchValue(event.target.value)}
      slotProps={{
        input: {
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
        },
      }}
    />
  );
};

SearchInput.propTypes = {
  value: PropTypes.string,
  onSearch: PropTypes.func,
  placeholder: PropTypes.string,
  delay: PropTypes.number,
  fullWidth: PropTypes.bool,
};

export default SearchInput;