"use client";

import { Component, ReactNode } from "react";

/**
 * Props for ErrorBoundary component
 */
interface ErrorBoundaryProps {
  /** Child components to wrap */
  children: ReactNode;
  /** Optional custom fallback UI */
  fallback?: ReactNode;
  /** Callback when error is caught */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

/**
 * State for ErrorBoundary component
 */
interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * Error boundary component for graceful error handling
 *
 * @description
 * Catches JavaScript errors in child component tree and displays
 * a fallback UI instead of crashing the whole app. Essential for
 * production-ready applications.
 *
 * Features:
 * - **Graceful degradation**: Shows user-friendly error message
 * - **Error recovery**: "Try Again" button to reset state
 * - **Error reporting**: Optional callback for logging/analytics
 * - **Custom fallback**: Override default UI with your own
 *
 * @example
 * ```tsx
 * // Basic usage - wrap your app or specific sections
 * <ErrorBoundary>
 *   <PaymentWidget {...props} />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // With error callback for logging
 * <ErrorBoundary
 *   onError={(error, info) => {
 *     console.error("Caught error:", error);
 *     analytics.logError(error, info.componentStack);
 *   }}
 * >
 *   <TransferForm />
 * </ErrorBoundary>
 * ```
 *
 * @example
 * ```tsx
 * // With custom fallback UI
 * <ErrorBoundary
 *   fallback={
 *     <div className="p-4 text-center">
 *       <p>Something went wrong. Please refresh.</p>
 *     </div>
 *   }
 * >
 *   <WalletInfo />
 * </ErrorBoundary>
 * ```
 *
 * @see https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    // Log error for debugging
    console.error("ErrorBoundary caught an error:", error, errorInfo);

    // Call optional error callback
    this.props.onError?.(error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({ hasError: false, error: null });
  };

  render(): ReactNode {
    if (this.state.hasError) {
      // Custom fallback provided
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          className="rounded-lg border border-red-200 bg-red-50 p-6"
          role="alert"
          aria-live="assertive"
        >
          <div className="flex items-start gap-4">
            <svg
              className="h-6 w-6 shrink-0 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-red-800">
                Something went wrong
              </h3>
              <p className="mt-1 text-sm text-red-700">
                An unexpected error occurred. Please try again or refresh the page.
              </p>
              {process.env.NODE_ENV === "development" && this.state.error && (
                <details className="mt-3">
                  <summary className="cursor-pointer text-sm font-medium text-red-600 hover:text-red-700">
                    Error details (dev only)
                  </summary>
                  <pre className="mt-2 overflow-auto rounded bg-red-100 p-2 text-xs text-red-800">
                    {this.state.error.message}
                    {"\n\n"}
                    {this.state.error.stack}
                  </pre>
                </details>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Try Again
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="rounded-lg bg-red-100 px-4 py-2 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
