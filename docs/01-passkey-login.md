# Tutorial 1: Passkey Login

Create a Solana wallet using your device's biometrics - no seed phrase required.

## Introduction

Traditional crypto wallets require users to manage complex seed phrases - 12 or 24 random words that must be kept secure forever. This creates friction for new users and is a significant barrier to mainstream adoption.

LazorKit solves this with **passkey-based wallets**. Using the WebAuthn standard, you can create a Solana wallet secured by your device's biometrics (Face ID, Touch ID, Windows Hello) or a hardware security key.

### What You'll Learn

- How passkeys work with blockchain wallets
- Setting up the LazorkitProvider
- Using the useWallet hook
- Building a ConnectButton component
- Displaying wallet information

### Prerequisites

- Node.js 20+ and pnpm 8+
- A WebAuthn-compatible browser (Chrome, Safari, Firefox, Edge)
- A device with biometrics or a security key

## How Passkeys Work

### The WebAuthn Flow

1. **User initiates connection** - Clicks "Connect Wallet"
2. **Browser triggers passkey creation** - Native biometric prompt appears
3. **Passkey stored in secure enclave** - Private key never leaves device
4. **Public key sent to LazorKit** - Used to derive smart wallet address
5. **Smart wallet created** - A Solana PDA derived from your passkey

### Security Benefits

| Feature | Seed Phrase | Passkey |
|---------|-------------|---------|
| Phishing resistant | No | Yes (bound to domain) |
| Hardware backed | No | Yes (secure enclave) |
| User friendly | No (24 words) | Yes (biometrics) |
| Cross-device sync | Manual backup | Platform sync (iCloud, etc.) |

## Implementation

### Step 1: Set Up the Provider

The `LazorkitProvider` wraps your app and provides wallet context to all components.

```tsx
// app/providers.tsx
"use client";

import { Buffer } from "buffer";
import { LazorkitProvider } from "@lazorkit/wallet";

// Buffer polyfill for browser
if (typeof window !== "undefined") {
  window.Buffer = window.Buffer || Buffer;
}

interface ProvidersProps {
  children: React.ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <LazorkitProvider
      rpcUrl={process.env.NEXT_PUBLIC_RPC_URL!}
      portalUrl={process.env.NEXT_PUBLIC_PORTAL_URL!}
      paymasterConfig={{
        paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL!,
      }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

**Key points:**
- `"use client"` is required because WebAuthn only works in the browser
- Buffer polyfill is needed for `@solana/web3.js` compatibility
- Provider must wrap your entire app in `layout.tsx`

### Step 2: Wrap Your App

```tsx
// app/layout.tsx
import { Providers } from "./providers";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

### Step 3: Create the ConnectButton

The ConnectButton handles three states: disconnected, connecting, and connected.

```tsx
// components/ConnectButton.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";

export function ConnectButton() {
  const {
    connect,
    disconnect,
    isConnected,
    isConnecting,
    smartWalletPubkey
  } = useWallet();

  const handleClick = async () => {
    if (isConnected) {
      await disconnect();
    } else {
      await connect();
    }
  };

  // Connecting state - show loading
  if (isConnecting) {
    return (
      <button disabled className="bg-gray-400 px-4 py-2 rounded-lg">
        Connecting...
      </button>
    );
  }

  // Connected state - show address
  if (isConnected && smartWalletPubkey) {
    const address = smartWalletPubkey.toString();
    const truncated = `${address.slice(0, 4)}...${address.slice(-4)}`;

    return (
      <button
        onClick={handleClick}
        className="bg-green-600 text-white px-4 py-2 rounded-lg"
      >
        {truncated}
      </button>
    );
  }

  // Disconnected state - show connect
  return (
    <button
      onClick={handleClick}
      className="bg-purple-600 text-white px-4 py-2 rounded-lg"
    >
      Connect Wallet
    </button>
  );
}
```

**How it works:**

1. `connect()` triggers the WebAuthn passkey flow
2. User authenticates with biometrics
3. `isConnecting` becomes true during the process
4. On success, `isConnected` is true and `smartWalletPubkey` is available
5. Session persists in localStorage for auto-reconnect

### Step 4: Display Wallet Information

```tsx
// components/WalletInfo.tsx
"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";

export function WalletInfo() {
  const { smartWalletPubkey, isConnected } = useWallet();
  const [copied, setCopied] = useState(false);

  if (!isConnected || !smartWalletPubkey) {
    return null;
  }

  const address = smartWalletPubkey.toString();

  const handleCopy = async () => {
    await navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium">Smart Wallet Address</h3>

      <div className="flex items-center gap-2 mt-2">
        <code className="bg-gray-100 px-2 py-1 rounded text-sm">
          {address.slice(0, 8)}...{address.slice(-8)}
        </code>

        <button onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </button>

        <a
          href={`https://explorer.solana.com/address/${address}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Explorer
        </a>
      </div>

      <p className="text-xs mt-2 text-gray-500">
        Full: {address}
      </p>
    </div>
  );
}
```

### Step 5: Create the Passkey Login Page

```tsx
// app/passkey-login/page.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { ConnectButton } from "@/components/ConnectButton";
import { WalletInfo } from "@/components/WalletInfo";

export default function PasskeyLoginPage() {
  const { isConnected } = useWallet();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Passkey Login</h1>
      <p className="mt-2 text-gray-600">
        Create a Solana wallet using biometrics.
      </p>

      <div className="mt-8">
        {isConnected ? (
          <div className="space-y-4">
            <div className="text-green-600 font-medium">
              Wallet Connected!
            </div>
            <WalletInfo />
          </div>
        ) : (
          <div className="space-y-4">
            <p>Click below to create your passkey wallet.</p>
            <ConnectButton />
          </div>
        )}
      </div>
    </div>
  );
}
```

## Understanding the Flow

### First-Time User

```
User clicks "Connect Wallet"
    ↓
Browser shows passkey creation prompt
    ↓
User authenticates (Face ID / Touch ID / PIN)
    ↓
Passkey created and stored in device secure enclave
    ↓
Public key sent to LazorKit Portal
    ↓
Smart wallet PDA derived from public key
    ↓
Session token stored in localStorage
    ↓
User connected with wallet address
```

### Returning User

```
Page loads
    ↓
LazorkitProvider checks localStorage for session
    ↓
Session found → Auto-connect attempt
    ↓
Browser shows passkey login prompt
    ↓
User authenticates
    ↓
Session restored, wallet connected
```

## Expected Results

After completing this tutorial:

1. **Connect button appears** - Shows "Connect Wallet" when disconnected
2. **Biometric prompt** - Appears when clicking connect
3. **Wallet address displayed** - Shows truncated address when connected
4. **Session persistence** - Wallet stays connected after page refresh
5. **Disconnect works** - Button changes to address, clicking disconnects

## Common Issues

### Biometric prompt not appearing

**Causes:**
- Browser doesn't support WebAuthn
- Device lacks biometrics capability
- Running on HTTP (WebAuthn requires HTTPS or localhost)

**Solutions:**
- Use a supported browser (Chrome 108+, Safari 16+, Firefox 122+)
- On desktop without biometrics, use a security key or phone as authenticator
- Ensure you're on `localhost` or HTTPS

### "Cannot read property of undefined" errors

**Cause:** Provider not properly set up or component not wrapped.

**Solution:** Ensure `LazorkitProvider` wraps all components using `useWallet()`.

### Session not persisting

**Causes:**
- localStorage blocked by browser settings
- Private/incognito mode
- Domain change

**Solutions:**
- Check browser privacy settings
- Use regular browsing mode
- Ensure consistent domain

### Connect fails silently

**Cause:** User cancelled the biometric prompt.

**Solution:** This is expected behavior - no error is shown when user cancels.

## Next Steps

Once you have passkey login working, proceed to [Tutorial 2: Gasless Transfer](./02-gasless-transfer.md) to learn how to send SOL without paying gas fees.

## Technical Reference

### useWallet Hook API

```typescript
interface UseWalletReturn {
  // State
  isConnected: boolean;
  isConnecting: boolean;
  smartWalletPubkey: PublicKey | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (params: TransactionParams) => Promise<string>;
}
```

### LazorkitProvider Props

```typescript
interface LazorkitProviderProps {
  rpcUrl: string;           // Solana RPC endpoint
  portalUrl: string;        // LazorKit Portal service
  paymasterConfig?: {
    paymasterUrl: string;   // Paymaster service for gasless
  };
  children: React.ReactNode;
}
```

## Resources

- [WebAuthn Specification](https://www.w3.org/TR/webauthn/)
- [FIDO Alliance](https://fidoalliance.org/)
- [Can I Use WebAuthn](https://caniuse.com/webauthn)
- [LazorKit Documentation](https://docs.lazorkit.com/)
