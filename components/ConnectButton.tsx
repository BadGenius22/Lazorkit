"use client";

import { useWallet } from "@lazorkit/wallet";
import { truncateAddress } from "@/lib/constants";

export function ConnectButton() {
  const { connect, disconnect, isConnected, isConnecting, smartWalletPubkey } =
    useWallet();

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  // Connecting state
  if (isConnecting) {
    return (
      <button
        disabled
        aria-busy="true"
        aria-label="Connecting wallet"
        className="flex items-center gap-2 rounded-lg bg-gray-400 px-4 py-2 text-sm font-medium text-white cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-offset-2"
      >
        <svg
          className="h-4 w-4 animate-spin"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        <span>Connecting...</span>
      </button>
    );
  }

  // Connected state
  if (isConnected && smartWalletPubkey) {
    const address = smartWalletPubkey.toString();
    return (
      <button
        onClick={handleClick}
        aria-label={`Disconnect wallet ${truncateAddress(address)}`}
        className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
      >
        <span className="h-2 w-2 rounded-full bg-green-300" aria-hidden="true" />
        {truncateAddress(address)}
      </button>
    );
  }

  // Disconnected state
  return (
    <button
      onClick={handleClick}
      aria-label="Connect wallet using passkey"
      className="rounded-lg bg-purple-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
    >
      Connect Wallet
    </button>
  );
}
