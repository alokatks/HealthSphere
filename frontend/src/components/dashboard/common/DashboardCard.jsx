import PropTypes from "prop-types";

import {
  Card,
  CardContent,
} from "@mui/material";

import SectionHeader from "./SectionHeader";

const DashboardCard = ({
  title,
  subtitle,
  action,
  children,
}) => {
  return (
    <Card
      sx={{
        borderRadius: 3,
        height: "100%",
      }}
    >
      <CardContent>
        <SectionHeader
          title={title}
          subtitle={subtitle}
          action={action}
        />

        {children}
      </CardContent>
    </Card>
  );
};

DashboardCard.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  action: PropTypes.node,
  children: PropTypes.node.isRequired,
};

export default DashboardCard;