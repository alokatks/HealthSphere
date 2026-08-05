import PropTypes from "prop-types";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

const ErrorState = ({
  title = "Something went wrong",
  description = "An unexpected error occurred while loading this data.",
  error,
  retryLabel = "Retry",
  onRetry,
}) => {
  return (
    <Box
      sx={{
        py: 8,
        px: 3,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Stack
        spacing={2}
        sx={{ alignItems: "center", maxWidth: 500, textAlign: "center" }}
      >
        <ErrorOutlineOutlinedIcon
          sx={{
            fontSize: 72,
            color: "error.main",
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>

        {error && (
          <Typography
            variant="body2"
            sx={{
              color: "text.secondary",
              fontFamily: "monospace",
              bgcolor: "action.hover",
              p: 2,
              borderRadius: 1,
              width: "100%",
              wordBreak: "break-word",
            }}
          >
            {typeof error === "string"
              ? error
              : error?.message || "Unknown error"}
          </Typography>
        )}

        {onRetry && (
          <Button
            variant="contained"
            onClick={onRetry}
          >
            {retryLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

ErrorState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  error: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]),
  retryLabel: PropTypes.string,
  onRetry: PropTypes.func,
};

export default ErrorState;