# Tutorial 1: Passkey Login

<div align="center">

![Difficulty](https://img.shields.io/badge/Difficulty-Beginner-green?style=flat-square)
![Time](https://img.shields.io/badge/Time-15%20min-blue?style=flat-square)
![Prerequisites](https://img.shields.io/badge/Prerequisites-None-gray?style=flat-square)

**Create a Solana wallet using your device's biometrics - no seed phrase required.**

[Live Demo](https://lazorkit-lovat.vercel.app/passkey-login) | [Source Code](../app/passkey-login)

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [How Passkeys Work](#how-passkeys-work)
- [Implementation](#implementation)
  - [Step 1: Set Up Provider](#step-1-set-up-the-provider)
  - [Step 2: Wrap Your App](#step-2-wrap-your-app)
  - [Step 3: Create ConnectButton](#step-3-create-the-connectbutton)
  - [Step 4: Display Wallet Info](#step-4-display-wallet-information)
  - [Step 5: Create the Page](#step-5-create-the-passkey-login-page)
- [Understanding the Flow](#understanding-the-flow)
- [Expected Results](#expected-results)
- [Common Issues](#common-issues)
- [Next Steps](#next-steps)

---

## Introduction

Traditional crypto wallets require users to manage complex seed phrases - 12 or 24 random words that must be kept secure forever. This creates friction for new users and is a significant barrier to mainstream adoption.

LazorKit solves this with **passkey-based wallets**. Using the WebAuthn standard, you can create a Solana wallet secured by your device's biometrics (Face ID, Touch ID, Windows Hello) or a hardware security key.

### What You'll Learn

| Topic | Description |
|-------|-------------|
| 🔐 Passkeys | How passkeys work with blockchain wallets |
| ⚙️ Provider Setup | Setting up the LazorkitProvider |
| 🪝 useWallet Hook | Using the useWallet hook |
| 🔘 ConnectButton | Building a ConnectButton component |
| 📋 Wallet Info | Displaying wallet information |

### Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20+ | [Download](https://nodejs.org/) |
| pnpm | 8+ | `npm install -g pnpm` |
| Browser | Chrome 108+, Safari 16+, Firefox 122+ | WebAuthn support required |
| Device | Any | Must have biometrics or security key |

---

## How Passkeys Work

### The WebAuthn Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           PASSKEY CREATION FLOW                             │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌──────────┐      ┌──────────┐      ┌──────────┐      ┌──────────┐
  │  1. User │      │2. Browser│      │3. Secure │      │4. LazorKit│
  │  clicks  │ ───► │  shows   │ ───► │ Enclave  │ ───► │  Portal  │
  │ "Connect"│      │ biometric│      │  stores  │      │ derives  │
  │          │      │  prompt  │      │  passkey │      │  wallet  │
  └──────────┘      └──────────┘      └──────────┘      └──────────┘
                                            │                 │
                                            │    Public Key   │
                                            └────────────────►│
                                                              ▼
                                                    ┌──────────────┐
                                                    │ Smart Wallet │
                                                    │     PDA      │
                                                    │  (Your new   │
                                                    │   wallet!)   │
                                                    └──────────────┘
```

### Security Benefits

<table>
<tr>
<th width="25%">Feature</th>
<th width="37%">Seed Phrase</th>
<th width="38%">Passkey</th>
</tr>
<tr>
<td><b>Phishing resistant</b></td>
<td>❌ No - can be typed anywhere</td>
<td>✅ Yes - bound to domain</td>
</tr>
<tr>
<td><b>Hardware backed</b></td>
<td>❌ No - stored in software</td>
<td>✅ Yes - secure enclave</td>
</tr>
<tr>
<td><b>User friendly</b></td>
<td>❌ No - 24 words to remember</td>
<td>✅ Yes - just use biometrics</td>
</tr>
<tr>
<td><b>Cross-device sync</b></td>
<td>⚠️ Manual backup required</td>
<td>✅ Auto-sync (iCloud, etc.)</td>
</tr>
</table>

---

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

> **📝 Key Points:**
> - `"use client"` is required because WebAuthn only works in the browser
> - Buffer polyfill is needed for `@solana/web3.js` compatibility
> - Provider must wrap your entire app in `layout.tsx`

---

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

---

### Step 3: Create the ConnectButton

The ConnectButton handles three states: **disconnected**, **connecting**, and **connected**.

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

#### Button States

| State | Appearance | Action |
|-------|------------|--------|
| 🔴 Disconnected | Purple "Connect Wallet" | Triggers passkey flow |
| 🟡 Connecting | Gray "Connecting..." (disabled) | Shows loading |
| 🟢 Connected | Green with truncated address | Disconnects on click |

---

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

---

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

---

## Understanding the Flow

### First-Time User

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         FIRST-TIME USER FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

   User clicks              Browser shows           User authenticates
  "Connect Wallet"    ───►  passkey prompt    ───►  (Face ID/Touch ID)
        │                                                  │
        │                                                  ▼
        │                                          Passkey created
        │                                          in secure enclave
        │                                                  │
        ▼                                                  ▼
  ┌───────────┐                                    Public key sent
  │  Session  │◄────────────────────────────────   to LazorKit Portal
  │  stored   │                                           │
  │   in      │                                           ▼
  │ localStorage                                  Smart wallet PDA
  └───────────┘                                   derived from key
        │                                                  │
        ▼                                                  ▼
  ┌─────────────────────────────────────────────────────────────┐
  │              ✅ USER CONNECTED WITH WALLET ADDRESS           │
  └─────────────────────────────────────────────────────────────┘
```

### Returning User

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          RETURNING USER FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

      Page loads         Check localStorage        Session found?
          │                     │                       │
          ▼                     ▼                       ▼
    ┌──────────┐         ┌──────────┐         ┌───────────────┐
    │   App    │   ───►  │ Provider │   ───►  │  Yes → Auto   │
    │  mounts  │         │  checks  │         │    connect    │
    └──────────┘         └──────────┘         └───────────────┘
                                                      │
                                                      ▼
                                              Browser shows
                                              passkey prompt
                                                      │
                                                      ▼
                                              User authenticates
                                                      │
                                                      ▼
                                            ┌─────────────────┐
                                            │    ✅ Session    │
                                            │    restored     │
                                            └─────────────────┘
```

---

## Expected Results

After completing this tutorial:

| # | Result | Description |
|---|--------|-------------|
| 1 | ✅ Connect button appears | Shows "Connect Wallet" when disconnected |
| 2 | ✅ Biometric prompt | Appears when clicking connect |
| 3 | ✅ Wallet address displayed | Shows truncated address when connected |
| 4 | ✅ Session persistence | Wallet stays connected after page refresh |
| 5 | ✅ Disconnect works | Button changes to address, clicking disconnects |

---

## Common Issues

<details>
<summary><b>🔴 Biometric prompt not appearing</b></summary>

**Causes:**
- Browser doesn't support WebAuthn
- Device lacks biometrics capability
- Running on HTTP (WebAuthn requires HTTPS or localhost)

**Solutions:**
- Use a supported browser (Chrome 108+, Safari 16+, Firefox 122+)
- On desktop without biometrics, use a security key or phone as authenticator
- Ensure you're on `localhost` or HTTPS

</details>

<details>
<summary><b>🔴 "Cannot read property of undefined" errors</b></summary>

**Cause:** Provider not properly set up or component not wrapped.

**Solution:** Ensure `LazorkitProvider` wraps all components using `useWallet()`.

```tsx
// ❌ Wrong - ConnectButton outside provider
<LazorkitProvider>
  <App />
</LazorkitProvider>
<ConnectButton /> // This will fail!

// ✅ Correct - ConnectButton inside provider
<LazorkitProvider>
  <App />
  <ConnectButton /> // This works!
</LazorkitProvider>
```

</details>

<details>
<summary><b>🟡 Session not persisting</b></summary>

**Causes:**
- localStorage blocked by browser settings
- Private/incognito mode
- Domain change

**Solutions:**
- Check browser privacy settings
- Use regular browsing mode
- Ensure consistent domain

</details>

<details>
<summary><b>🟡 Connect fails silently</b></summary>

**Cause:** User cancelled the biometric prompt.

**Solution:** This is expected behavior - no error is shown when user cancels. You can optionally add a retry message.

</details>

---

## Next Steps

<table>
<tr>
<td width="70%">

Once you have passkey login working, proceed to **Tutorial 2: Gasless Transfer** to learn how to send SOL without paying gas fees.

**What you'll learn:**
- Building transfer instructions
- Using Paymaster-sponsored transactions
- Fee token selection (USDC vs SOL)

</td>
<td width="30%" align="center">

[**Tutorial 2: Gasless Transfer →**](./02-gasless-transfer.md)

</td>
</tr>
</table>

---

## Technical Reference

### useWallet Hook API

```typescript
interface UseWalletReturn {
  // State
  isConnected: boolean;           // Wallet connection status
  isConnecting: boolean;          // Connection in progress
  smartWalletPubkey: PublicKey | null;  // Derived wallet address

  // Actions
  connect: () => Promise<void>;   // Trigger passkey flow
  disconnect: () => Promise<void>; // Clear session
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

---

## Resources

| Resource | Link |
|----------|------|
| WebAuthn Specification | [w3.org/TR/webauthn](https://www.w3.org/TR/webauthn/) |
| FIDO Alliance | [fidoalliance.org](https://fidoalliance.org/) |
| Can I Use WebAuthn | [caniuse.com/webauthn](https://caniuse.com/webauthn) |
| LazorKit Documentation | [docs.lazorkit.com](https://docs.lazorkit.com/) |

---

<div align="center">

**[← Back to Tutorials](../README.md#-tutorials)** | **[Next: Gasless Transfer →](./02-gasless-transfer.md)**

</div>
