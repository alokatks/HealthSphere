import { Component } from "react";

import PropTypes from "prop-types";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import { Box, Button, Container, Paper, Stack, Typography } from "@mui/material";

import ROUTES from "@/constants/routes";

// Vite emits a distinct error (message contains "Failed to fetch dynamically
// imported module" / "importing a module script failed") when a lazy chunk
// (see routes/AppRoutes.jsx) fails to load — most commonly a stale deployed
// chunk after a new release, or a flaky connection. That case is recoverable
// with a plain reload, so it gets a slightly different message than a real
// render-time bug.
const isChunkLoadError = (error) => {
  const message = String(error?.message || "");
  return (
    /dynamically imported module/i.test(message) ||
    /importing a module script failed/i.test(message) ||
    /loading chunk/i.test(message)
  );
};

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, info) {
    // Centralized logging hook. Swap/extend this for a real error-reporting
    // service (Sentry, etc.) during the production-deployment pass.
    console.error("ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = ROUTES.HOME;
  };

  render() {
    const { hasError, error } = this.state;
    const { children } = this.props;

    if (!hasError) {
      return children;
    }

    const chunkError = isChunkLoadError(error);

    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "grey.100",
          px: 2,
        }}
      >
        <Container maxWidth="sm">
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: "center",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1.5 }}>
              {chunkError ? "New version available" : "Something went wrong"}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              {chunkError
                ? "This part of HealthSphere was just updated. Reload the page to get the latest version."
                : "An unexpected error occurred while rendering this page. You can try reloading, or head back to the dashboard."}
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" sx={{ mb: import.meta.env.DEV ? 3 : 0 }}>
              <Button
                variant="contained"
                startIcon={<RefreshRoundedIcon />}
                onClick={this.handleReload}
              >
                Reload page
              </Button>

              <Button
                variant="outlined"
                startIcon={<HomeRoundedIcon />}
                onClick={this.handleGoHome}
              >
                Go to dashboard
              </Button>
            </Stack>

            {import.meta.env.DEV && (
              <Box
                component="pre"
                sx={{
                  textAlign: "left",
                  whiteSpace: "pre-wrap",
                  fontFamily: "monospace",
                  fontSize: 12,
                  color: "error.main",
                  bgcolor: "grey.50",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 1,
                  p: 2,
                  maxHeight: 240,
                  overflow: "auto",
                }}
              >
                {String(error?.stack || error)}
              </Box>
            )}
          </Paper>
        </Container>
      </Box>
    );
  }
}

ErrorBoundary.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ErrorBoundary;