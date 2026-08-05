import { useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { Visibility, VisibilityOff } from "@mui/icons-material";

import { Link as RouterLink, useNavigate } from "react-router-dom";


import { getUserClaims } from "@/utils/jwt";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import authService from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

import ROUTES from "@/constants/routes";
import { loginSchema } from "@/validations/authSchemas";

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
    mode: "onBlur",
  });

  const onSubmit = async (data) => {
    setLoginError("");

    try {
      const token = await authService.login({
        email: data.email,
        password: data.password,
      });

      login(token);

      const claims = getUserClaims(token);

      const role = (claims.roles || claims.role || "").replace("ROLE_", "");

      switch (role) {
        case "PATIENT":
          navigate(ROUTES.PATIENT_DASHBOARD, {
            replace: true,
          });
          break;

        case "DOCTOR":
          navigate(ROUTES.DOCTOR_DASHBOARD, {
            replace: true,
          });
          break;

        case "ADMIN":
          navigate(ROUTES.ADMIN_DASHBOARD, {
            replace: true,
          });
          break;

        default:
          navigate("/", {
            replace: true,
          });
      }
    } catch (error) {
      setLoginError(
        error.response?.data || "Unable to login. Please try again."
      );
    }
  };

  return (
    <Card sx={{ width: "100%", maxWidth: 450 }}>
      <CardContent sx={{ p: 4 }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Welcome Back
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "text.secondary", mt: 1 }}
            >
              Sign in to continue to HealthSphere.
            </Typography>
          </Box>

          {loginError && (
            <Alert severity="error">
              {loginError}
            </Alert>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit(onSubmit)}
          >
            <Stack spacing={2.5}>
              <TextField
                label="Email"
                fullWidth
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                fullWidth
                type={showPassword ? "text" : "password"}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                slotProps={{
                  input: {
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          edge="end"
                          onClick={() =>
                            setShowPassword((previous) => !previous)
                          }
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? (
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

              <Stack
                direction="row"
                sx={{ justifyContent: "space-between", alignItems: "center" }}
              >
                <FormControlLabel
                  control={<Checkbox {...register("rememberMe")} />}
                  label="Remember Me"
                />

                <Link
                  component={RouterLink}
                  underline="hover"
                  to={ROUTES.FORGOT_PASSWORD}
                >
                  Forgot Password?
                </Link>
              </Stack>

              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={isSubmitting}
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>

              <Typography
                variant="body2"
                sx={{ textAlign: "center" }}
              >
                Don't have an account?{" "}
                <Link
                  component={RouterLink}
                  to={ROUTES.REGISTER}
                  underline="hover"
                >
                  Register
                </Link>
              </Typography>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default LoginPage;