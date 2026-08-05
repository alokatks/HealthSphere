import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import "@services/api/interceptors";
import "@styles/global.css";

import App from "@/App";
import AppProviders from "@context/AppProviders";
import ErrorBoundary from "@/components/common/ErrorBoundary";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProviders>
        <ErrorBoundary>
          <App />
        </ErrorBoundary>
      </AppProviders>
    </BrowserRouter>
  </StrictMode>
);