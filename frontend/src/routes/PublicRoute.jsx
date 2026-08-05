import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "@/context/AuthContext";

import ROUTES from "@/constants/routes";
import ROLES from "@/constants/roles";

const PublicRoute = () => {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!isAuthenticated) {
    return <Outlet />;
  }

  switch (role) {
    case ROLES.ADMIN:
      return <Navigate to={ROUTES.ADMIN_DASHBOARD} replace />;

    case ROLES.DOCTOR:
      return <Navigate to={ROUTES.DOCTOR_DASHBOARD} replace />;

    case ROLES.PATIENT:
      return <Navigate to={ROUTES.PATIENT_DASHBOARD} replace />;

    default:
      return <Navigate to={ROUTES.LOGIN} replace />;
  }
};

export default PublicRoute;