import { useState } from "react";

import NotificationsNoneRoundedIcon from "@mui/icons-material/NotificationsNoneRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";

import {
  Badge,
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  List,
  ListItemButton,
  ListItemText,
  Menu,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { useNotification } from "@/context/NotificationContext";

const MAX_VISIBLE = 8;

const NotificationBell = () => {
  const [anchorEl, setAnchorEl] = useState(null);

  const { notifications, unreadCount, loading, error, markAsRead, markAllAsRead } =
    useNotification();

  const open = Boolean(anchorEl);

  const handleOpen = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleItemClick = (id) => {
    markAsRead(id);
  };

  const visible = notifications.slice(0, MAX_VISIBLE);

  return (
    <>
      <Tooltip title="Notifications">
        <IconButton
          color="inherit"
          onClick={handleOpen}
          aria-label={
            unreadCount > 0
              ? `Notifications, ${unreadCount} unread`
              : "Notifications"
          }
          aria-controls={open ? "notifications-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
        >
          <Badge color="error" badgeContent={unreadCount} max={99}>
            <NotificationsNoneRoundedIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      <Menu
        id="notifications-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        slotProps={{ paper: { sx: { width: 360, maxHeight: 480 } } }}
      >
        <Stack
          direction="row"
          sx={{ justifyContent: "space-between", alignItems: "center", px: 2, py: 1 }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
            Notifications
          </Typography>

          {unreadCount > 0 && (
            <Button
              size="small"
              startIcon={<DoneAllRoundedIcon fontSize="small" />}
              onClick={markAllAsRead}
            >
              Mark all read
            </Button>
          )}
        </Stack>

        <Divider />

        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
            <CircularProgress size={22} />
          </Box>
        )}

        {!loading && error && (
          <Box sx={{ px: 2, py: 3 }}>
            <Typography variant="body2" color="error">
              Couldn&apos;t load notifications.
            </Typography>
          </Box>
        )}

        {!loading && !error && visible.length === 0 && (
          <Box sx={{ px: 2, py: 3 }}>
            <Typography variant="body2" color="text.secondary">
              You&apos;re all caught up — no notifications.
            </Typography>
          </Box>
        )}

        {!loading && !error && visible.length > 0 && (
          <List disablePadding sx={{ maxHeight: 380, overflowY: "auto" }}>
            {visible.map((notification) => (
              <ListItemButton
                key={notification.id}
                onClick={() => handleItemClick(notification.id)}
                sx={{
                  alignItems: "flex-start",
                  py: 1.25,
                  bgcolor: notification.read ? "transparent" : "action.hover",
                }}
              >
                <ListItemText
                  primary={notification.message}
                  primaryTypographyProps={{
                    variant: "body2",
                    sx: { fontWeight: notification.read ? 400 : 600 },
                  }}
                  secondary={
                    notification.timestamp
                      ? new Date(notification.timestamp).toLocaleString()
                      : null
                  }
                  secondaryTypographyProps={{ variant: "caption" }}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Menu>
    </>
  );
};

export default NotificationBell;