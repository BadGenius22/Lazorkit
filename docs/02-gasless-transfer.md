# Tutorial 2: Gasless Transfer

<div align="center">

![Difficulty](https://img.shields.io/badge/Difficulty-Intermediate-yellow?style=flat-square)
![Time](https://img.shields.io/badge/Time-20%20min-blue?style=flat-square)
![Prerequisites](https://img.shields.io/badge/Prerequisites-Tutorial%201-orange?style=flat-square)

**Send SOL without paying gas fees - Paymaster covers transaction costs.**

[Live Demo](https://lazorkit-lovat.vercel.app/gasless-transfer) | [Source Code](../app/gasless-transfer)

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [How Gasless Works](#how-gasless-works)
- [Implementation](#implementation)
  - [Step 1: Create Transfer Form](#step-1-create-the-transfer-form-component)
  - [Step 2: Add Validation](#step-2-add-input-validation)
  - [Step 3: Build Instruction](#step-3-build-the-transfer-instruction)
  - [Step 4: Submit Transaction](#step-4-submit-with-gasless-option)
  - [Step 5: Handle Errors](#step-5-handle-errors-gracefully)
  - [Step 6: Build UI](#step-6-build-the-form-ui)
  - [Step 7: Create Page](#step-7-create-the-gasless-transfer-page)
- [Testing](#testing-the-flow)
- [Common Issues](#common-issues)
- [Next Steps](#next-steps)

---

## Introduction

One of the biggest friction points in crypto is gas fees. Users need to:

| Pain Point | Description |
|------------|-------------|
| 1. Acquire SOL first | Can't do anything without native token |
| 2. Keep balance for fees | Must always maintain SOL reserve |
| 3. Understand gas pricing | Confusing for new users |

LazorKit's **Paymaster service** eliminates this friction by paying gas fees on behalf of users. The cost is settled in USDC, enabling truly gasless onboarding.

### What You'll Learn

| Topic | Description |
|-------|-------------|
| 🔄 Paymaster | How sponsored transactions work |
| 🏗️ Instructions | Building transfer instructions with `@solana/web3.js` |
| 📤 Transactions | Using `signAndSendTransaction` with fee options |
| ✅ Validation | Validating user inputs |
| ⚠️ Error Handling | Handling transaction results and errors |

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Tutorial 1: Passkey Login](./01-passkey-login.md) | Must be completed first |
| Test SOL | Get from [Solana Faucet](https://faucet.solana.com) |

---

## How Gasless Works

### Traditional vs Gasless

<table>
<tr>
<td width="50%">

#### Traditional Flow

```
┌─────────────────────┐
│  User creates tx    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  User pays SOL      │
│  for gas fees       │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Transaction sent   │
│  to network         │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  SOL deducted from  │
│  user balance       │
└─────────────────────┘
```

</td>
<td width="50%">

#### Gasless Flow

```
┌─────────────────────┐
│  User creates tx    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Transaction sent   │
│  to Paymaster  ⛽   │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  Paymaster sponsors │
│  gas (pays SOL)     │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│  ✅ No SOL needed!  │
│  Free on devnet     │
└─────────────────────┘
```

</td>
</tr>
</table>

### Benefits Comparison

| Aspect | Traditional | Gasless |
|--------|:-----------:|:-------:|
| **Onboarding** | ❌ Need SOL first | ✅ Start immediately |
| **UX** | ❌ Multiple tokens | ✅ Single token experience |
| **Fees** | ❌ Variable SOL | ✅ Fixed USDC (or free) |
| **Complexity** | ❌ Manage gas | ✅ Abstracted away |

---

## Implementation

### Step 1: Create the Transfer Form Component

```tsx
// components/TransferForm.tsx
"use client";

import { useState } from "react";
import { useWallet } from "@lazorkit/wallet";
import { SystemProgram, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";

type FeeToken = "SOL" | "USDC";

export function TransferForm() {
  const { signAndSendTransaction, smartWalletPubkey } = useWallet();

  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [feeToken, setFeeToken] = useState<FeeToken>("USDC");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [signature, setSignature] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ... validation and submit logic below
}
```

#### Component State Overview

| State | Type | Purpose |
|-------|------|---------|
| `recipient` | `string` | Destination wallet address |
| `amount` | `string` | SOL amount to send |
| `feeToken` | `"SOL" \| "USDC"` | Fee payment method |
| `status` | `enum` | Transaction state |
| `signature` | `string \| null` | Transaction signature |
| `error` | `string \| null` | Error message |

---

### Step 2: Add Input Validation

Proper validation prevents failed transactions and improves UX.

```tsx
// Inside TransferForm component

const validateRecipient = (value: string): string | undefined => {
  if (!value.trim()) {
    return "Recipient address is required";
  }
  try {
    new PublicKey(value);  // Validates base58 format
    return undefined;
  } catch {
    return "Invalid Solana address";
  }
};

const validateAmount = (value: string): string | undefined => {
  if (!value.trim()) {
    return "Amount is required";
  }
  const num = parseFloat(value);
  if (isNaN(num) || num <= 0) {
    return "Amount must be greater than 0";
  }
  if (num > 1000) {
    return "Amount too large (max 1000 SOL for safety)";
  }
  return undefined;
};
```

> **📝 Why validate?**
> - `PublicKey` constructor throws if invalid address format
> - Prevents submitting transactions that will fail
> - Better error messages for users

---

### Step 3: Build the Transfer Instruction

```tsx
const buildTransferInstruction = () => {
  if (!smartWalletPubkey) {
    throw new Error("Wallet not connected");
  }

  const recipientPubkey = new PublicKey(recipient);
  const lamports = Math.floor(parseFloat(amount) * LAMPORTS_PER_SOL);

  return SystemProgram.transfer({
    fromPubkey: smartWalletPubkey,  // Your smart wallet
    toPubkey: recipientPubkey,       // Recipient address
    lamports,                        // Amount in lamports (1 SOL = 1e9 lamports)
  });
};
```

#### Key Concepts

| Concept | Value | Description |
|---------|-------|-------------|
| `LAMPORTS_PER_SOL` | 1,000,000,000 | 1 billion lamports = 1 SOL |
| `SystemProgram.transfer` | - | Creates native SOL transfer instruction |
| `smartWalletPubkey` | - | Your passkey-derived wallet address |

---

### Step 4: Submit with Gasless Option

```tsx
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  // Validate inputs
  const recipientError = validateRecipient(recipient);
  const amountError = validateAmount(amount);

  if (recipientError || amountError) {
    setError(recipientError || amountError || "Validation failed");
    return;
  }

  setStatus("loading");
  setError(null);

  try {
    const instruction = buildTransferInstruction();

    // Submit with fee token option
    const sig = await signAndSendTransaction({
      instructions: [instruction],
      transactionOptions: {
        feeToken: feeToken === "USDC" ? "USDC" : undefined,
      },
    });

    setSignature(sig);
    setStatus("success");

    // Reset form
    setRecipient("");
    setAmount("");
  } catch (err) {
    handleError(err as Error);
  }
};
```

#### The Magic: `transactionOptions`

```
┌─────────────────────────────────────────────────────────────────┐
│                    FEE TOKEN OPTIONS                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   feeToken: "USDC"     →  Paymaster sponsors gas                │
│                           Settled in USDC (free on devnet)      │
│                                                                 │
│   feeToken: undefined  →  Standard transaction                  │
│                           User pays SOL for gas                 │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

### Step 5: Handle Errors Gracefully

```tsx
const handleError = (err: Error) => {
  // User cancelled biometric prompt
  if (err.name === "UserCancelled" || err.message?.includes("cancel")) {
    setStatus("idle");
    return;
  }

  // User-friendly error messages
  let message = err.message || "Transaction failed";

  if (err.message?.includes("insufficient")) {
    message = "Insufficient balance for this transfer";
  } else if (err.message?.includes("paymaster")) {
    message = "Paymaster error - try using SOL for fees instead";
  }

  setError(message);
  setStatus("error");
};
```

#### Error Types

| Error | Severity | Handling |
|-------|:--------:|----------|
| `UserCancelled` | 🟡 | Silent - return to idle |
| `insufficient` | 🔴 | Show balance error |
| `paymaster` | 🟠 | Suggest SOL fees fallback |

---

### Step 6: Build the Form UI

```tsx
return (
  <form onSubmit={handleSubmit} className="space-y-4">
    {/* Recipient Input */}
    <div>
      <label htmlFor="recipient" className="block font-medium">
        Recipient Address
      </label>
      <input
        type="text"
        id="recipient"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        placeholder="Enter Solana address"
        className="mt-1 w-full border rounded-lg px-4 py-2"
        disabled={status === "loading"}
      />
    </div>

    {/* Amount Input */}
    <div>
      <label htmlFor="amount" className="block font-medium">
        Amount (SOL)
      </label>
      <input
        type="number"
        id="amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="0.00"
        step="0.001"
        min="0"
        className="mt-1 w-full border rounded-lg px-4 py-2"
        disabled={status === "loading"}
      />
    </div>

    {/* Fee Token Selector */}
    <div>
      <label className="block font-medium">Pay Fees With</label>
      <div className="mt-2 flex gap-2">
        <button
          type="button"
          onClick={() => setFeeToken("USDC")}
          className={`flex-1 py-2 rounded-lg border ${
            feeToken === "USDC"
              ? "border-green-500 bg-green-50"
              : "border-gray-300"
          }`}
        >
          USDC (Gasless)
        </button>
        <button
          type="button"
          onClick={() => setFeeToken("SOL")}
          className={`flex-1 py-2 rounded-lg border ${
            feeToken === "SOL"
              ? "border-purple-500 bg-purple-50"
              : "border-gray-300"
          }`}
        >
          SOL
        </button>
      </div>
      <p className="mt-1 text-sm text-gray-500">
        {feeToken === "USDC"
          ? "Transaction fees paid by Paymaster - no SOL needed!"
          : "Standard transaction with SOL for gas fees"}
      </p>
    </div>

    {/* Submit Button */}
    <button
      type="submit"
      disabled={status === "loading" || !recipient || !amount}
      className="w-full bg-purple-600 text-white py-3 rounded-lg disabled:bg-gray-400"
    >
      {status === "loading" ? "Sending..." : "Send SOL"}
    </button>

    {/* Result Display */}
    {status === "success" && signature && (
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="font-medium text-green-700">Transaction Successful!</p>
        <p className="text-sm mt-1">
          Signature: <code>{signature.slice(0, 20)}...</code>
        </p>
        <a
          href={`https://explorer.solana.com/tx/${signature}?cluster=devnet`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-green-700 underline text-sm"
        >
          View on Solana Explorer
        </a>
      </div>
    )}

    {status === "error" && error && (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="font-medium text-red-700">Transaction Failed</p>
        <p className="text-sm text-red-600 mt-1">{error}</p>
        <button
          type="button"
          onClick={() => setStatus("idle")}
          className="text-red-700 underline text-sm mt-2"
        >
          Try Again
        </button>
      </div>
    )}
  </form>
);
```

---

### Step 7: Create the Gasless Transfer Page

```tsx
// app/gasless-transfer/page.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { ConnectButton } from "@/components/ConnectButton";
import { WalletInfo } from "@/components/WalletInfo";
import { TransferForm } from "@/components/TransferForm";
import Link from "next/link";

export default function GaslessTransferPage() {
  const { isConnected } = useWallet();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold">Gasless Transfer</h1>
      <p className="mt-2 text-gray-600">
        Send SOL without paying gas fees.
      </p>

      {!isConnected ? (
        <div className="mt-8 p-8 border rounded-lg text-center">
          <h2 className="text-xl font-semibold">Wallet Not Connected</h2>
          <p className="mt-2 text-gray-600">
            Please connect your wallet to use gasless transfer.
          </p>
          <div className="mt-6">
            <ConnectButton />
          </div>
          <Link
            href="/passkey-login"
            className="text-sm text-purple-600 mt-4 inline-block"
          >
            Learn how to create a passkey wallet →
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          <div className="space-y-6">
            <WalletInfo />
            <TransferForm />
          </div>

          <div className="space-y-6">
            {/* Instructions panel */}
            <div className="p-6 border rounded-lg">
              <h2 className="font-semibold">How Gasless Works</h2>
              <ol className="mt-4 space-y-3">
                <li>1. Enter recipient and amount</li>
                <li>2. Select USDC for gasless fees</li>
                <li>3. Paymaster sponsors the gas</li>
                <li>4. Sign with biometrics</li>
                <li>5. Transaction confirmed!</li>
              </ol>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Testing the Flow

### Get Test SOL

| Step | Action |
|:----:|--------|
| 1 | Visit [Solana Faucet](https://faucet.solana.com) |
| 2 | Enter your smart wallet address |
| 3 | Request devnet SOL |

### Test Transfer

```
┌─────────────────────────────────────────────────────────────────┐
│                      TEST TRANSFER FLOW                         │
└─────────────────────────────────────────────────────────────────┘

  1. Connect wallet    2. Enter details    3. Select USDC
       │                     │                   │
       ▼                     ▼                   ▼
  ┌─────────┐          ┌─────────┐         ┌─────────┐
  │   🔐    │    ───►  │  📝 To: │   ───►  │  ⛽     │
  │ Wallet  │          │  0.01   │         │ Gasless │
  │Connected│          │  SOL    │         │  Mode   │
  └─────────┘          └─────────┘         └─────────┘
                                                │
       ┌────────────────────────────────────────┘
       ▼
  4. Click Send     5. Authenticate     6. Verify!
       │                  │                  │
       ▼                  ▼                  ▼
  ┌─────────┐        ┌─────────┐       ┌─────────┐
  │   📤    │  ───►  │   👆    │  ───► │   ✅    │
  │  Send   │        │ Face ID │       │ Solana  │
  │   SOL   │        │Touch ID │       │Explorer │
  └─────────┘        └─────────┘       └─────────┘
```

---

## Expected Results

After completing a successful transfer:

| # | Result | Description |
|---|--------|-------------|
| 1 | ✅ Success message | Shows transaction signature |
| 2 | ✅ Explorer link | Opens transaction on Solana Explorer |
| 3 | ✅ Balance update | Source wallet balance decreases |
| 4 | ✅ Form reset | Inputs cleared for next transfer |

---

## Common Issues

<details>
<summary><b>🔴 "Insufficient balance"</b></summary>

**Cause:** Not enough SOL to cover the transfer amount.

**Solutions:**
- Get test SOL from the [faucet](https://faucet.solana.com)
- Reduce the transfer amount
- Check wallet balance in WalletInfo component

</details>

<details>
<summary><b>🟠 Paymaster errors</b></summary>

**Causes:**
- Rate limiting on devnet Paymaster
- Service temporarily unavailable
- Invalid transaction format

**Solutions:**
- Switch to SOL for fees (non-gasless)
- Wait and retry later
- Check that recipient address is valid

</details>

<details>
<summary><b>🔴 "Invalid Solana address"</b></summary>

**Cause:** Recipient address is not valid base58 format.

**Solutions:**
- Verify the address is copied correctly
- Ensure no extra spaces or characters
- Use a known valid devnet address for testing

</details>

<details>
<summary><b>🟡 Transaction stuck in loading</b></summary>

**Causes:**
- Network congestion
- RPC endpoint issues
- User didn't complete biometric

**Solutions:**
- Wait for timeout (usually 30 seconds)
- Check browser console for errors
- Ensure biometric prompt was completed

</details>

---

## Technical Deep Dive

### Transaction Structure

```typescript
// A gasless transaction includes:
{
  instructions: [
    SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: recipientPubkey,
      lamports: amount * LAMPORTS_PER_SOL,
    })
  ],
  transactionOptions: {
    feeToken: "USDC",  // Paymaster pays SOL, settles in USDC
  }
}
```

### signAndSendTransaction Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                  TRANSACTION LIFECYCLE                          │
└─────────────────────────────────────────────────────────────────┘

  1. Build tx           2. Add blockhash      3. If gasless
       │                      │                    │
       ▼                      ▼                    ▼
  ┌──────────┐          ┌──────────┐         ┌──────────┐
  │   📝     │    ───►  │   #️⃣     │   ───►  │   ⛽     │
  │  Build   │          │  Recent  │         │Paymaster │
  │   Tx     │          │Blockhash │         │ Sponsor  │
  └──────────┘          └──────────┘         └──────────┘
                                                  │
       ┌──────────────────────────────────────────┘
       ▼
  4. User signs         5. Send to network    6. Return sig
       │                      │                    │
       ▼                      ▼                    ▼
  ┌──────────┐          ┌──────────┐         ┌──────────┐
  │   🔐     │    ───►  │   🌐     │   ───►  │   ✅     │
  │ WebAuthn │          │  Solana  │         │Signature │
  │  Sign    │          │  Submit  │         │ Returned │
  └──────────┘          └──────────┘         └──────────┘
```

### Error Codes Reference

| Error | Meaning | Action |
|-------|---------|--------|
| `UserCancelled` | User dismissed biometric | No action needed |
| `InsufficientBalance` | Not enough SOL | Add funds or reduce amount |
| `InvalidRecipient` | Bad address format | Check address |
| `PaymasterError` | Service issue | Try SOL fees |
| `NetworkError` | RPC/connection issue | Retry later |

---

## Next Steps

<table>
<tr>
<td width="70%">

**Congratulations!** You've learned how to:
- Build SOL transfer instructions
- Use Paymaster for gasless transactions
- Handle errors gracefully
- Create a complete transfer form

**Next:** Learn to integrate a payment widget for merchants.

</td>
<td width="30%" align="center">

[**Tutorial 3: Payment Widget →**](./03-payment-widget.md)

</td>
</tr>
</table>

### Ideas to Extend

| Feature | Description |
|---------|-------------|
| 🪙 Token transfers | Send SPL tokens, not just SOL |
| 📦 Batch transactions | Multiple instructions in one tx |
| 📜 Transaction history | Show past transfers |
| 📒 Address book | Save frequent recipients |

---

## Resources

| Resource | Link |
|----------|------|
| Solana Web3.js Docs | [solana-labs.github.io/solana-web3.js](https://solana-labs.github.io/solana-web3.js/) |
| SystemProgram Reference | [docs.solana.com](https://docs.solana.com/developing/runtime-facilities/programs#system-program) |
| LazorKit Paymaster Docs | [docs.lazorkit.com](https://docs.lazorkit.com/) |
| Solana Transaction Structure | [docs.solana.com](https://docs.solana.com/developing/programming-model/transactions) |

---

<div align="center">

**[← Tutorial 1: Passkey Login](./01-passkey-login.md)** | **[Tutorial 3: Payment Widget →](./03-payment-widget.md)**

</div>
