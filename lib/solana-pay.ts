import { LAMPORTS_PER_SOL } from "@solana/web3.js";

/**
 * Formats amount for display with currency symbol
 */
export function formatPaymentAmount(amount: number, currency: "SOL" | "USDC"): string {
  if (currency === "SOL") {
    return `${amount.toFixed(4)} SOL`;
  }
  return `${amount.toFixed(2)} USDC`;
}

/**
 * Converts SOL amount to lamports
 */
export function solToLamports(sol: number): number {
  return Math.floor(sol * LAMPORTS_PER_SOL);
}

/**
 * Generates a unique reference key for payment tracking
 */
export function generatePaymentReference(): string {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substring(2, 8);
  return `pay_${timestamp}_${random}`;
}
