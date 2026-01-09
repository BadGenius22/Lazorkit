/**
 * Custom React hooks barrel export
 * @module hooks
 * @description Reusable hooks for wallet balance and payment processing
 *
 * @example
 * ```ts
 * import { useBalance, usePayment } from "@/hooks";
 * import type { PaymentResult, UseBalanceResult } from "@/hooks";
 * ```
 */

export { useBalance } from "./useBalance";
export type { UseBalanceResult } from "./useBalance";

export { usePayment } from "./usePayment";
export type {
  PaymentStatus,
  PaymentCurrency,
  PaymentResult,
  PaymentError,
  UsePaymentOptions,
  UsePaymentResult,
} from "./usePayment";
