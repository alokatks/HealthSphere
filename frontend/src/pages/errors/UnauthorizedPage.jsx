import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import ROUTES from "@/constants/routes";

const UnauthorizedPage = () => {
  return (
    <Container maxWidth="sm">
      <Stack
        spacing={3}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <LockOutlinedIcon
          color="error"
          sx={{ fontSize: 90 }}
        />

        <Typography variant="h3" sx={{ fontWeight: 700 }}>
          403
        </Typography>

        <Typography variant="h5">
          Access Denied
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          You do not have permission to access this page.
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to={ROUTES.HOME}
        >
          Go Home
        </Button>
      </Stack>
    </Container>
  );
};

export default UnauthorizedPage;