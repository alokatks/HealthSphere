import { useState } from "react";
import {
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  LocalHospital,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import ROUTES from "@/constants/routes";

const ResetPasswordPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <Stack spacing={4}>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <LocalHospital
          color="primary"
          sx={{ fontSize: 48 }}
        />

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Reset Password
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", textAlign: "center" }}
        >
          Enter your new password below to reset your account password.
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="New Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your new password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() => setShowPassword((prev) => !prev)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <TextField
          fullWidth
          label="Confirm Password"
          type={showConfirmPassword ? "text" : "password"}
          placeholder="Confirm your new password"
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    edge="end"
                    onClick={() =>
                      setShowConfirmPassword((prev) => !prev)
                    }
                    aria-label={
                      showConfirmPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showConfirmPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
        >
          Reset Password
        </Button>
      </Stack>

      <Typography variant="body2" sx={{ textAlign: "center" }}>
        Remember your password?{" "}
        <Link
          component={RouterLink}
          to={ROUTES.LOGIN}
          underline="hover"
        >
          Back to Login
        </Link>
      </Typography>
    </Stack>
  );
};

export default ResetPasswordPage;