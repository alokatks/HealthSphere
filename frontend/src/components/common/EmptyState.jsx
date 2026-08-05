import PropTypes from "prop-types";

import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

import {
  Box,
  Button,
  Stack,
  Typography,
} from "@mui/material";

const EmptyState = ({
  title = "No Data Found",
  description = "There is nothing to display at the moment.",
  icon,
  actionLabel,
  onAction,
}) => {
  const IconComponent = icon || InboxOutlinedIcon;

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
        sx={{ alignItems: "center", maxWidth: 420, textAlign: "center" }}
      >
        <IconComponent
          sx={{
            fontSize: 72,
            color: "text.disabled",
          }}
        />

        <Typography variant="h5" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>

        <Typography variant="body1" sx={{ color: "text.secondary" }}>
          {description}
        </Typography>

        {actionLabel && onAction && (
          <Button
            variant="contained"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Box>
  );
};

EmptyState.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  icon: PropTypes.elementType,
  actionLabel: PropTypes.string,
  onAction: PropTypes.func,
};

export default EmptyState;