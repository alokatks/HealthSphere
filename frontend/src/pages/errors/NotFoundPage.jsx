import SearchOffIcon from "@mui/icons-material/SearchOff";
import { Button, Container, Stack, Typography } from "@mui/material";
import { Link } from "react-router-dom";

import ROUTES from "@/constants/routes";

const NotFoundPage = () => {
  return (
    <Container maxWidth="sm">
      <Stack
        spacing={3}
        sx={{
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          textAlign: "center",
        }}
      >
        <SearchOffIcon
          color="primary"
          sx={{ fontSize: 90 }}
        />

        <Typography variant="h2" sx={{ fontWeight: 700 }}>
          404
        </Typography>

        <Typography variant="h5">
          Page Not Found
        </Typography>

        <Typography sx={{ color: "text.secondary" }}>
          The page you're looking for doesn't exist.
        </Typography>

        <Button
          variant="contained"
          component={Link}
          to={ROUTES.HOME}
        >
          Back to Home
        </Button>
      </Stack>
    </Container>
  );
};

export default NotFoundPage;