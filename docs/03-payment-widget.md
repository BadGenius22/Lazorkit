# Tutorial 3: Payment Widget

A drop-in payment component for merchants to accept SOL payments with passkey authentication and QR code support.

## Introduction

Traditional crypto payment integration requires extensive development work - building transaction flows, handling wallet connections, managing states, and ensuring security. The Payment Widget abstracts all of this complexity into a single, reusable component.

### What You'll Learn

- How to integrate the PaymentWidget component
- Configuring merchant settings and callbacks
- Understanding the payment flow
- Customizing the widget for different use cases

### Prerequisites

- Completed [Tutorial 1: Passkey Login](./01-passkey-login.md)
- Completed [Tutorial 2: Gasless Transfer](./02-gasless-transfer.md)
- Understanding of React component props and callbacks

## Payment Widget Features

| Feature | Description |
|---------|-------------|
| **QR Code Support** | Solana Pay compatible QR for mobile wallets |
| **Passkey Authentication** | Biometric signing, no seed phrases |
| **Gasless Payments** | Paymaster-sponsored transactions |
| **Customizable** | Merchant branding, amounts, callbacks |
| **Real-time Status** | Processing, success, and error states |
| **Mobile Responsive** | Works on all device sizes |

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

That's it! The widget handles:
- Wallet connection (creates passkey if new user)
- QR code generation for mobile payments
- Transaction building and signing
- Status updates and error handling

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

## Props Reference

### Required Props

| Prop | Type | Description |
|------|------|-------------|
| `merchantAddress` | `string` | Your Solana wallet address (base58) |

### Amount Configuration

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `amount` | `number` | - | Fixed payment amount |
| `currency` | `"SOL" \| "USDC"` | `"SOL"` | Payment currency |
| `allowCustomAmount` | `boolean` | `false` | Let user enter amount |

### Merchant Branding

| Prop | Type | Description |
|------|------|-------------|
| `merchantName` | `string` | Display name (e.g., "Coffee Shop") |
| `merchantLogo` | `string` | Logo URL |
| `description` | `string` | Payment description |
| `reference` | `string` | Order/invoice reference ID |

### Feature Toggles

| Prop | Type | Default | Description |
|------|------|---------|-------------|
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
|------|------|-------------|
| `className` | `string` | Additional CSS classes |

## Payment Result Object

When a payment succeeds, `onPaymentSuccess` receives:

```typescript
interface PaymentResult {
  signature: string;        // Transaction signature
  explorerUrl: string;      // Solana Explorer link
  amount: number;           // Amount paid
  currency: "SOL" | "USDC"; // Currency used
  reference?: string;       // Order reference (if provided)
  timestamp: number;        // Unix timestamp
}
```

## Payment Error Object

When a payment fails, `onPaymentError` receives:

```typescript
interface PaymentError {
  code: string;       // Error code
  message: string;    // Human-readable message
  recoverable: boolean; // Can user retry?
}

// Error codes:
// - USER_CANCELLED: User dismissed biometric
// - INSUFFICIENT_BALANCE: Not enough funds
// - INVALID_AMOUNT: Amount validation failed
// - PAYMASTER_ERROR: Fee sponsorship failed
// - NETWORK_ERROR: Connection issues
// - TRANSACTION_FAILED: On-chain failure
```

## Use Cases

### E-commerce Checkout

Fixed amount, hide QR for desktop:

```tsx
<PaymentWidget
  merchantAddress="..."
  merchantName="Online Store"
  description="Order #12345"
  amount={29.99}
  showQR={false}
  onPaymentSuccess={(result) => {
    // Update order status
    updateOrder(orderId, { paid: true, txId: result.signature });
  }}
/>
```

### Donation / Tip Jar

Custom amount, show QR for mobile donors:

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

### Point of Sale

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

### Subscription Payment

Fixed recurring amount, gasless enabled:

```tsx
<PaymentWidget
  merchantAddress="..."
  merchantName="SaaS Platform"
  description="Pro Plan (Monthly)"
  amount={9.99}
  enableGasless={true}
  onPaymentSuccess={(result) => {
    // Activate subscription
    activateSubscription(userId, result.signature);
  }}
/>
```

## Payment Flow

### Connected User Flow

```
1. User sees payment widget with amount
2. Clicks "Pay with Passkey"
3. Biometric prompt appears
4. User authenticates
5. Transaction is signed and sent
6. Success callback fires
```

### New User Flow

```
1. User sees payment widget with amount
2. Clicks "Connect & Pay"
3. Passkey creation prompt appears
4. User creates passkey with biometrics
5. Wallet is created and connected
6. Transaction is signed and sent
7. Success callback fires
```

### QR Code Flow (External Wallet)

```
1. User scans QR with Phantom/Solflare
2. Wallet app opens with payment details
3. User confirms in external wallet
4. Transaction sent to Solana
5. (Widget doesn't track external payments)
```

## Customization Examples

### Custom Styling

```tsx
<PaymentWidget
  merchantAddress="..."
  amount={0.01}
  className="border-2 border-purple-500 rounded-2xl"
/>
```

### Minimal Widget (No QR, No Gasless Toggle)

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

## Understanding the Architecture

### Component Structure

```
PaymentWidget
├── MerchantHeader (name, logo, description)
├── AmountSection
│   ├── FixedAmount OR CustomAmountInput
│   └── CurrencySelector (if enableGasless)
├── QRCodeSection (if showQR && amount > 0)
├── PaymentStatus (processing/success/error)
├── PayButton
└── Footer (powered by LazorKit)
```

### Internal Hooks

The widget uses `usePayment` hook internally:

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
IDLE → CONNECTING → PROCESSING → SUCCESS
                 └→ ERROR (recoverable) → PROCESSING
                 └→ CANCELLED → IDLE
```

## Solana Pay QR Code

The QR code is Solana Pay compatible, meaning it works with:

- Phantom
- Solflare
- Backpack
- Any Solana Pay compliant wallet

### QR URL Format

```
solana:<recipient>?amount=<amount>&label=<label>&message=<message>
```

Example:
```
solana:7xKp...3mNq?amount=0.05&label=Coffee%20Shop&message=Premium%20Coffee
```

## Common Issues

### "Invalid merchant address"

**Cause:** The `merchantAddress` prop is not a valid Solana address.

**Solution:** Verify the address is 32-44 characters and base58 encoded.

### Payment succeeds but callback doesn't fire

**Cause:** Component unmounted before callback.

**Solution:** Ensure the widget stays mounted until payment completes.

### QR code not scanning

**Cause:** Amount is 0 or invalid.

**Solution:** Set a valid positive amount for QR generation.

### Gasless payment failing

**Cause:** Paymaster rate limit or service issue.

**Solution:** Set `enableGasless={false}` as fallback.

## Best Practices

1. **Always handle callbacks** - Don't ignore `onPaymentError`
2. **Show loading states** - Use `onPaymentStart` to indicate processing
3. **Provide clear descriptions** - Help users understand what they're paying for
4. **Test on devnet first** - Use Solana Faucet for test SOL
5. **Use references** - Track payments with unique reference IDs
6. **Handle edge cases** - Account for network errors, cancellations

## Security Considerations

- **Private keys never leave device** - Passkeys use Secure Enclave
- **Origin-bound credentials** - Can't be phished to other domains
- **User must approve** - Biometric required for every transaction
- **Transaction preview** - Amount shown before signing

## Next Steps

Now that you've integrated the Payment Widget, consider:

1. **Webhook integration** - Track payments server-side
2. **Order management** - Link payments to orders/invoices
3. **Analytics** - Track conversion rates
4. **Mainnet deployment** - Switch to production when ready

## Resources

- [Solana Pay Specification](https://docs.solanapay.com/)
- [LazorKit Documentation](https://docs.lazorkit.com/)
- [QR Code Best Practices](https://www.qrcode.com/en/howto/)
