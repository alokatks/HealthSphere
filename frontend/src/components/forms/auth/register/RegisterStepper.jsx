import PropTypes from "prop-types";

import {
  Step,
  StepLabel,
  Stepper,
} from "@mui/material";

import { REGISTER_STEPS } from "./constants";

const RegisterStepper = ({ activeStep }) => {
  return (
    <Stepper
      activeStep={activeStep}
      alternativeLabel
      sx={{
        mb: 5,
      }}
    >
      {REGISTER_STEPS.map((step) => (
        <Step key={step}>
          <StepLabel>{step}</StepLabel>
        </Step>
      ))}
    </Stepper>
  );
};

RegisterStepper.propTypes = {
  activeStep: PropTypes.number.isRequired,
};

export default RegisterStepper;