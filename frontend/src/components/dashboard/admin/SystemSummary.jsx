import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

const SystemSummary = ({ summary }) => {
  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          System Summary
        </Typography>

        <Stack spacing={2}>
          {summary.map((item) => (
            <Stack
              key={item.label}
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "center" }}
            >
              <Typography sx={{ color: "text.secondary" }}>
                {item.label}
              </Typography>

              <Typography
                sx={{
                  fontWeight: 600,
                  color: item.color || "text.primary",
                }}
              >
                {item.value}
              </Typography>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

SystemSummary.propTypes = {
  summary: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      color: PropTypes.string,
    })
  ).isRequired,
};

export default SystemSummary;