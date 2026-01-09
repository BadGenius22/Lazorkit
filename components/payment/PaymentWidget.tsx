"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useWallet } from "@lazorkit/wallet";
import { usePayment, PaymentCurrency, PaymentResult, PaymentError } from "@/hooks/usePayment";
import { formatPaymentAmount } from "@/lib/solana-pay";
import { PaymentStatus } from "./PaymentStatus";

/**
 * Props for the PaymentWidget component
 * @description Configuration for the drop-in payment UI component
 */
export interface PaymentWidgetProps {
  // ═══════════════════════════════════════════════════════════════════════════
  // REQUIRED
  // ═══════════════════════════════════════════════════════════════════════════

  /** Solana wallet address to receive payments (base58 encoded) */
  merchantAddress: string;

  // ═══════════════════════════════════════════════════════════════════════════
  // AMOUNT CONFIGURATION
  // ═══════════════════════════════════════════════════════════════════════════

  /** Fixed payment amount in SOL. If omitted with allowCustomAmount=true, user enters amount */
  amount?: number;
  /** Currency for fee payment (reserved for future multi-currency support) */
  currency?: PaymentCurrency;
  /** Allow user to enter custom amount. If false, uses fixed `amount` prop */
  allowCustomAmount?: boolean;

  // ═══════════════════════════════════════════════════════════════════════════
  // MERCHANT BRANDING
  // ═══════════════════════════════════════════════════════════════════════════

  /** Business name displayed at top of widget */
  merchantName?: string;
  /** URL to merchant logo image (displayed as 48x48 rounded) */
  merchantLogo?: string;
  /** Payment description (e.g., "Coffee - Large") */
  description?: string;
  /** Merchant reference ID for tracking/reconciliation */
  reference?: string;

  // ═══════════════════════════════════════════════════════════════════════════
  // FEATURE TOGGLES
  // ═══════════════════════════════════════════════════════════════════════════

  /** Enable gasless payments via Paymaster (default: true) */
  enableGasless?: boolean;

  // ═══════════════════════════════════════════════════════════════════════════
  // CALLBACKS
  // ═══════════════════════════════════════════════════════════════════════════

  /** Called when payment processing begins */
  onPaymentStart?: () => void;
  /** Called when payment completes successfully with transaction details */
  onPaymentSuccess?: (result: PaymentResult) => void;
  /** Called when payment fails with error information */
  onPaymentError?: (error: PaymentError) => void;
  /** Called when user cancels the passkey/biometric prompt */
  onPaymentCancel?: () => void;

  // ═══════════════════════════════════════════════════════════════════════════
  // STYLING
  // ═══════════════════════════════════════════════════════════════════════════

  /** Additional CSS classes to apply to the widget container */
  className?: string;
}

/**
 * Drop-in payment widget for accepting SOL payments
 *
 * @description
 * A self-contained payment component that handles the complete payment flow:
 * - Passkey/biometric wallet connection
 * - Amount entry (fixed or custom)
 * - Fee method selection (SOL or USDC/gasless)
 * - Transaction signing and submission
 * - Success/error state display
 *
 * @example
 * ```tsx
 * // Fixed amount checkout
 * <PaymentWidget
 *   merchantAddress="YOUR_WALLET_ADDRESS"
 *   merchantName="Coffee Shop"
 *   description="Latte (Large)"
 *   amount={0.05}
 *   enableGasless
 *   onPaymentSuccess={(result) => {
 *     console.log("Payment received!", result.signature);
 *     // Redirect to success page or update order status
 *   }}
 * />
 *
 * // Donation/tip jar (custom amount)
 * <PaymentWidget
 *   merchantAddress="YOUR_WALLET_ADDRESS"
 *   merchantName="Creator Fund"
 *   description="Support my work"
 *   allowCustomAmount
 *   enableGasless
 * />
 * ```
 *
 * @param props - Widget configuration
 * @returns Rendered payment widget component
 *
 * @see {@link PaymentWidgetProps} for all configuration options
 * @see {@link PaymentResult} for success callback data structure
 */
export function PaymentWidget({
  merchantAddress,
  amount: initialAmount,
  // currency prop reserved for future multi-currency support
  currency: _currency = "SOL",
  allowCustomAmount = false,
  merchantName,
  merchantLogo,
  description,
  reference,
  enableGasless = true,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  className = "",
}: PaymentWidgetProps) {
  // Suppress unused variable warning - currency reserved for future use
  void _currency;
  const { isConnected } = useWallet();

  // Local state for custom amount
  const [customAmount, setCustomAmount] = useState<string>(initialAmount?.toString() || "");
  // Fee payment method: USDC = gasless, SOL = pay fees with SOL
  const [feeMethod, setFeeMethod] = useState<PaymentCurrency>(enableGasless ? "USDC" : "SOL");

  // Payment hook
  const { status, result, error, isProcessing, pay, reset } = usePayment({
    merchantAddress,
    onPaymentStart,
    onPaymentSuccess,
    onPaymentError,
    onPaymentCancel,
  });

  // Determine final amount
  const finalAmount = useMemo(() => {
    if (allowCustomAmount) {
      const parsed = parseFloat(customAmount);
      return isNaN(parsed) ? 0 : parsed;
    }
    return initialAmount || 0;
  }, [allowCustomAmount, customAmount, initialAmount]);

  // Handle payment (always pay in SOL, feeMethod determines how fees are paid)
  const handlePay = () => {
    if (finalAmount <= 0) return;
    pay(finalAmount, feeMethod, reference);
  };

  // Handle retry
  const handleRetry = () => {
    reset();
    handlePay();
  };

  // Validate amount input
  const handleAmountChange = (value: string) => {
    // Allow empty string, numbers, and one decimal point
    if (value === "" || /^\d*\.?\d*$/.test(value)) {
      setCustomAmount(value);
    }
  };

  const isAmountValid = finalAmount > 0;
  const canPay = isAmountValid && !isProcessing && status !== "success";

  return (
    <div className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm ${className}`}>
      {/* Merchant Header */}
      <div className="mb-6 text-center">
        {merchantLogo && (
          <Image
            src={merchantLogo}
            alt={merchantName || "Merchant"}
            width={48}
            height={48}
            className="mx-auto mb-3 rounded-full object-cover"
            unoptimized
          />
        )}
        {merchantName && (
          <h3 className="text-lg font-semibold text-gray-900">{merchantName}</h3>
        )}
        {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
      </div>

      {/* Amount Section */}
      <div className="mb-6">
        {allowCustomAmount ? (
          <div>
            <label htmlFor="payment-amount" className="block text-sm font-medium text-gray-700">
              Amount
            </label>
            <div className="relative mt-1">
              <input
                type="text"
                id="payment-amount"
                value={customAmount}
                onChange={(e) => handleAmountChange(e.target.value)}
                placeholder="0.00"
                disabled={isProcessing}
                className="block w-full rounded-lg border border-gray-300 px-4 py-3 pr-16 text-lg font-medium text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500 disabled:bg-gray-100"
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <span className="text-gray-500">SOL</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Amount to pay</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {formatPaymentAmount(finalAmount, "SOL")}
            </p>
          </div>
        )}

        {/* Fee Payment Method Toggle (if gasless enabled) */}
        {enableGasless && (
          <fieldset className="mt-4">
            <legend className="block text-sm font-medium text-gray-700">Pay fees with</legend>
            <div className="mt-2 flex gap-2" role="group" aria-label="Fee payment method">
              <button
                type="button"
                onClick={() => setFeeMethod("USDC")}
                disabled={isProcessing}
                aria-pressed={feeMethod === "USDC"}
                aria-label="Pay fees with USDC (Gasless option)"
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  feeMethod === "USDC"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50`}
              >
                USDC (Gasless)
              </button>
              <button
                type="button"
                onClick={() => setFeeMethod("SOL")}
                disabled={isProcessing}
                aria-pressed={feeMethod === "SOL"}
                aria-label="Pay fees with SOL"
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  feeMethod === "SOL"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50`}
              >
                SOL
              </button>
            </div>
          </fieldset>
        )}
      </div>

      {/* Payment Status */}
      <PaymentStatus
        status={status}
        result={result}
        error={error}
        onRetry={handleRetry}
        onReset={reset}
      />

      {/* Pay Button */}
      {status !== "success" && (
        <button
          onClick={handlePay}
          disabled={!canPay}
          className="mt-4 w-full rounded-lg bg-purple-600 px-4 py-3 text-base font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isProcessing ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-5 w-5 animate-spin"
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
              Processing...
            </span>
          ) : isConnected ? (
            "Pay with Passkey"
          ) : (
            "Connect & Pay"
          )}
        </button>
      )}

      {/* Footer */}
      <div className="mt-4 flex items-center justify-center gap-1 text-xs text-gray-400">
        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <span>Secured by LazorKit</span>
      </div>
    </div>
  );
}
