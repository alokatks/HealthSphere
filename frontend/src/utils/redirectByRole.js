import ROUTES from "@/constants/routes";
import ROLES from "@/constants/roles";

const redirectByRole = (role) => {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.ADMIN_DASHBOARD;

    case ROLES.DOCTOR:
      return ROUTES.DOCTOR_DASHBOARD;

    case ROLES.PATIENT:
      return ROUTES.PATIENT_DASHBOARD;

    default:
      return ROUTES.LOGIN;
  }
};

export default redirectByRole;