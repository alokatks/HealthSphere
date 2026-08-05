import {
  Button,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { LocalHospital } from "@mui/icons-material";
import { Link as RouterLink } from "react-router-dom";

import ROUTES from "@/constants/routes";

const ForgotPasswordPage = () => {
  return (
    <Stack spacing={4}>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <LocalHospital
          color="primary"
          sx={{ fontSize: 48 }}
        />

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Forgot Password?
        </Typography>

        <Typography
          variant="body1"
          sx={{ color: "text.secondary", textAlign: "center" }}
        >
          Enter your email address and we'll send you a password reset link.
        </Typography>
      </Stack>

      <Stack spacing={3}>
        <TextField
          fullWidth
          label="Email Address"
          type="email"
          placeholder="Enter your email"
        />

        <Button
          fullWidth
          size="large"
          variant="contained"
        >
          Send Reset Link
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

export default ForgotPasswordPage;