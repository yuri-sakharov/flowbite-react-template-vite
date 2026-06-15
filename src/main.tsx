import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initThemeMode } from "flowbite-react";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeInit } from "../.flowbite-react/init";
import { NuqsAdapter } from "nuqs/adapters/react";
import { ErrorBoundary } from "react-error-boundary";
import { App } from "./App.tsx";
import { ErrorBoundaryFallback } from "./components";
import "./index.css";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeInit />
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
      </ErrorBoundary>
    </QueryClientProvider>
  </StrictMode>,
);

initThemeMode();
