import {
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { Link, useLocation } from "react-router-dom";

const NavItem = ({ item, onClose }) => {
  const location = useLocation();

  const Icon = item.icon;

  const handleClick = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <ListItemButton
      component={Link}
      to={item.path}
      selected={location.pathname === item.path}
      onClick={handleClick}
    >
      <ListItemIcon>
        <Icon fontSize="small" />
      </ListItemIcon>

      <ListItemText primary={item.label} />
    </ListItemButton>
  );
};

export default NavItem;