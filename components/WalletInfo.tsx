"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { truncateAddress, getAccountUrl } from "@/lib/constants";
import { useBalance } from "@/hooks/useBalance";

export function WalletInfo() {
  const { smartWalletPubkey, isConnected } = useWallet();
  const [copied, setCopied] = useState(false);

  const address = smartWalletPubkey?.toString() ?? null;
  const { balance, isLoading: isBalanceLoading, refresh } = useBalance(address);

  if (!isConnected || !smartWalletPubkey) {
    return null;
  }

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address!);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Balance Display */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-medium text-gray-500">Balance</h3>
          <div className="mt-1 flex items-baseline gap-2">
            {isBalanceLoading ? (
              <div className="h-8 w-24 animate-pulse rounded bg-gray-200" />
            ) : (
              <span className="text-2xl font-bold text-gray-900">
                {balance !== null ? balance.toFixed(4) : "—"}
              </span>
            )}
            <span className="text-sm text-gray-500">SOL</span>
          </div>
        </div>
        <button
          onClick={refresh}
          disabled={isBalanceLoading}
          className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
          title="Refresh balance"
          aria-label="Refresh balance"
        >
          <svg
            className={`h-5 w-5 ${isBalanceLoading ? "animate-spin" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {/* Address Section */}
      <div className="border-t border-gray-200 pt-4">
        <h3 className="mb-2 text-sm font-medium text-gray-500">
          Smart Wallet Address
        </h3>

        <div className="flex items-center gap-2">
          <code className="flex-1 rounded bg-gray-100 px-3 py-2 text-sm font-mono text-gray-900">
            {truncateAddress(address!, 8)}
          </code>

          {/* Copy button */}
          <button
            onClick={handleCopy}
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            title="Copy address"
            aria-label={copied ? "Address copied" : "Copy address"}
          >
            {copied ? (
              <svg
                className="h-5 w-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            )}
          </button>

          {/* Explorer link */}
          <a
            href={getAccountUrl(address!)}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-lg p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
            title="View on Solana Explorer"
            aria-label="View on Solana Explorer"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
              />
            </svg>
          </a>
        </div>

        <p className="mt-2 text-xs text-gray-500">Full address: {address}</p>
      </div>
    </div>
  );
}
