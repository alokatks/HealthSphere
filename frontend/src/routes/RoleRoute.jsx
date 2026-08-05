import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import ROUTES from "@/constants/routes";

const RoleRoute = ({ allowedRoles }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />;
  }

  return <Outlet />;
};

export default RoleRoute;