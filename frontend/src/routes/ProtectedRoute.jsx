import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import ROUTES from "@/constants/routes";

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;

  return isAuthenticated ? <Outlet /> : <Navigate to={ROUTES.LOGIN} replace />;
};

export default ProtectedRoute;