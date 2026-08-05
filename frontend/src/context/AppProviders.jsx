import { ThemeProvider } from "@mui/material/styles";

import { CssBaseline } from "@mui/material";

import theme from "@theme/theme";

import { AuthProvider } from "./AuthContext";
import { NotificationProvider } from "./NotificationContext";
import { ThemeProviderContext } from "./ThemeContext";

export default function AppProviders({ children }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <ThemeProviderContext>
        <AuthProvider>
          <NotificationProvider>{children}</NotificationProvider>
        </AuthProvider>
      </ThemeProviderContext>
    </ThemeProvider>
  );
}