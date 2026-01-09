"use client";

import { useState, useEffect, useCallback } from "react";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { RPC_URL } from "@/lib/constants";

interface UseBalanceResult {
  balance: number | null; // Balance in SOL
  balanceLamports: number | null; // Balance in lamports
  isLoading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
}

export function useBalance(address: string | null): UseBalanceResult {
  const [balance, setBalance] = useState<number | null>(null);
  const [balanceLamports, setBalanceLamports] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
