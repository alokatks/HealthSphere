import PropTypes from "prop-types";

import FavoriteRoundedIcon from "@mui/icons-material/FavoriteRounded";
import { Box, Typography } from "@mui/material";

import APP from "@/constants/app";

const AppLogo = ({
  compact = false,
  showIcon = true,
  color = "primary.main",
}) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
      {showIcon && (
        <FavoriteRoundedIcon
          sx={{
            color,
            fontSize: compact ? 24 : 30,
          }}
        />
      )}

      {!compact && (
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color,
            letterSpacing: 0.4,
            userSelect: "none",
          }}
        >
          {APP.NAME}
        </Typography>
      )}
    </Box>
  );
};

AppLogo.propTypes = {
  compact: PropTypes.bool,
  showIcon: PropTypes.bool,
  color: PropTypes.string,
};

export default AppLogo;