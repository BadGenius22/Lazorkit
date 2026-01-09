import { PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

// USDC mint address on devnet
export const USDC_MINT_DEVNET = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

export interface SolanaPayParams {
  recipient: string;
  amount?: number;
  currency?: "SOL" | "USDC";
  label?: string;
  message?: string;
  memo?: string;
  reference?: string;
}

/**
 * Creates a Solana Pay compatible URL for QR codes
 * Format: solana:<recipient>?amount=<amount>&spl-token=<mint>&label=<label>&message=<message>
 */
export function createSolanaPayUrl(params: SolanaPayParams): string {
  const { recipient, amount, currency = "SOL", label, message, memo, reference } = params;

  // Validate recipient address
  try {
    new PublicKey(recipient);
  } catch {
    throw new Error("Invalid recipient address");
  }

  // Build URL
  const url = new URL(`solana:${recipient}`);

  if (amount !== undefined && amount > 0) {
    url.searchParams.set("amount", amount.toString());
  }

  // Add SPL token mint for USDC
  if (currency === "USDC") {
    url.searchParams.set("spl-token", USDC_MINT_DEVNET);
  }

  if (label) {
    url.searchParams.set("label", label);
  }

  if (message) {
    url.searchParams.set("message", message);
  }

  if (memo) {
    url.searchParams.set("memo", memo);
  }

  if (reference) {
    url.searchParams.set("reference", reference);
  }

  return url.toString();
}

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
