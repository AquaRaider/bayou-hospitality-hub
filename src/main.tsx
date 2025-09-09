// src/main.tsx
import React from "react";
import { createRoot } from "react-dom/client";
import { ErrorBoundary } from "react-error-boundary";
import App from "./App.tsx";
import "./index.css";

// Simple production-safe fallback UI
function Fallback() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full rounded-xl border border-black/10 bg-white p-6 text-center shadow">
        <h1 className="text-xl font-semibold text-[#4d5a3f]">Something went wrong</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Please refresh the page. If the problem persists, try again later.
        </p>
      </div>
    </div>
  );
}

// Optional: send errors to your logging backend later
function onError(error: Error, info: { componentStack: string }) {
  // eslint-disable-next-line no-console
  console.error("[ErrorBoundary]", error, info);
}

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary FallbackComponent={Fallback} onError={onError}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ErrorBoundary>
);
