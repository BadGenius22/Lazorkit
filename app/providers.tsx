"use client";

import { Buffer } from "buffer";
import { LazorkitProvider } from "@lazorkit/wallet";
import { RPC_URL, PORTAL_URL, PAYMASTER_URL } from "@/lib/constants";

// Initialize Buffer polyfill for browser environment
// Required by @solana/web3.js
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LazorkitProvider
      rpcUrl={RPC_URL}
      portalUrl={PORTAL_URL}
      paymasterConfig={{ paymasterUrl: PAYMASTER_URL }}
    >
      {children}
    </LazorkitProvider>
  );
}
