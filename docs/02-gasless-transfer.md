# Tutorial 2: Gasless Transfer

Send SOL without paying gas fees - Paymaster covers transaction costs with USDC.

## Introduction

One of the biggest friction points in crypto is gas fees. Users need to:
1. Acquire the native token (SOL) first
2. Keep enough balance for fees
3. Understand gas pricing

LazorKit's **Paymaster service** eliminates this friction by paying gas fees on behalf of users. The cost is settled in USDC, enabling truly gasless onboarding.

### What You'll Learn

- How Paymaster-sponsored transactions work
- Building transfer instructions with `@solana/web3.js`
- Using `signAndSendTransaction` with fee options
- Validating user inputs
- Handling transaction results and errors

### Prerequisites

- Completed [Tutorial 1: Passkey Login](./01-passkey-login.md)
- Connected wallet with test SOL (get from [Solana Faucet](https://faucet.solana.com))

## How Gasless Works

### Traditional Transaction Flow

```
User creates transaction
    ↓
User pays SOL for gas
    ↓
Transaction submitted to network
    ↓
SOL deducted from user balance
```

### Gasless Transaction Flow

```
User creates transaction
    ↓
Transaction sent to Paymaster
    ↓
Paymaster sponsors gas (pays SOL)
    ↓
Transaction submitted to network
    ↓
USDC fee settled (or free on devnet)
```

### Benefits

| Aspect | Traditional | Gasless |
|--------|-------------|---------|
| Onboarding | Need SOL first | Start immediately |
| UX | Multiple tokens | Single token experience |
| Fees | Variable SOL | Fixed USDC (or free) |
| Complexity | Manage gas | Abstracted away |

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

**Why validate?**
- `PublicKey` constructor throws if invalid address format
- Prevents submitting transactions that will fail
- Better error messages for users

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

**Key concepts:**
- `LAMPORTS_PER_SOL` = 1,000,000,000 (1 billion)
- `SystemProgram.transfer` creates a native SOL transfer instruction
- `smartWalletPubkey` is your passkey-derived wallet address

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

**The magic happens in `transactionOptions`:**
- `feeToken: "USDC"` → Paymaster sponsors gas, settled in USDC
- `feeToken: undefined` → Standard transaction, user pays SOL gas

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

**Common errors:**
- `UserCancelled` - User dismissed biometric prompt (silent fail)
- `insufficient` - Not enough SOL balance
- `paymaster` - Paymaster service issue (rate limits, etc.)

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

## Testing the Flow

### Get Test SOL

1. Visit [Solana Faucet](https://faucet.solana.com)
2. Enter your smart wallet address
3. Request devnet SOL

### Test Transfer

1. Connect your wallet
2. Enter any valid Solana address as recipient
3. Enter a small amount (e.g., 0.01 SOL)
4. Select "USDC (Gasless)"
5. Click "Send SOL"
6. Authenticate with biometrics
7. Verify transaction on Solana Explorer

## Expected Results

After completing a successful transfer:

1. **Success message** - Shows transaction signature
2. **Explorer link** - Opens transaction on Solana Explorer
3. **Balance update** - Source wallet balance decreases
4. **Form reset** - Inputs cleared for next transfer

## Common Issues

### "Insufficient balance"

**Cause:** Not enough SOL to cover the transfer amount.

**Solution:**
- Get test SOL from the faucet
- Reduce the transfer amount
- Check wallet balance in WalletInfo component

### Paymaster errors

**Causes:**
- Rate limiting on devnet Paymaster
- Service temporarily unavailable
- Invalid transaction format

**Solutions:**
- Switch to SOL for fees (non-gasless)
- Wait and retry later
- Check that recipient address is valid

### "Invalid Solana address"

**Cause:** Recipient address is not valid base58 format.

**Solution:**
- Verify the address is copied correctly
- Ensure no extra spaces or characters
- Use a known valid devnet address for testing

### Transaction stuck in loading

**Causes:**
- Network congestion
- RPC endpoint issues
- User didn't complete biometric

**Solutions:**
- Wait for timeout (usually 30 seconds)
- Check browser console for errors
- Ensure biometric prompt was completed

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
1. Build transaction with instructions
2. Add recent blockhash
3. If feeToken: "USDC":
   a. Send to Paymaster service
   b. Paymaster adds fee payer
   c. Paymaster partially signs
4. User signs with passkey (WebAuthn)
5. Transaction sent to Solana network
6. Return signature on confirmation
```

### Error Codes Reference

| Error | Meaning | Action |
|-------|---------|--------|
| `UserCancelled` | User dismissed biometric | No action needed |
| `InsufficientBalance` | Not enough SOL | Add funds or reduce amount |
| `InvalidRecipient` | Bad address format | Check address |
| `PaymasterError` | Service issue | Try SOL fees |
| `NetworkError` | RPC/connection issue | Retry later |

## Next Steps

Congratulations! You've learned how to:
- Build SOL transfer instructions
- Use Paymaster for gasless transactions
- Handle errors gracefully
- Create a complete transfer form

### Ideas to Extend

1. **Add token transfers** - Send SPL tokens, not just SOL
2. **Batch transactions** - Multiple instructions in one tx
3. **Transaction history** - Show past transfers
4. **Address book** - Save frequent recipients

## Resources

- [Solana Web3.js Documentation](https://solana-labs.github.io/solana-web3.js/)
- [SystemProgram Reference](https://docs.solana.com/developing/runtime-facilities/programs#system-program)
- [LazorKit Paymaster Docs](https://docs.lazorkit.com/)
- [Solana Transaction Structure](https://docs.solana.com/developing/programming-model/transactions)
