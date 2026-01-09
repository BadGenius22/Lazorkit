/**
 * Payment utility functions
 * @module lib/solana-pay
 * @description Helper functions for formatting amounts and generating payment references
 */

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Format a payment amount with currency symbol for display
 *
 * @param amount - Numeric amount to format
 * @param currency - Currency type ('SOL' or 'USDC')
 * @returns Formatted string with appropriate decimal places
 *
 * @example
 * ```ts
 * formatPaymentAmount(0.0512, "SOL");  // "0.0512 SOL"
 * formatPaymentAmount(10.5, "USDC");   // "10.50 USDC"
 * ```
 */
export function formatPaymentAmount(amount: number, currency: "SOL" | "USDC"): string {
  if (currency === "SOL") {
    return `${amount.toFixed(4)} SOL`;
  }
  return `${amount.toFixed(2)} USDC`;
}

/**
 * Convert SOL amount to lamports (smallest unit)
 *
 * @param sol - Amount in SOL
 * @returns Amount in lamports (1 SOL = 1,000,000,000 lamports)
 *
 * @example
 * ```ts
 * solToLamports(1);     // 1_000_000_000
 * solToLamports(0.5);   // 500_000_000
 * solToLamports(0.001); // 1_000_000
 * ```
 *
 * @remarks Uses Math.floor to avoid floating point precision issues
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

/**
 * Generate a unique reference ID for payment tracking
 *
 * @returns Unique string in format "pay_{timestamp}_{random}"
 *
 * @example
 * ```ts
 * generatePaymentReference(); // "pay_lx5k2m_a1b2c3"
 * generatePaymentReference(); // "pay_lx5k2n_d4e5f6"
 * ```
 *
 * @remarks
 * - Uses base36 encoding for shorter strings
 * - Combines timestamp for ordering with random suffix for uniqueness
 * - Useful for merchant order tracking and reconciliation
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `pay_${timestamp}_${random}`;
}
