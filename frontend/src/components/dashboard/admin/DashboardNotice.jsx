import PropTypes from "prop-types";

import { NotificationsActive } from "@mui/icons-material";

import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

const DashboardNotice = ({
  title = "Information",
  message = "Dashboard is currently displaying placeholder values. Live statistics will be connected once dashboard APIs are implemented.",
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
      }}
    >
      <CardContent>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <NotificationsActive color="primary" />

          <Stack spacing={0.5}>
            <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
              {title}
            </Typography>

            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {message}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

DashboardNotice.propTypes = {
  title: PropTypes.string,
  message: PropTypes.string,
};

export default DashboardNotice;