# Tutorial 3: Payment Widget

<div align="center">

![Difficulty](https://img.shields.io/badge/Difficulty-Intermediate-yellow?style=flat-square)
![Time](https://img.shields.io/badge/Time-15%20min-blue?style=flat-square)
![Prerequisites](https://img.shields.io/badge/Prerequisites-Tutorial%201%20%26%202-orange?style=flat-square)

**A drop-in payment component for merchants to accept SOL payments with passkey authentication.**

[Live Demo](https://lazorkit-lovat.vercel.app/payment-widget) | [Source Code](../app/payment-widget)

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [Features](#payment-widget-features)
- [Basic Integration](#basic-integration)
- [Complete Example](#complete-example)
- [Props Reference](#props-reference)
- [Use Cases](#use-cases)
- [Payment Flow](#payment-flow)
- [Customization](#customization-examples)
- [Architecture](#understanding-the-architecture)
- [Common Issues](#common-issues)
- [Next Steps](#next-steps)

---

## Introduction

Traditional crypto payment integration requires extensive development work - building transaction flows, handling wallet connections, managing states, and ensuring security. The Payment Widget abstracts all of this complexity into a single, reusable component.

### What You'll Learn

| Topic | Description |
|-------|-------------|
| 🔌 Integration | How to integrate the PaymentWidget component |
| ⚙️ Configuration | Configuring merchant settings and callbacks |
| 🔄 Flow | Understanding the payment flow |
| 🎨 Customization | Customizing the widget for different use cases |

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Tutorial 1: Passkey Login](./01-passkey-login.md) | Must be completed |
| [Tutorial 2: Gasless Transfer](./02-gasless-transfer.md) | Must be completed |
| React knowledge | Component props and callbacks |

---

## Payment Widget Features

<table>
<tr>
<td width="33%" align="center">

### 📱 QR Code

Solana Pay compatible
for mobile wallets

</td>
<td width="33%" align="center">

### 🔐 Passkey Auth

Biometric signing
no seed phrases

</td>
<td width="33%" align="center">

### ⛽ Gasless

Paymaster-sponsored
transactions

</td>
</tr>
<tr>
<td width="33%" align="center">

### 🎨 Customizable

Merchant branding
amounts, callbacks

</td>
<td width="33%" align="center">

### 📊 Real-time

Processing, success
and error states

</td>
<td width="33%" align="center">

### 📲 Responsive

Works on all
device sizes

</td>
</tr>
</table>

---

## Basic Integration

### Step 1: Import the Component

```tsx
import { PaymentWidget } from "@/components/payment";
```

### Step 2: Add to Your Page

```tsx
function CheckoutPage() {
  return (
    <PaymentWidget
      merchantAddress="YOUR_SOLANA_WALLET_ADDRESS"
      amount={0.05}
      currency="SOL"
    />
  );
}
```

> **That's it!** The widget handles:
> - Wallet connection (creates passkey if new user)
> - QR code generation for mobile payments
> - Transaction building and signing
> - Status updates and error handling

---

## Complete Example

```tsx
"use client";

import { PaymentWidget } from "@/components/payment";
import { PaymentResult, PaymentError } from "@/hooks/usePayment";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();

  const handlePaymentSuccess = (result: PaymentResult) => {
    console.log("Payment successful!", result.signature);

    // Redirect to confirmation page
    router.push(`/order/confirmed?tx=${result.signature}`);
  };

  const handlePaymentError = (error: PaymentError) => {
    console.error("Payment failed:", error.message);

    // Show error notification
    if (error.recoverable) {
      alert("Payment failed. Please try again.");
    } else {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Complete Your Purchase</h1>

      <PaymentWidget
        merchantAddress="7xKp...your-address...3mNq"
        merchantName="My Online Store"
        description="Premium Subscription (1 month)"
        amount={9.99}
        currency="SOL"
        showQR={true}
        enableGasless={true}
        onPaymentSuccess={handlePaymentSuccess}
        onPaymentError={handlePaymentError}
      />
    </div>
  );
}
```

---

## Props Reference

### Required Props

| Prop | Type | Description |
|------|:----:|-------------|
| `merchantAddress` | `string` | Your Solana wallet address (base58) |

### Amount Configuration

| Prop | Type | Default | Description |
|------|:----:|:-------:|-------------|
| `amount` | `number` | - | Fixed payment amount |
| `currency` | `"SOL" \| "USDC"` | `"SOL"` | Payment currency |
| `allowCustomAmount` | `boolean` | `false` | Let user enter amount |

### Merchant Branding

| Prop | Type | Description |
|------|:----:|-------------|
| `merchantName` | `string` | Display name (e.g., "Coffee Shop") |
| `merchantLogo` | `string` | Logo URL |
| `description` | `string` | Payment description |
| `reference` | `string` | Order/invoice reference ID |

### Feature Toggles

| Prop | Type | Default | Description |
|------|:----:|:-------:|-------------|
| `showQR` | `boolean` | `true` | Display Solana Pay QR code |
| `enableGasless` | `boolean` | `true` | Allow gasless (USDC fee) payments |

### Callbacks

| Prop | Type | Description |
|------|------|-------------|
| `onPaymentStart` | `() => void` | Called when payment begins |
| `onPaymentSuccess` | `(result: PaymentResult) => void` | Called on successful payment |
| `onPaymentError` | `(error: PaymentError) => void` | Called on payment failure |
| `onPaymentCancel` | `() => void` | Called when user cancels |

### Styling

| Prop | Type | Description |
|------|:----:|-------------|
| `className` | `string` | Additional CSS classes |

---

## Result & Error Objects

<table>
<tr>
<td width="50%">

### PaymentResult

```typescript
interface PaymentResult {
  signature: string;
  explorerUrl: string;
  amount: number;
  currency: "SOL" | "USDC";
  reference?: string;
  timestamp: number;
}
```

</td>
<td width="50%">

### PaymentError

```typescript
interface PaymentError {
  code: string;
  message: string;
  recoverable: boolean;
}
```

</td>
</tr>
</table>

### Error Codes

| Code | Description | Recoverable |
|------|-------------|:-----------:|
| `USER_CANCELLED` | User dismissed biometric | ✅ |
| `INSUFFICIENT_BALANCE` | Not enough funds | ✅ |
| `INVALID_AMOUNT` | Amount validation failed | ✅ |
| `PAYMASTER_ERROR` | Fee sponsorship failed | ✅ |
| `NETWORK_ERROR` | Connection issues | ✅ |
| `TRANSACTION_FAILED` | On-chain failure | ❌ |

---

## Use Cases

<table>
<tr>
<td width="50%">

### 🛒 E-commerce Checkout

Fixed amount, hide QR for desktop:

```tsx
<PaymentWidget
  merchantAddress="..."
  merchantName="Online Store"
  description="Order #12345"
  amount={29.99}
  showQR={false}
  onPaymentSuccess={(result) => {
    updateOrder(orderId, {
      paid: true,
      txId: result.signature
    });
  }}
/>
```

</td>
<td width="50%">

### 💝 Donation / Tip Jar

Custom amount, show QR for mobile:

```tsx
<PaymentWidget
  merchantAddress="..."
  merchantName="Support My Work"
  description="Donation"
  allowCustomAmount={true}
  showQR={true}
  enableGasless={true}
/>
```

</td>
</tr>
<tr>
<td width="50%">

### ☕ Point of Sale

Fixed amount with reference:

```tsx
<PaymentWidget
  merchantAddress="..."
  merchantName="Coffee Shop"
  description="Latte (Large)"
  amount={0.05}
  reference={`POS-${Date.now()}`}
  showQR={true}
/>
```

</td>
<td width="50%">

### 📅 Subscription Payment

Fixed recurring amount, gasless:

```tsx
<PaymentWidget
  merchantAddress="..."
  merchantName="SaaS Platform"
  description="Pro Plan (Monthly)"
  amount={9.99}
  enableGasless={true}
  onPaymentSuccess={(result) => {
    activateSubscription(
      userId,
      result.signature
    );
  }}
/>
```

</td>
</tr>
</table>

---

## Payment Flow

### Connected User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        CONNECTED USER PAYMENT FLOW                          │
└─────────────────────────────────────────────────────────────────────────────┘

  1. See widget        2. Click Pay         3. Biometric
       │                    │                    │
       ▼                    ▼                    ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │  💰 0.05 │  ───►  │   🔐     │  ───►  │   👆     │
  │   SOL    │        │  Pay w/  │        │ Face ID  │
  │          │        │ Passkey  │        │ Touch ID │
  └──────────┘        └──────────┘        └──────────┘
                                               │
       ┌───────────────────────────────────────┘
       ▼
  4. Sign & Send      5. Confirm!
       │                   │
       ▼                   ▼
  ┌──────────┐        ┌──────────┐
  │   ✍️     │  ───►  │   ✅     │
  │Transaction│        │ Success  │
  │   Sent   │        │ Callback │
  └──────────┘        └──────────┘
```

### New User Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          NEW USER PAYMENT FLOW                              │
└─────────────────────────────────────────────────────────────────────────────┘

  1. See widget        2. Connect & Pay     3. Create Passkey
       │                    │                    │
       ▼                    ▼                    ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │  💰 0.05 │  ───►  │   🔗     │  ───►  │   🔐     │
  │   SOL    │        │ Connect  │        │  Create  │
  │          │        │  & Pay   │        │ Passkey  │
  └──────────┘        └──────────┘        └──────────┘
                                               │
       ┌───────────────────────────────────────┘
       ▼
  4. Wallet Created   5. Sign & Send       6. Confirm!
       │                   │                    │
       ▼                   ▼                    ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │   💳     │  ───►  │   ✍️     │  ───►  │   ✅     │
  │  Wallet  │        │Transaction│        │ Success  │
  │ Connected│        │   Sent   │        │ Callback │
  └──────────┘        └──────────┘        └──────────┘
```

### QR Code Flow (External Wallet)

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         QR CODE PAYMENT FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

  1. Scan QR          2. Wallet Opens      3. Confirm
       │                    │                   │
       ▼                    ▼                   ▼
  ┌──────────┐        ┌──────────┐        ┌──────────┐
  │   📱     │  ───►  │ Phantom/ │  ───►  │   ✅     │
  │  Scan    │        │ Solflare │        │ Approve  │
  │   QR     │        │  Opens   │        │   Tx     │
  └──────────┘        └──────────┘        └──────────┘
                                               │
                                               ▼
                                        ┌──────────┐
                                        │   💸     │
                                        │ Payment  │
                                        │  Sent!   │
                                        └──────────┘
```

---

## Customization Examples

### Custom Styling

```tsx
<PaymentWidget
  merchantAddress="..."
  amount={0.01}
  className="border-2 border-purple-500 rounded-2xl"
/>
```

### Minimal Widget

```tsx
<PaymentWidget
  merchantAddress="..."
  amount={0.01}
  showQR={false}
  enableGasless={false}
/>
```

### Full Featured Widget

```tsx
<PaymentWidget
  merchantAddress="..."
  merchantName="Premium Store"
  merchantLogo="/logo.png"
  description="Annual Subscription"
  amount={99.99}
  currency="SOL"
  reference={`SUB-${userId}-${Date.now()}`}
  allowCustomAmount={false}
  showQR={true}
  enableGasless={true}
  onPaymentStart={() => setLoading(true)}
  onPaymentSuccess={handleSuccess}
  onPaymentError={handleError}
  onPaymentCancel={() => setLoading(false)}
  className="shadow-xl"
/>
```

---

## Understanding the Architecture

### Component Structure

```
┌─────────────────────────────────────────────────────────────────┐
│                       PaymentWidget                             │
├─────────────────────────────────────────────────────────────────┤
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  MerchantHeader                                           │  │
│  │  (name, logo, description)                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  AmountSection                                            │  │
│  │  ├── FixedAmount OR CustomAmountInput                     │  │
│  │  └── CurrencySelector (if enableGasless)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  QRCodeSection (if showQR && amount > 0)                  │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PaymentStatus (processing/success/error)                 │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  PayButton                                                │  │
│  └───────────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Footer (powered by LazorKit)                             │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Internal Hooks

```typescript
const { status, result, error, pay, reset } = usePayment({
  merchantAddress,
  onPaymentStart,
  onPaymentSuccess,
  onPaymentError,
  onPaymentCancel,
});
```

### State Machine

```
┌────────────────────────────────────────────────────────────────┐
│                      STATE MACHINE                             │
└────────────────────────────────────────────────────────────────┘

                          ┌──────────┐
                          │   IDLE   │◄─────────────────┐
                          └────┬─────┘                  │
                               │ click                  │
                               ▼                        │
                        ┌────────────┐                  │
                        │ CONNECTING │                  │
                        └──────┬─────┘                  │
                               │                        │
              ┌────────────────┼────────────────┐       │
              ▼                ▼                ▼       │
       ┌────────────┐   ┌────────────┐   ┌──────────┐  │
       │ PROCESSING │   │   ERROR    │   │ CANCELLED│──┘
       └──────┬─────┘   │(recoverable)│   └──────────┘
              │         └──────┬─────┘
              │                │ retry
              │                ▼
              │         ┌────────────┐
              └────────►│ PROCESSING │
                        └──────┬─────┘
                               │
                               ▼
                        ┌────────────┐
                        │  SUCCESS   │
                        └────────────┘
```

---

## Solana Pay QR Code

The QR code is Solana Pay compatible, works with:

| Wallet | Support |
|--------|:-------:|
| Phantom | ✅ |
| Solflare | ✅ |
| Backpack | ✅ |
| Any Solana Pay wallet | ✅ |

### QR URL Format

```
solana:<recipient>?amount=<amount>&label=<label>&message=<message>
```

**Example:**
```
solana:7xKp...3mNq?amount=0.05&label=Coffee%20Shop&message=Premium%20Coffee
```

---

## Common Issues

<details>
<summary><b>🔴 "Invalid merchant address"</b></summary>

**Cause:** The `merchantAddress` prop is not a valid Solana address.

**Solution:** Verify the address is 32-44 characters and base58 encoded.

</details>

<details>
<summary><b>🟡 Payment succeeds but callback doesn't fire</b></summary>

**Cause:** Component unmounted before callback.

**Solution:** Ensure the widget stays mounted until payment completes.

</details>

<details>
<summary><b>🟡 QR code not scanning</b></summary>

**Cause:** Amount is 0 or invalid.

**Solution:** Set a valid positive amount for QR generation.

</details>

<details>
<summary><b>🟠 Gasless payment failing</b></summary>

**Cause:** Paymaster rate limit or service issue.

**Solution:** Set `enableGasless={false}` as fallback.

</details>

---

## Best Practices

| # | Practice | Why |
|---|----------|-----|
| 1 | **Always handle callbacks** | Don't ignore `onPaymentError` |
| 2 | **Show loading states** | Use `onPaymentStart` to indicate processing |
| 3 | **Provide clear descriptions** | Help users understand what they're paying for |
| 4 | **Test on devnet first** | Use Solana Faucet for test SOL |
| 5 | **Use references** | Track payments with unique reference IDs |
| 6 | **Handle edge cases** | Account for network errors, cancellations |

---

## Security Considerations

| Feature | Benefit |
|---------|---------|
| 🔐 **Private keys never leave device** | Passkeys use Secure Enclave |
| 🌐 **Origin-bound credentials** | Can't be phished to other domains |
| 👆 **User must approve** | Biometric required for every transaction |
| 👁️ **Transaction preview** | Amount shown before signing |

---

## Next Steps

<table>
<tr>
<td width="70%">

Now that you've integrated the Payment Widget, proceed to **Tutorial 4: Cross-Device Session** to learn how users can access their wallet from any synced device.

**What you'll learn:**
- How passkeys sync via iCloud/Google/Windows
- Same wallet on multiple devices
- No seed phrase backup needed

</td>
<td width="30%" align="center">

[**Tutorial 4: Cross-Device →**](./04-cross-device-session.md)

</td>
</tr>
</table>

### Ideas to Extend

| Feature | Description |
|---------|-------------|
| 🔔 Webhook integration | Track payments server-side |
| 📦 Order management | Link payments to orders/invoices |
| 📊 Analytics | Track conversion rates |
| 🚀 Mainnet deployment | Switch to production when ready |

---

## Resources

| Resource | Link |
|----------|------|
| Solana Pay Specification | [docs.solanapay.com](https://docs.solanapay.com/) |
| LazorKit Documentation | [docs.lazorkit.com](https://docs.lazorkit.com/) |
| QR Code Best Practices | [qrcode.com](https://www.qrcode.com/en/howto/) |

---

<div align="center">

**[← Tutorial 2: Gasless Transfer](./02-gasless-transfer.md)** | **[Tutorial 4: Cross-Device Session →](./04-cross-device-session.md)**

</div>
