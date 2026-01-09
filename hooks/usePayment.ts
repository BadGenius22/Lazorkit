"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getExplorerUrl } from "@/lib/constants";

/**
 * Payment flow status states
 * @description Tracks the current state of a payment transaction
 * - `idle`: No payment in progress, ready to start
 * - `connecting`: Wallet connection/passkey authentication in progress
 * - `processing`: Transaction is being signed and sent to the network
 * - `success`: Payment completed successfully
 * - `error`: Payment failed with an error
 */
export type PaymentStatus = "idle" | "connecting" | "processing" | "success" | "error";

/**
 * Supported payment currencies
 * @description Currency options for fee payment
 * - `SOL`: Pay transaction fees with SOL (standard)
 * - `USDC`: Pay fees with USDC via Paymaster (gasless for user)
 */
export type PaymentCurrency = "SOL" | "USDC";

/**
 * Successful payment result
 * @description Contains all information about a completed payment
 */
export interface PaymentResult {
  /** Transaction signature (base58 encoded) */
  signature: string;
  /** Direct link to view transaction on Solana Explorer */
  explorerUrl: string;
  /** Amount transferred in SOL */
  amount: number;
  /** Currency used for fee payment */
  currency: PaymentCurrency;
  /** Optional merchant reference ID for tracking */
  reference?: string;
  /** Unix timestamp when payment was confirmed */
  timestamp: number;
}

/**
 * Payment error information
 * @description Structured error with recovery guidance
 */
export interface PaymentError {
  /** Error code for programmatic handling (e.g., 'INSUFFICIENT_BALANCE', 'PAYMASTER_ERROR') */
  code: string;
  /** Human-readable error message for display */
  message: string;
  /** Whether the user can retry the payment */
  recoverable: boolean;
}

/**
 * Configuration options for usePayment hook
 * @description Setup merchant details and event callbacks
 */
export interface UsePaymentOptions {
  /** Solana wallet address to receive payments (base58 encoded) */
  merchantAddress: string;
  /** Called when payment processing begins */
  onPaymentStart?: () => void;
  /** Called when payment completes successfully */
  onPaymentSuccess?: (result: PaymentResult) => void;
  /** Called when payment fails with error details */
  onPaymentError?: (error: PaymentError) => void;
  /** Called when user cancels biometric/passkey prompt */
  onPaymentCancel?: () => void;
}

/**
 * Return value from usePayment hook
 * @description State and methods for managing payments
 */
export interface UsePaymentResult {
  /** Current payment flow status */
  status: PaymentStatus;
  /** Payment result if successful, null otherwise */
  result: PaymentResult | null;
  /** Error details if failed, null otherwise */
  error: PaymentError | null;
  /** Whether wallet is currently connected */
  isConnected: boolean;
  /** Whether a payment is in progress (connecting or processing) */
  isProcessing: boolean;
  /** Initiate a payment transaction */
  pay: (amount: number, currency: PaymentCurrency, reference?: string) => Promise<void>;
  /** Reset state to idle for a new payment */
  reset: () => void;
}

/**
 * React hook for processing SOL payments with LazorKit SDK
 *
 * @description
 * Provides a complete payment flow with passkey authentication and optional
 * gasless transactions via Paymaster. Handles wallet connection, transaction
 * building, signing, and comprehensive error handling.
 *
 * @example
 * ```tsx
 * const { pay, status, result, error, reset } = usePayment({
 *   merchantAddress: "YOUR_WALLET_ADDRESS",
 *   onPaymentSuccess: (result) => console.log("Paid!", result.signature),
 *   onPaymentError: (error) => console.error(error.message),
 * });
 *
 * // Initiate payment (will prompt for passkey if not connected)
 * await pay(0.05, "USDC"); // 0.05 SOL with gasless fees
 * ```
 *
 * @param options - Configuration for merchant and callbacks
 * @returns Payment state and control methods
 *
 * @see {@link PaymentResult} for successful payment data structure
 * @see {@link PaymentError} for error handling
 */
export function usePayment(options: UsePaymentOptions): UsePaymentResult {
  const { merchantAddress, onPaymentStart, onPaymentSuccess, onPaymentError, onPaymentCancel } = options;

  const { connect, isConnected, isConnecting, smartWalletPubkey, signAndSendTransaction } = useWallet();

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<PaymentError | null>(null);

  /**
   * Reset payment state to idle
   * @description Call after a successful payment to allow new transactions
   */
  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  /**
   * Initiate a payment transaction
   *
   * @description
   * Handles the complete payment flow:
   * 1. Validates amount and merchant address
   * 2. Connects wallet if not connected (triggers passkey prompt)
   * 3. Builds SOL transfer instruction
   * 4. Signs and sends transaction (with optional Paymaster for gasless)
   * 5. Returns result or error via callbacks
   *
   * @param amount - Amount to transfer in SOL (must be > 0)
   * @param currency - Fee payment method ('SOL' or 'USDC' for gasless)
   * @param reference - Optional merchant reference for tracking
   *
   * @throws Handles errors internally, reports via onPaymentError callback
   */
  const pay = useCallback(
    async (amount: number, currency: PaymentCurrency, reference?: string) => {
      // Validate amount - must be positive
      if (amount <= 0) {
        const paymentError: PaymentError = {
          code: "INVALID_AMOUNT",
          message: "Amount must be greater than 0",
          recoverable: true,
        };
        setError(paymentError);
        setStatus("error");
        onPaymentError?.(paymentError);
        return;
      }

      // Validate merchant address
      let merchantPubkey: PublicKey;
      try {
        merchantPubkey = new PublicKey(merchantAddress);
      } catch {
        const paymentError: PaymentError = {
          code: "INVALID_MERCHANT",
          message: "Invalid merchant address",
          recoverable: false,
        };
        setError(paymentError);
        setStatus("error");
        onPaymentError?.(paymentError);
        return;
      }

      try {
        // Connect if not connected
        if (!isConnected) {
          setStatus("connecting");
          await connect();
        }

        // Check if wallet is available after connect
        if (!smartWalletPubkey) {
          throw new Error("Wallet not available");
        }

        setStatus("processing");
        setError(null);
        onPaymentStart?.();

        // Build transfer instruction
        // Note: For USDC, we'd need SPL token transfer. For simplicity, we'll use SOL transfer.
        // In production, you'd add SPL token support here.
        const lamports = Math.floor(amount * LAMPORTS_PER_SOL);

        const instruction = SystemProgram.transfer({
          fromPubkey: smartWalletPubkey,
          toPubkey: merchantPubkey,
          lamports,
        });

        // Sign and send transaction
        const signature = await signAndSendTransaction({
          instructions: [instruction],
          transactionOptions: {
            feeToken: currency === "USDC" ? "USDC" : undefined,
          },
        });

        const paymentResult: PaymentResult = {
          signature,
          explorerUrl: getExplorerUrl(signature),
          amount,
          currency,
          reference,
          timestamp: Date.now(),
        };

        setResult(paymentResult);
        setStatus("success");
        onPaymentSuccess?.(paymentResult);
      } catch (err) {
        const error = err as Error;

        // User cancelled
        if (error.name === "UserCancelled" || error.message?.includes("cancel")) {
          setStatus("idle");
          onPaymentCancel?.();
          return;
        }

        // Determine error type
        let paymentError: PaymentError;

        if (error.message?.includes("insufficient")) {
          paymentError = {
            code: "INSUFFICIENT_BALANCE",
            message: "Insufficient balance for this payment",
            recoverable: false,
          };
        } else if (error.message?.includes("paymaster")) {
          paymentError = {
            code: "PAYMASTER_ERROR",
            message: "Fee sponsorship unavailable. Try using SOL for fees.",
            recoverable: true,
          };
        } else if (error.message?.includes("network") || error.message?.includes("fetch")) {
          paymentError = {
            code: "NETWORK_ERROR",
            message: "Network error. Please check your connection.",
            recoverable: true,
          };
        } else {
          paymentError = {
            code: "TRANSACTION_FAILED",
            message: error.message || "Payment failed",
            recoverable: true,
          };
        }

        setError(paymentError);
        setStatus("error");
        onPaymentError?.(paymentError);
      }
    },
    [
      merchantAddress,
      isConnected,
      connect,
      smartWalletPubkey,
      signAndSendTransaction,
      onPaymentStart,
      onPaymentSuccess,
      onPaymentError,
      onPaymentCancel,
    ]
  );

  return {
    status,
    result,
    error,
    isConnected,
    isProcessing: status === "processing" || status === "connecting" || isConnecting,
    pay,
    reset,
  };
}
