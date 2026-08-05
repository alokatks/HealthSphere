import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import { LocalHospital } from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";

import authService from "@/services/authService";
import ROUTES from "@/constants/routes";
import { registerSchema } from "@/validations/authSchemas";

import {
  RegisterStepper,
  AccountStep,
  RoleDetailsStep,
  ReviewStep,
  SuccessStep,
} from "@/components/forms/auth/register";
import { REGISTER_ROLES } from "@/components/forms/auth/register/constants";

const STEP_ACCOUNT = 0;
const STEP_ROLE_DETAILS = 1;
const STEP_REVIEW = 2;
const STEP_SUCCESS = 3;

// Which fields belong to which step, so "Next" only validates what's
// actually on screen instead of the whole form.
const STEP_FIELDS = {
  [STEP_ACCOUNT]: ["fullName", "email", "password", "confirmPassword", "role"],
  doctorDetails: ["specialization", "licenseNumber", "yearsOfExperience", "clinicName"],
  patientDetails: ["phoneNumber", "dateOfBirth", "gender", "address", "emergencyContact"],
};

const RegisterPage = () => {
  const navigate = useNavigate();

  const [activeStep, setActiveStep] = useState(STEP_ACCOUNT);

  const {
    control,
    watch,
    trigger,
    getValues,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: REGISTER_ROLES.PATIENT,
      specialization: "",
      licenseNumber: "",
      yearsOfExperience: "",
      clinicName: "",
      phoneNumber: "",
      dateOfBirth: "",
      gender: "",
      address: "",
      emergencyContact: "",
    },
    mode: "onTouched",
  });

  const role = watch("role");

  const handleNext = async () => {
    let fieldsToValidate = [];
    if (activeStep === STEP_ACCOUNT) {
      fieldsToValidate = STEP_FIELDS[STEP_ACCOUNT];
    } else if (activeStep === STEP_ROLE_DETAILS) {
      fieldsToValidate =
        role === REGISTER_ROLES.DOCTOR
          ? STEP_FIELDS.doctorDetails
          : STEP_FIELDS.patientDetails;
    }

    const isValid = await trigger(fieldsToValidate);
    if (isValid) {
      setActiveStep((previous) => previous + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((previous) => Math.max(previous - 1, STEP_ACCOUNT));
  };

  const onSubmit = async (data) => {
    try {
      // confirmPassword is intentionally stripped before sending to the
      // backend, which doesn't accept this field.
      // eslint-disable-next-line no-unused-vars
      const { confirmPassword, ...payload } = data;

      await authService.register(payload);

      reset();
      toast.success("Registration successful.");
      setActiveStep(STEP_SUCCESS);
    } catch (error) {
      const message =
        error.response?.data?.message ??
        error.response?.data ??
        error.message ??
        "Unable to register. Please try again.";

      toast.error(message);
    }
  };

  const handleGoToLogin = () => {
    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  };

  return (
    <Stack spacing={4}>
      <Stack spacing={1} sx={{ alignItems: "center" }}>
        <LocalHospital color="primary" sx={{ fontSize: 48 }} />

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Create Account
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary", textAlign: "center" }}>
          Join HealthSphere to manage your healthcare digitally.
        </Typography>
      </Stack>

      <RegisterStepper activeStep={activeStep} />

      <Box component="form" noValidate onSubmit={handleSubmit(onSubmit)}>
        {activeStep === STEP_ACCOUNT && <AccountStep control={control} />}

        {activeStep === STEP_ROLE_DETAILS && (
          <RoleDetailsStep control={control} role={role} />
        )}

        {activeStep === STEP_REVIEW && <ReviewStep values={getValues()} />}

        {activeStep === STEP_SUCCESS && (
          <SuccessStep onLogin={handleGoToLogin} />
        )}

        {activeStep !== STEP_SUCCESS && (
          <Stack direction="row" sx={{ justifyContent: "space-between", mt: 4 }}>
            <Button
              disabled={activeStep === STEP_ACCOUNT || isSubmitting}
              onClick={handleBack}
            >
              Back
            </Button>

            {activeStep === STEP_REVIEW ? (
              <Button
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                startIcon={
                  isSubmitting ? (
                    <CircularProgress size={18} color="inherit" />
                  ) : null
                }
              >
                {isSubmitting ? "Creating Account..." : "Create Account"}
              </Button>
            ) : (
              <Button
                variant="contained"
                size="large"
                onClick={handleNext}
                disabled={isSubmitting}
              >
                Next
              </Button>
            )}
          </Stack>
        )}
      </Box>

      {activeStep !== STEP_SUCCESS && (
        <Typography variant="body2" sx={{ textAlign: "center" }}>
          Already have an account?{" "}
          <Link component={RouterLink} to={ROUTES.LOGIN} underline="hover">
            Login
          </Link>
        </Typography>
      )}
    </Stack>
  );
};

export default RegisterPage;