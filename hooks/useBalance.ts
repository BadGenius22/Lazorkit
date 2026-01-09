"use client";

import { useState, useEffect, useCallback } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { RPC_URL } from "@/lib/constants";

/**
 * Return value from useBalance hook
 * @description Provides SOL balance data and refresh controls
 */
export interface UseBalanceResult {
  /** Balance in SOL (human-readable), null if not loaded or error */
  balance: number | null;
  /** Balance in lamports (raw), null if not loaded or error */
  balanceLamports: number | null;
  /** Whether balance is currently being fetched */
  isLoading: boolean;
  /** Error message if fetch failed, null otherwise */
  error: string | null;
  /** Manually trigger a balance refresh */
  refresh: () => Promise<void>;
}

/**
 * React hook for fetching and tracking SOL balance
 *
 * @description
 * Fetches the SOL balance for a given Solana address from the configured RPC.
 * Automatically refreshes every 30 seconds while an address is provided.
 * Returns balance in both SOL and lamports for flexibility.
 *
 * @example
 * ```tsx
 * // With smart wallet from LazorKit
 * const { smartWalletPubkey } = useWallet();
 * const { balance, isLoading, refresh } = useBalance(
 *   smartWalletPubkey?.toBase58() ?? null
 * );
 *
 * // Display balance
 * {isLoading ? "Loading..." : `${balance?.toFixed(4)} SOL`}
 *
 * // Manual refresh after transaction
 * await sendTransaction();
 * await refresh();
 * ```
 *
 * @param address - Solana wallet address (base58) or null if not connected
 * @returns Balance state and refresh function
 *
 * @remarks
 * - Uses "confirmed" commitment level for faster updates
 * - Auto-refreshes every 30 seconds when address is provided
 * - Cleans up interval on unmount or address change
 */
export function useBalance(address: string | null): UseBalanceResult {
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fetch current balance from RPC
   * @internal
   */
  const fetchBalance = useCallback(async () => {
    if (!address) {
      setBalance(null);
      setBalanceLamports(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const connection = new Connection(RPC_URL, "confirmed");
      const pubkey = new PublicKey(address);
      const lamports = await connection.getBalance(pubkey);

      setBalanceLamports(lamports);
      setBalance(lamports / LAMPORTS_PER_SOL);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch balance";
      setError(errorMessage);
      setBalance(null);
      setBalanceLamports(null);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // Fetch balance on mount and when address changes
  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  // Auto-refresh every 30 seconds when connected
  useEffect(() => {
    if (!address) return;

    const interval = setInterval(fetchBalance, 30000);
    return () => clearInterval(interval);
  }, [address, fetchBalance]);

  return {
    balance,
    balanceLamports,
    isLoading,
    error,
    refresh: fetchBalance,
  };
}
