import PropTypes from "prop-types";

import { TrendingUp } from "@mui/icons-material";

import {
  Card,
  CardContent,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";

const RecentActivity = ({ activities }) => {
  return (
    <Card sx={{ borderRadius: 3, height: "100%" }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Recent Activity
        </Typography>

        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          {activities.map((activity, index) => (
            <ListItem
              key={index}
              disableGutters
            >
              <ListItemIcon>
                <TrendingUp color="primary" />
              </ListItemIcon>

              <ListItemText
                primary={activity.title}
                secondary={activity.time}
              />
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      time: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default RecentActivity;