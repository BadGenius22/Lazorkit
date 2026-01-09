/**
 * Application constants and configuration
 */

// Environment variables (validated)
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL!;
export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL!;

// Solana Explorer
export const EXPLORER_BASE_URL = "https://explorer.solana.com";
export const CLUSTER = "devnet";

/**
 * Get Solana Explorer URL for a transaction signature
 */
export function getExplorerUrl(signature: string): string {
  return `${EXPLORER_BASE_URL}/tx/${signature}?cluster=${CLUSTER}`;
}

/**
 * Get Solana Explorer URL for an account address
 */
export function getAccountUrl(address: string): string {
  return `${EXPLORER_BASE_URL}/address/${address}?cluster=${CLUSTER}`;
}

/**
 * Truncate address for display (e.g., "7xKp...3mNq")
 */
export function truncateAddress(address: string, chars = 4): string {
  if (address.length <= chars * 2 + 3) return address;
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

/**
 * Format SOL amount from lamports
 */
export function formatSol(lamports: number): string {
  const sol = lamports / 1_000_000_000;
  return sol.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 9,
  });
}
