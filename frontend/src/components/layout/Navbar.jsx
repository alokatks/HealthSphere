import { useState } from "react";

import PropTypes from "prop-types";

import { useNavigate } from "react-router-dom";

import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import KeyboardArrowDownRoundedIcon from "@mui/icons-material/KeyboardArrowDownRounded";

import {
  AppBar,
  Avatar,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { useAuth } from "@/context/AuthContext";
import ROUTES from "@/constants/routes";
import ROLES from "@/constants/roles";
import NotificationBell from "@/components/notifications/NotificationBell";
import AppLogo from "@/components/layout/AppLogo";

const profileRouteForRole = (role) => {
  if (role === ROLES.DOCTOR) return ROUTES.DOCTOR_PROFILE;
  if (role === ROLES.PATIENT) return ROUTES.PATIENT_PROFILE;
  return ROUTES.PROFILE;
};

const Navbar = ({ onMenuClick }) => {
  const [anchorEl, setAnchorEl] = useState(null);

  const navigate = useNavigate();

  const { logout, role } = useAuth();

  const menuOpen = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleMenuClose();
    navigate(profileRouteForRole(role));
  };

  const handleLogout = () => {
    handleMenuClose();

    logout();

    navigate(ROUTES.LOGIN, {
      replace: true,
    });
  };

  return (
    <>
      <AppBar
        position="sticky"
        color="inherit"
        elevation={1}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
          backgroundColor: "background.paper",
        }}
      >
        <Toolbar
          sx={{
            justifyContent: "space-between",
            minHeight: 70,
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <IconButton
              edge="start"
              color="inherit"
              onClick={onMenuClick}
              aria-label="Open navigation menu"
            >
              <MenuRoundedIcon />
            </IconButton>

            <AppLogo compact />

            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Dashboard
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            {(role === ROLES.PATIENT || role === ROLES.DOCTOR) && <NotificationBell />}

            <Tooltip title="Account">
              <IconButton
                color="inherit"
                onClick={handleMenuOpen}
                aria-label="Open account menu"
                aria-controls={menuOpen ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={menuOpen ? "true" : undefined}
              >
                <Avatar
                  sx={{
                    width: 36,
                    height: 36,
                    bgcolor: "primary.main",
                    fontSize: 15,
                  }}
                >
                  A
                </Avatar>

                <KeyboardArrowDownRoundedIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </Toolbar>
      </AppBar>

      <Menu
        id="account-menu"
        anchorEl={anchorEl}
        open={menuOpen}
        onClose={handleMenuClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <MenuItem onClick={handleProfile}>
          <ListItemIcon>
            <PersonRoundedIcon fontSize="small" />
          </ListItemIcon>
          Profile
        </MenuItem>

        <Divider />

        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </>
  );
};

Navbar.propTypes = {
  onMenuClick: PropTypes.func.isRequired,
};

export default Navbar;
