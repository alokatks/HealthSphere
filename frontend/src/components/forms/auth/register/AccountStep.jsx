import PropTypes from "prop-types";
import {
  Grid,
  MenuItem,
  TextField,
} from "@mui/material";
import { Controller } from "react-hook-form";

import { REGISTER_ROLES } from "./constants";

const AccountStep = ({ control }) => {
  return (
    <Grid container spacing={3}>
      <Grid size={{ xs: 12 }}>
        <Controller
          name="fullName"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              label="Full Name"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              type="email"
              label="Email"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="password"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              type="password"
              label="Password"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              fullWidth
              type="password"
              label="Confirm Password"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />
      </Grid>

      <Grid size={{ xs: 12 }}>
        <Controller
          name="role"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              select
              fullWidth
              label="Role"
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            >
              <MenuItem value={REGISTER_ROLES.PATIENT}>
                Patient
              </MenuItem>

              <MenuItem value={REGISTER_ROLES.DOCTOR}>
                Doctor
              </MenuItem>
            </TextField>
          )}
        />
      </Grid>
    </Grid>
  );
};

AccountStep.propTypes = {
  control: PropTypes.object.isRequired,
};

export default AccountStep;