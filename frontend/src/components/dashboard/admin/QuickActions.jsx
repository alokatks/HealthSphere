import PropTypes from "prop-types";

import { ArrowForward } from "@mui/icons-material";

import {
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";

import { useNavigate } from "react-router-dom";

const QuickActions = ({ actions }) => {
  const navigate = useNavigate();

  return (
    <Card sx={{ borderRadius: 3 }}>
      <CardContent>
        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
          Quick Actions
        </Typography>

        <Stack spacing={2}>
          {actions.map((action) => (
            <Button
              key={action.title}
              variant="contained"
              endIcon={<ArrowForward />}
              onClick={() => navigate(action.path)}
            >
              {action.title}
            </Button>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

QuickActions.propTypes = {
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default QuickActions;