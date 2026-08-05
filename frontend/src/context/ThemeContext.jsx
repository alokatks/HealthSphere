import { createContext, useContext, useMemo } from "react";

const ThemeContext = createContext(null);

export function ThemeProviderContext({ children }) {
  const value = useMemo(
    () => ({
      mode: "light",
    }),
    []
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

// Context and its consumer hook are intentionally co-located in one file
// (standard pattern) rather than split into a separate hook file just to
// satisfy Fast Refresh's component-only-exports preference.
// eslint-disable-next-line react-refresh/only-export-components
export function useThemeContext() {
  return useContext(ThemeContext);
}