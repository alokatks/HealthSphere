import PropTypes from "prop-types";

import {
  Card,
  CardContent,
  Grid,
  Stack,
  Typography,
  Box,
} from "@mui/material";

const StatsCards = ({ stats }) => {
  return (
    <Grid container spacing={3}>
      {stats.map((item) => {
        const Icon = item.icon;

        return (
          <Grid
            key={item.title}
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >
            <Card
              elevation={2}
              sx={{
                height: "100%",
                borderRadius: 3,
                transition: "all 0.25s ease",
                "&:hover": {
                  transform: "translateY(-4px)",
                  boxShadow: 6,
                },
              }}
            >
              <CardContent>
                <Stack
                  direction="row"
                  sx={{ justifyContent: "space-between", alignItems: "center" }}
                >
                  <Box>
                    <Typography
                      variant="body2"
                      gutterBottom
                      sx={{ color: "text.secondary" }}
                    >
                      {item.title}
                    </Typography>

                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      {item.value}
                    </Typography>

                    {item.subtitle && (
                      <Typography
                        variant="body2"
                        sx={{ color: "success.main", mt: 1 }}
                      >
                        {item.subtitle}
                      </Typography>
                    )}
                  </Box>

                  <Box
                    sx={{
                      width: 58,
                      height: 58,
                      borderRadius: "50%",
                      bgcolor: item.color,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Icon
                      sx={{
                        color: "#fff",
                        fontSize: 30,
                      }}
                    />
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
};

StatsCards.propTypes = {
  stats: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      value: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.number,
      ]).isRequired,
      subtitle: PropTypes.string,
      icon: PropTypes.elementType.isRequired,
      color: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default StatsCards;