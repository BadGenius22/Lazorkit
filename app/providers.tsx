"use client";

import { Buffer } from "buffer";

// Initialize Buffer polyfill for browser environment
// Required by @solana/web3.js
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return <>{children}</>;
}
