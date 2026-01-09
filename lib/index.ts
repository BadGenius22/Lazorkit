/**
 * Library utilities barrel export
 * @module lib
 * @description Centralized exports for constants, utilities, and payment helpers
 *
 * @example
 * ```ts
 * // Import everything from lib
 * import {
 *   RPC_URL,
 *   getExplorerUrl,
 *   truncateAddress,
 *   formatPaymentAmount,
 *   solToLamports,
 *   confirmTransaction,
 * } from "@/lib";
 * ```
 */

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

export {
  RPC_URL,
  PORTAL_URL,
  PAYMASTER_URL,
  EXPLORER_BASE_URL,
  CLUSTER,
  getExplorerUrl,
  getAccountUrl,
  truncateAddress,
  formatSol,
} from "./constants";

// ═══════════════════════════════════════════════════════════════════════════════
// PAYMENT UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export {
  formatPaymentAmount,
  solToLamports,
  generatePaymentReference,
} from "./solana-pay";

// ═══════════════════════════════════════════════════════════════════════════════
// TRANSACTION UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

export { confirmTransaction } from "./transaction";
export type { ConfirmTransactionOptions, ConfirmTransactionResult } from "./transaction";

// ═══════════════════════════════════════════════════════════════════════════════
// ENVIRONMENT VALIDATION
// ═══════════════════════════════════════════════════════════════════════════════

export { env } from "./env";
export type { Env } from "./env";
