/**
 * Application constants and configuration
 * @module lib/constants
 * @description Centralized configuration for RPC endpoints, Explorer URLs, and utility functions
 */

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/** Solana RPC endpoint URL (from NEXT_PUBLIC_RPC_URL) */
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;

/** LazorKit Portal URL for passkey management (from NEXT_PUBLIC_PORTAL_URL) */
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL!;

/** Paymaster URL for gasless transactions (from NEXT_PUBLIC_PAYMASTER_URL) */
export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL!;

// ═══════════════════════════════════════════════════════════════════════════════
// SOLANA EXPLORER CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/** Base URL for Solscan block explorer */
export const EXPLORER_BASE_URL = "https://solscan.io";

/** Solana cluster for explorer links */
export const CLUSTER = "devnet";

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generate Solscan URL for a transaction
 *
 * @param signature - Transaction signature (base58 encoded)
 * @returns Full URL to view transaction on Solscan
 *
 * @example
 * ```ts
 * const url = getExplorerUrl("5xK9p...");
 * // Returns: "https://solscan.io/tx/5xK9p...?cluster=devnet"
 * ```
 */
export function getExplorerUrl(signature: string): string {
  return `${EXPLORER_BASE_URL}/tx/${signature}?cluster=${CLUSTER}`;
}

/**
 * Generate Solscan URL for a wallet account
 *
 * @param address - Wallet address (base58 encoded)
 * @returns Full URL to view account on Solscan
 *
 * @example
 * ```ts
 * const url = getAccountUrl("7xKp...");
 * // Returns: "https://solscan.io/account/7xKp...?cluster=devnet"
 * ```
 */
export function getAccountUrl(address: string): string {
  return `${EXPLORER_BASE_URL}/account/${address}?cluster=${CLUSTER}`;
}

/**
 * Truncate a Solana address for display
 *
 * @param address - Full wallet address (base58 encoded)
 * @param chars - Number of characters to show at start and end (default: 4)
 * @returns Truncated address like "7xKp...3mNq"
 *
 * @example
 * ```ts
 * truncateAddress("7xKpQR9vT6mY1pLnW8hJ3mNq", 4);
 * // Returns: "7xKp...3mNq"
 *
 * truncateAddress("7xKpQR9vT6mY1pLnW8hJ3mNq", 6);
 * // Returns: "7xKpQR...hJ3mNq"
 * ```
 */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format lamports as human-readable SOL amount
 *
 * @param lamports - Amount in lamports (1 SOL = 1,000,000,000 lamports)
 * @returns Formatted string with locale-appropriate separators
 *
 * @example
 * ```ts
 * formatSol(1_500_000_000);  // "1.50"
 * formatSol(500_000);        // "0.0005"
 * formatSol(1_234_567_890);  // "1.23456789"
 * ```
 */
export function formatSol(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return sol.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  });
}
