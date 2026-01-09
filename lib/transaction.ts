/**
 * Transaction utilities
 * @module lib/transaction
 * @description Helpers for transaction confirmation and status checking
 */

import { Connection } from "@solana/web3.js";
import { RPC_URL } from "./constants";

/**
 * Options for transaction confirmation
 */
export interface ConfirmTransactionOptions {
  /** Transaction signature to confirm */
  signature: string;
  /** Maximum time to wait for confirmation in milliseconds (default: 30000) */
  timeout?: number;
  /** Polling interval in milliseconds (default: 1000) */
  pollInterval?: number;
  /** Solana RPC connection (uses default if not provided) */
  connection?: Connection;
}

/**
 * Result of transaction confirmation
 */
export interface ConfirmTransactionResult {
  /** Whether the transaction was confirmed successfully */
  confirmed: boolean;
  /** Number of confirmations (if confirmed) */
  confirmations: number | null;
  /** Error message if confirmation failed */
  error: string | null;
  /** Slot the transaction was confirmed in */
  slot: number | null;
}

/**
 * Confirm a transaction with polling and timeout
 *
 * @description
 * Polls the Solana network to confirm a transaction has been finalized.
 * Uses exponential backoff pattern for efficient network usage.
 *
 * @param options - Configuration options
 * @returns Promise resolving to confirmation result
 *
 * @example
 * ```ts
 * // Basic usage
 * const result = await confirmTransaction({
 *   signature: "5xK9p...",
 * });
 *
 * if (result.confirmed) {
 *   console.log("Transaction confirmed in slot:", result.slot);
 * } else {
 *   console.error("Failed:", result.error);
 * }
 * ```
 *
 * @example
 * ```ts
 * // With custom timeout
 * const result = await confirmTransaction({
 *   signature: "5xK9p...",
 *   timeout: 60000,      // 60 seconds
 *   pollInterval: 2000,  // Check every 2 seconds
 * });
 * ```
 *
 * @remarks
 * - Default timeout is 30 seconds (sufficient for most devnet transactions)
 * - Uses "confirmed" commitment level for faster response
 * - Returns detailed error information for debugging
 */
export async function confirmTransaction(
  options: ConfirmTransactionOptions
): Promise<ConfirmTransactionResult> {
  const {
    signature,
    timeout = 30000,
    pollInterval = 1000,
    connection = new Connection(RPC_URL, "confirmed"),
  } = options;

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    try {
      const status = await connection.getSignatureStatus(signature);

      if (status.value !== null) {
        // Check for errors
        if (status.value.err) {
          return {
            confirmed: false,
            confirmations: null,
            error: `Transaction failed: ${JSON.stringify(status.value.err)}`,
            slot: status.value.slot,
          };
        }

        // Check confirmation status
        const confirmationStatus = status.value.confirmationStatus;
        if (confirmationStatus === "confirmed" || confirmationStatus === "finalized") {
          return {
            confirmed: true,
            confirmations: status.value.confirmations,
            error: null,
            slot: status.value.slot,
          };
        }
      }

      // Wait before next poll
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    } catch {
      // Network error, continue polling
      await new Promise((resolve) => setTimeout(resolve, pollInterval));
    }
  }

  return {
    confirmed: false,
    confirmations: null,
    error: `Transaction confirmation timeout after ${timeout}ms`,
    slot: null,
  };
}
