import { useMemo } from "react";

import { navigationConfig } from "@/constants/navigation";
import { useAuth } from "@/context/AuthContext";

const useNavigation = () => {
  const { role } = useAuth();

  return useMemo(() => {
    return navigationConfig[role] || [];
  }, [role]);
};

export default useNavigation;