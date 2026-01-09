"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { getExplorerUrl } from "@/lib/constants";

type FeeToken = "SOL" | "USDC";

interface TransactionResult {
  status: "idle" | "loading" | "success" | "error";
  signature?: string;
  error?: string;
}

export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [feeToken, setFeeToken] = useState<FeeToken>("USDC");
  const [result, setResult] = useState<TransactionResult>({ status: "idle" });

  // Validation
  const [errors, setErrors] = useState<{ recipient?: string; amount?: string }>(
    {}
  );

  const validateRecipient = (value: string): string | undefined => {
    if (!value.trim()) {
      return "Recipient address is required";
    }
    try {
      new PublicKey(value);
      return undefined;
    } catch {
      return "Invalid Solana address";
    }
  };

  const validateAmount = (value: string): string | undefined => {
    if (!value.trim()) {
      return "Amount is required";
    }
    const num = parseFloat(value);
    if (isNaN(num) || num <= 0) {
      return "Amount must be greater than 0";
    }
    if (num > 1000) {
      return "Amount too large (max 1000 SOL for safety)";
    }
    return undefined;
  };

  const handleRecipientChange = (value: string) => {
    setRecipient(value);
    if (errors.recipient) {
      setErrors((prev) => ({ ...prev, recipient: validateRecipient(value) }));
    }
  };

  const handleAmountChange = (value: string) => {
    setAmount(value);
    if (errors.amount) {
      setErrors((prev) => ({ ...prev, amount: validateAmount(value) }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const recipientError = validateRecipient(recipient);
    const amountError = validateAmount(amount);

    if (recipientError || amountError) {
      setErrors({ recipient: recipientError, amount: amountError });
      return;
    }

    if (!smartWalletPubkey) {
      setResult({ status: "error", error: "Wallet not connected" });
      return;
    }

    setResult({ status: "loading" });

    try {
      const recipientPubkey = new PublicKey(recipient);
      const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

      const transferInstruction = SystemProgram.transfer({
        fromPubkey: smartWalletPubkey,
        toPubkey: recipientPubkey,
        lamports,
      });

      const signature = await signAndSendTransaction({
        instructions: [transferInstruction],
        transactionOptions: {
          feeToken: feeToken === "USDC" ? "USDC" : undefined,
        },
      });

      setResult({ status: "success", signature });
      // Reset form on success
      setRecipient("");
      setAmount("");
    } catch (err) {
      const error = err as Error;

      // Handle user cancellation silently
      if (error.name === "UserCancelled" || error.message?.includes("cancel")) {
        setResult({ status: "idle" });
        return;
      }

      // User-friendly error messages
      let errorMessage = error.message || "Transaction failed";
      if (error.message?.includes("insufficient")) {
        errorMessage = "Insufficient balance for this transfer";
      } else if (error.message?.includes("paymaster")) {
        errorMessage = "Paymaster error - try using SOL for fees instead";
      }

      setResult({ status: "error", error: errorMessage });
    }
  };

  const isFormValid =
    recipient.trim() &&
    amount.trim() &&
    !validateRecipient(recipient) &&
    !validateAmount(amount);

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Recipient Input */}
        <div>
          <label
            htmlFor="recipient"
            className="block text-sm font-medium text-gray-700"
          >
            Recipient Address
          </label>
          <input
            type="text"
            id="recipient"
            value={recipient}
            onChange={(e) => handleRecipientChange(e.target.value)}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                recipient: validateRecipient(recipient),
              }))
            }
            placeholder="Enter Solana address"
            className={`mt-1 block w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.recipient
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
            }`}
            disabled={result.status === "loading"}
          />
          {errors.recipient && (
            <p className="mt-1 text-sm text-red-500">{errors.recipient}</p>
          )}
        </div>

        {/* Amount Input */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount (SOL)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => handleAmountChange(e.target.value)}
            onBlur={() =>
              setErrors((prev) => ({
                ...prev,
                amount: validateAmount(amount),
              }))
            }
            placeholder="0.00"
            step="0.001"
            min="0"
            className={`mt-1 block w-full rounded-lg border px-4 py-2 text-sm focus:outline-none focus:ring-2 ${
              errors.amount
                ? "border-red-500 focus:ring-red-500"
                : "border-gray-300 focus:ring-purple-500 focus:border-purple-500"
            }`}
            disabled={result.status === "loading"}
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        {/* Fee Token Selector */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Pay Fees With
          </label>
          <div className="mt-2 flex gap-2">
            <button
              type="button"
              onClick={() => setFeeToken("USDC")}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                feeToken === "USDC"
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={result.status === "loading"}
            >
              USDC (Gasless)
            </button>
            <button
              type="button"
              onClick={() => setFeeToken("SOL")}
              className={`flex-1 rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
                feeToken === "SOL"
                  ? "border-purple-500 bg-purple-50 text-purple-700"
                  : "border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              disabled={result.status === "loading"}
            >
              SOL
            </button>
          </div>
          <p className="mt-1 text-xs text-gray-500">
            {feeToken === "USDC"
              ? "Transaction fees paid by Paymaster - no SOL needed!"
              : "Standard transaction with SOL for gas fees"}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!isFormValid || result.status === "loading"}
          className="w-full rounded-lg bg-purple-600 px-4 py-3 text-sm font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:bg-gray-400"
        >
          {result.status === "loading" ? (
            <span className="flex items-center justify-center gap-2">
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
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
              Sending...
            </span>
          ) : (
            "Send SOL"
          )}
        </button>
      </form>

      {/* Result Display */}
      {result.status === "success" && result.signature && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-4">
          <div className="flex items-center gap-2 text-green-700">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
            <span className="font-medium">Transaction Successful!</span>
          </div>
          <p className="mt-2 text-sm text-green-600">
            Signature:{" "}
            <code className="rounded bg-green-100 px-1">
              {result.signature.slice(0, 20)}...
            </code>
          </p>
          <a
            href={getExplorerUrl(result.signature)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:underline"
          >
            View on Solana Explorer
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
        </div>
      )}

      {result.status === "error" && result.error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2 text-red-700">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
            <span className="font-medium">Transaction Failed</span>
          </div>
          <p className="mt-2 text-sm text-red-600">{result.error}</p>
          <button
            onClick={() => setResult({ status: "idle" })}
            className="mt-2 text-sm font-medium text-red-700 hover:underline"
          >
            Try Again
          </button>
        </div>
      )}
    </div>
  );
}
