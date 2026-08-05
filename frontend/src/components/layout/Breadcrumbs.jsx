import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import {
  Breadcrumbs,
  Link,
  Typography,
} from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

import breadcrumbConfig from "@/constants/breadcrumbs";

const AppBreadcrumbs = () => {
  const { pathname } = useLocation();

  const breadcrumbs = breadcrumbConfig[pathname];

  if (!breadcrumbs) {
    return null;
  }

  return (
    <Breadcrumbs
      separator={<NavigateNextRoundedIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      {breadcrumbs.map((item, index) => {
        const isLast = index === breadcrumbs.length - 1;

        if (isLast || !item.path) {
          return (
            <Typography
              key={item.label}
              sx={{ color: "text.primary", fontWeight: 600 }}
            >
              {item.label}
            </Typography>
          );
        }

        return (
          <Link
            key={item.label}
            component={RouterLink}
            underline="hover"
            to={item.path}
            sx={{ color: "inherit" }}
          >
            {item.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default AppBreadcrumbs;