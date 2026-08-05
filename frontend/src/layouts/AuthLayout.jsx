import { Box, Container, Paper } from "@mui/material";
import { Outlet } from "react-router-dom";

import AppLogo from "@/components/layout/AppLogo";

const AuthLayout = () => {
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
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <AppLogo />
          </Box>

          <Outlet />
        </Paper>
      </Container>
    </Box>
  );
};

export default AuthLayout;
