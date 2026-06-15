import { AlertTriangle, RefreshCw } from "lucide-react";
import type { FallbackProps } from "react-error-boundary";

export const ErrorBoundaryFallback = ({
  error,
  resetErrorBoundary,
}: FallbackProps) => {
  const message =
    error instanceof Error ? error.message : "An unexpected error occurred.";

  return (
    <div
      role="alert"
      className="flex min-h-screen flex-col items-center justify-center bg-white px-4 py-24 dark:bg-gray-900"
    >
      <div className="flex w-full max-w-md flex-col items-center gap-6 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
          <AlertTriangle
            className="size-8 text-red-600 dark:text-red-400"
            aria-hidden
          />
        </div>

        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            The application encountered an unexpected error. You can try again
            or refresh the page.
          </p>
        </div>

        <div className="w-full rounded-lg border border-red-200 bg-red-50 px-4 py-3 dark:border-red-800 dark:bg-red-900/20">
          <p className="font-mono text-xs break-words text-red-700 dark:text-red-300">
            {message}
          </p>
        </div>

        <button
          onClick={resetErrorBoundary}
          className="outline-primary-600 dark:outline-primary-500 inline-flex items-center gap-2 rounded-lg bg-blue-700 px-5 py-2.5 text-sm font-medium text-white outline-offset-2 transition-colors hover:bg-blue-800 focus:outline-2 dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          <RefreshCw className="size-4" aria-hidden />
          Try again
        </button>
      </div>
    </div>
  );
};
