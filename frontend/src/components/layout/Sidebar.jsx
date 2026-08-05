import {
  Box,
  Divider,
  Drawer,
  List,
  Toolbar,
} from "@mui/material";

import { DRAWER_WIDTH, DRAWER_WIDTH_COLLAPSED } from "@/constants/layout";
import useNavigation from "@/hooks/useNavigation";

import NavItem from "./NavItem";

const Sidebar = ({ mobileOpen, onClose, desktopOpen = true }) => {
  const navigation = useNavigation();

  const renderList = (closeHandler, collapsed = false) => (
    <>
      <Toolbar
        sx={{
          justifyContent: collapsed ? "center" : "flex-start",
          px: collapsed ? 1 : 2,
        }}
      >
        <Box
          sx={{
            fontWeight: 700,
            fontSize: 20,
            color: "primary.main",
            whiteSpace: "nowrap",
            overflow: "hidden",
          }}
        >
          {collapsed ? "HS" : "HealthSphere"}
        </Box>
      </Toolbar>

      <Divider />

      <List>
        {navigation.map((item) => (
          <NavItem
            key={item.id}
            item={item}
            onClose={closeHandler}
            collapsed={collapsed}
          />
        ))}
      </List>
    </>
  );

  const desktopWidth = desktopOpen ? DRAWER_WIDTH : DRAWER_WIDTH_COLLAPSED;

  return (
    <>
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        sx={{
          display: {
            xs: "block",
            md: "none",
          },
          "& .MuiDrawer-paper": {
            width: DRAWER_WIDTH,
          },
        }}
      >
        {renderList(onClose, false)}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        open
        sx={{
          display: {
            xs: "none",
            md: "block",
          },
          width: desktopWidth,
          flexShrink: 0,
          whiteSpace: "nowrap",
          transition: (theme) =>
            theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          "& .MuiDrawer-paper": {
            position: "relative",
            width: desktopWidth,
            boxSizing: "border-box",
            overflowX: "hidden",
            border: "none",
            borderRight: (theme) => `1px solid ${theme.palette.divider}`,
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
          },
        }}
      >
        {renderList(undefined, !desktopOpen)}
      </Drawer>
    </>
  );
};

export default Sidebar;