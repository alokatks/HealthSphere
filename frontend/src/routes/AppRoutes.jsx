import { lazy, Suspense } from "react";

import { Navigate, Route, Routes } from "react-router-dom";

import ROUTES from "@/constants/routes";
import ROLES from "@/constants/roles";

import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import RoleRoute from "./RoleRoute";

import AuthLayout from "@/layouts/AuthLayout";
import DashboardLayout from "@/layouts/DashboardLayout";

import TableSkeleton from "@/components/common/TableSkeleton";

import NotFoundPage from "@/pages/errors/NotFoundPage";
import UnauthorizedPage from "@/pages/errors/UnauthorizedPage";

import { useAuth } from "@/context/AuthContext";
import redirectByRole from "@/utils/redirectByRole";

// Route-level code splitting: each page (and anything it exclusively
// imports, e.g. recharts only being pulled in by ReportsPage) is fetched
// on navigation instead of bundled into the single main chunk. Layouts,
// route guards, and the small error pages above stay as regular imports —
// error pages in particular should still render even if a lazy chunk fails
// to load over a flaky connection.
const PatientsPage = lazy(() => import("@/pages/admin/PatientsPage"));
const PatientDetailsPage = lazy(() => import("@/pages/admin/PatientDetailsPage"));
const EditPatientPage = lazy(() => import("@/pages/admin/EditPatientPage"));
const DoctorsPage = lazy(() => import("@/pages/admin/DoctorsPage"));
const ReportsPage = lazy(() => import("@/pages/admin/ReportsPage"));
const AdminProfilePage = lazy(() => import("@/pages/admin/AdminProfilePage"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));

const ResetPasswordPage = lazy(() => import("@/pages/auth/ResetPasswordPage"));
const ForgotPasswordPage = lazy(() => import("@/pages/auth/ForgotPasswordPage"));
const RegisterPage = lazy(() => import("@/pages/auth/RegisterPage"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));

const ProfilePage = lazy(() => import("@/pages/common/ProfilePage"));

const DoctorDashboard = lazy(() => import("@/pages/doctor/DoctorDashboard"));
const DoctorAppointmentsPage = lazy(() => import("@/pages/doctor/DoctorAppointmentsPage"));
const DoctorRecordsPage = lazy(() => import("@/pages/doctor/DoctorRecordsPage"));
const DoctorPrescriptionsPage = lazy(() => import("@/pages/doctor/DoctorPrescriptionsPage"));
const PatientDashboard = lazy(() => import("@/pages/patient/PatientDashboard"));
const PatientAppointmentsPage = lazy(() => import("@/pages/patient/PatientAppointmentsPage"));
const PatientRecordsPage = lazy(() => import("@/pages/patient/PatientRecordsPage"));
const PatientPrescriptionsPage = lazy(() => import("@/pages/patient/PatientPrescriptionsPage"));
const PatientDocumentsPage = lazy(() => import("@/pages/patient/PatientDocumentsPage"));

const RootRedirect = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />;
  }

  return <Navigate to={redirectByRole(user?.role)} replace />;
};

// Shown while a lazy-loaded route chunk is being fetched. Reuses the same
// skeleton pattern already used for in-page data loading elsewhere, so the
// loading state is visually consistent across the app.
const RouteFallback = () => <TableSkeleton columns={4} rows={6} />;

const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<PublicRoute />}>
          <Route element={<AuthLayout />}>
            <Route path={ROUTES.LOGIN} element={<LoginPage />} />

            <Route path={ROUTES.REGISTER} element={<RegisterPage />} />

            <Route path={ROUTES.FORGOT_PASSWORD} element={<ForgotPasswordPage />} />

            <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
          </Route>
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route element={<RoleRoute allowedRoles={[ROLES.ADMIN]} />}>
              <Route path={ROUTES.ADMIN_DASHBOARD} element={<AdminDashboard />} />

              <Route path={ROUTES.ADMIN_PATIENTS} element={<PatientsPage />} />

              <Route
                path={ROUTES.ADMIN_PATIENT_DETAILS(":id")}
                element={<PatientDetailsPage />}
              />

              <Route
                path={ROUTES.ADMIN_PATIENT_EDIT(":id")}
                element={<EditPatientPage />}
              />

              <Route path={ROUTES.ADMIN_DOCTORS} element={<DoctorsPage />} />

              <Route path={ROUTES.ADMIN_REPORTS} element={<ReportsPage />} />

              <Route path={ROUTES.ADMIN_PROFILE} element={<AdminProfilePage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={[ROLES.DOCTOR]} />}>
              <Route path={ROUTES.DOCTOR_DASHBOARD} element={<DoctorDashboard />} />

              <Route
                path={ROUTES.DOCTOR_APPOINTMENTS}
                element={<DoctorAppointmentsPage />}
              />

              <Route path={ROUTES.DOCTOR_RECORDS} element={<DoctorRecordsPage />} />

              <Route
                path={ROUTES.DOCTOR_PRESCRIPTIONS}
                element={<DoctorPrescriptionsPage />}
              />

              <Route path={ROUTES.DOCTOR_PROFILE} element={<ProfilePage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={[ROLES.PATIENT]} />}>
              <Route path={ROUTES.PATIENT_DASHBOARD} element={<PatientDashboard />} />

              <Route
                path={ROUTES.PATIENT_APPOINTMENTS}
                element={<PatientAppointmentsPage />}
              />

              <Route
                path={ROUTES.PATIENT_MEDICAL_RECORDS}
                element={<PatientRecordsPage />}
              />

              <Route
                path={ROUTES.PATIENT_PRESCRIPTIONS}
                element={<PatientPrescriptionsPage />}
              />

              <Route
                path={ROUTES.PATIENT_DOCUMENTS}
                element={<PatientDocumentsPage />}
              />

              <Route path={ROUTES.PATIENT_PROFILE} element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />

        <Route path={ROUTES.HOME} element={<RootRedirect />} />

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
