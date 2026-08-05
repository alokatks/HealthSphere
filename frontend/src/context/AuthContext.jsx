import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import tokenStorage from "@/utils/tokenStorage";
import { getUserClaims, isTokenExpired } from "@/utils/jwt";

const AuthContext = createContext(null);

const normalizeRole = (claims) => {
  if (!claims) return null;

  const rawRole =
    claims.role ??
    claims.roles ??
    (Array.isArray(claims.authorities)
      ? claims.authorities[0]
      : claims.authorities);

  if (!rawRole) {
    return null;
  }

  return rawRole.replace(/^ROLE_/, "");
};

export function AuthProvider({ children }) {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedToken = tokenStorage.getToken();

    if (storedToken && !isTokenExpired(storedToken)) {
      const claims = getUserClaims(storedToken);

      setToken(storedToken);
      setUser({
        ...claims,
        role: normalizeRole(claims),
      });
    } else {
      tokenStorage.removeToken();
    }

    setLoading(false);
  }, []);

  const login = (jwt) => {
    tokenStorage.setToken(jwt);

    const claims = getUserClaims(jwt);

    setToken(jwt);
    setUser({
      ...claims,
      role: normalizeRole(claims),
    });
  };

  const logout = () => {
    tokenStorage.removeToken();
    setToken(null);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      token,
      user,
      loading,
      login,
      logout,
      isAuthenticated: Boolean(token),
      role: user?.role ?? null,
    }),
    [token, user, loading]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Context and its consumer hook are intentionally co-located in one file
// (standard pattern) rather than split into a separate hook file just to
// satisfy Fast Refresh's component-only-exports preference.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider.");
  }

  return context;
}