import PropTypes from "prop-types";

import CheckCircleRoundedIcon from "@mui/icons-material/CheckCircleRounded";

import {
  Button,
  Stack,
  Typography,
} from "@mui/material";

const SuccessStep = ({ onLogin }) => {
  return (
    <Stack
      spacing={3}
      sx={{
        alignItems: "center",
        justifyContent: "center",
        py: 6,
      }}
    >
      <CheckCircleRoundedIcon
        color="success"
        sx={{
          fontSize: 80,
        }}
      />

      <Typography variant="h4">
        Registration Successful
      </Typography>

      <Typography
        variant="body1"
        align="center"
        sx={{ color: "text.secondary" }}
      >
        Your account has been created successfully.
        <br />
        You can now login using your credentials.
      </Typography>

      <Button
        variant="contained"
        onClick={onLogin}
      >
        Go to Login
      </Button>
    </Stack>
  );
};

SuccessStep.propTypes = {
  onLogin: PropTypes.func.isRequired,
};

export default SuccessStep;