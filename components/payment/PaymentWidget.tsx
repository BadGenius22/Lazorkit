"use client";

import { useState, useMemo } from "react";
import { QRCodeSVG } from "qrcode.react";
import { useWallet } from "@lazorkit/wallet";
import { usePayment, PaymentCurrency, PaymentResult, PaymentError } from "@/hooks/usePayment";
import { createSolanaPayUrl, formatPaymentAmount } from "@/lib/solana-pay";
import { PaymentStatus } from "./PaymentStatus";

export interface PaymentWidgetProps {
  // Required
  merchantAddress: string;

  // Amount configuration
  amount?: number;
  currency?: PaymentCurrency;
  allowCustomAmount?: boolean;

  // Merchant branding
  merchantName?: string;
  merchantLogo?: string;
  description?: string;
  reference?: string;

  // Feature toggles
  showQR?: boolean;
  enableGasless?: boolean;

  // Callbacks
  onPaymentStart?: () => void;
  onPaymentSuccess?: (result: PaymentResult) => void;
  onPaymentError?: (error: PaymentError) => void;
  onPaymentCancel?: () => void;

  // Styling
  className?: string;
}

export function PaymentWidget({
  merchantAddress,
  amount: initialAmount,
  currency: initialCurrency = "SOL",
  allowCustomAmount = false,
  merchantName,
  merchantLogo,
  description,
  reference,
  showQR = true,
  enableGasless = true,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
  className = "",
}: PaymentWidgetProps) {
  const { isConnected } = useWallet();

  // Local state for custom amount
  const [customAmount, setCustomAmount] = useState<string>(initialAmount?.toString() || "");
  const [selectedCurrency, setSelectedCurrency] = useState<PaymentCurrency>(initialCurrency);

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

  // Generate Solana Pay URL for QR code
  const solanaPayUrl = useMemo(() => {
    if (!merchantAddress || finalAmount <= 0) return null;
    try {
      return createSolanaPayUrl({
        recipient: merchantAddress,
        amount: finalAmount,
        currency: selectedCurrency,
        label: merchantName,
        message: description,
        reference,
      });
    } catch {
      return null;
    }
  }, [merchantAddress, finalAmount, selectedCurrency, merchantName, description, reference]);

  // Handle payment
  const handlePay = () => {
    if (finalAmount <= 0) return;
    pay(finalAmount, enableGasless ? "USDC" : selectedCurrency, reference);
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
          <img
            src={merchantLogo}
            alt={merchantName || "Merchant"}
            className="mx-auto mb-3 h-12 w-12 rounded-full object-cover"
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
                <span className="text-gray-500">{selectedCurrency}</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="rounded-lg bg-gray-50 p-4 text-center">
            <p className="text-sm text-gray-500">Amount to pay</p>
            <p className="mt-1 text-3xl font-bold text-gray-900">
              {formatPaymentAmount(finalAmount, selectedCurrency)}
            </p>
          </div>
        )}

        {/* Currency Toggle (if gasless enabled) */}
        {enableGasless && (
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700">Pay fees with</label>
            <div className="mt-2 flex gap-2">
              <button
                type="button"
                onClick={() => setSelectedCurrency("USDC")}
                disabled={isProcessing}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCurrency === "USDC"
                    ? "border-green-500 bg-green-50 text-green-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50`}
              >
                USDC (Gasless)
              </button>
              <button
                type="button"
                onClick={() => setSelectedCurrency("SOL")}
                disabled={isProcessing}
                className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                  selectedCurrency === "SOL"
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-300 text-gray-700 hover:bg-gray-50"
                } disabled:opacity-50`}
              >
                SOL
              </button>
            </div>
          </div>
        )}
      </div>

      {/* QR Code Section */}
      {showQR && solanaPayUrl && status === "idle" && (
        <div className="mb-6">
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex justify-center">
              <QRCodeSVG
                value={solanaPayUrl}
                size={180}
                level="M"
                includeMargin
                className="rounded-lg"
              />
            </div>
            <p className="mt-3 text-center text-xs text-gray-500">
              Scan with Phantom, Solflare, or any Solana Pay compatible wallet
            </p>
          </div>
        </div>
      )}

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
