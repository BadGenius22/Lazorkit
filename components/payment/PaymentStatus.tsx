"use client";

import { PaymentStatus as Status, PaymentResult, PaymentError } from "@/hooks/usePayment";

interface PaymentStatusProps {
  status: Status;
  result: PaymentResult | null;
  error: PaymentError | null;
  onRetry?: () => void;
  onReset?: () => void;
}

export function PaymentStatus({ status, result, error, onRetry, onReset }: PaymentStatusProps) {
  if (status === "idle") {
    return null;
  }

  // Processing state
  if (status === "connecting" || status === "processing") {
    return (
      <div className="rounded-lg border border-purple-200 bg-purple-50 p-4">
        <div className="flex items-center gap-3">
          <svg
            className="h-5 w-5 animate-spin text-purple-600"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
          <div>
            <p className="font-medium text-purple-800">
              {status === "connecting" ? "Connecting wallet..." : "Processing payment..."}
            </p>
            <p className="text-sm text-purple-600">
              {status === "connecting"
                ? "Please complete biometric authentication"
                : "Please wait while we confirm your transaction"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (status === "success" && result) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-start gap-3">
          <svg
            className="h-6 w-6 shrink-0 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-medium text-green-800">Payment Successful!</p>
            <p className="mt-1 text-sm text-green-700">
              {result.amount} {result.currency} sent successfully
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <a
                href={result.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
              >
                View on Explorer
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
              {onReset && (
                <button
                  onClick={onReset}
                  className="rounded-lg bg-green-100 px-3 py-1.5 text-sm font-medium text-green-700 transition-colors hover:bg-green-200"
                >
                  New Payment
                </button>
              )}
            </div>
            <p className="mt-2 text-xs text-green-600">
              Signature: {result.signature.slice(0, 16)}...{result.signature.slice(-8)}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (status === "error" && error) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-start gap-3">
          <svg
            className="h-6 w-6 shrink-0 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div className="flex-1">
            <p className="font-medium text-red-800">Payment Failed</p>
            <p className="mt-1 text-sm text-red-700">{error.message}</p>
            <div className="mt-3 flex gap-2">
              {error.recoverable && onRetry && (
                <button
                  onClick={onRetry}
                  className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                >
                  Try Again
                </button>
              )}
              {onReset && (
                <button
                  onClick={onReset}
                  className="rounded-lg bg-red-100 px-3 py-1.5 text-sm font-medium text-red-700 transition-colors hover:bg-red-200"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
