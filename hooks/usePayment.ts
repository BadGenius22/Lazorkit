"use client";

import { useState, useCallback } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getExplorerUrl } from "@/lib/constants";

export type PaymentStatus = "idle" | "connecting" | "processing" | "success" | "error";
export type PaymentCurrency = "SOL" | "USDC";

export interface PaymentResult {
  signature: string;
  explorerUrl: string;
  amount: number;
  currency: PaymentCurrency;
  reference?: string;
  timestamp: number;
}

export interface PaymentError {
  code: string;
  message: string;
  recoverable: boolean;
}

export interface UsePaymentOptions {
  merchantAddress: string;
  onPaymentStart?: () => void;
  onPaymentSuccess?: (result: PaymentResult) => void;
  onPaymentError?: (error: PaymentError) => void;
  onPaymentCancel?: () => void;
}

export interface UsePaymentResult {
  status: PaymentStatus;
  result: PaymentResult | null;
  error: PaymentError | null;
  isConnected: boolean;
  isProcessing: boolean;
  pay: (amount: number, currency: PaymentCurrency, reference?: string) => Promise<void>;
  reset: () => void;
}

export function usePayment(options: UsePaymentOptions): UsePaymentResult {
  const { merchantAddress, onPaymentStart, onPaymentSuccess, onPaymentError, onPaymentCancel } = options;

  const { connect, isConnected, isConnecting, smartWalletPubkey, signAndSendTransaction } = useWallet();

  const [status, setStatus] = useState<PaymentStatus>("idle");
  const [result, setResult] = useState<PaymentResult | null>(null);
  const [error, setError] = useState<PaymentError | null>(null);

  const reset = useCallback(() => {
    setStatus("idle");
    setResult(null);
    setError(null);
  }, []);

  const pay = useCallback(
    async (amount: number, currency: PaymentCurrency, reference?: string) => {
      // Validate amount
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
