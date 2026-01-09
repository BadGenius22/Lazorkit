# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LazorKit SDK Integration Example - a practical code example demonstrating passkey-based wallet creation and gasless transactions on Solana. The goal is to help developers integrate LazorKit SDK quickly, not to build a full product.

## Commands

```bash
# Development
pnpm dev                    # Start dev server at localhost:3000
pnpm build                  # Production build
pnpm start                  # Run production build
pnpm lint                   # ESLint check

# Deployment
vercel                      # Deploy preview
vercel --prod               # Deploy production
```

## Architecture

### Tech Stack
- **Runtime**: Node.js 20+, pnpm 8+
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS
- **Blockchain**: Solana Devnet
- **SDK**: @lazorkit/wallet, @solana/web3.js, @coral-xyz/anchor

### Key Architecture Decisions

1. **App Router over Pages Router** - Using `app/` directory for modern React patterns
2. **React Context over Redux** - LazorkitProvider's built-in context is sufficient for this scope
3. **Client-side only for wallet ops** - WebAuthn requires browser APIs; use `"use client"` directive
4. **Environment variables** - All service URLs via `NEXT_PUBLIC_*` in `.env.local`

### Component Hierarchy

```
app/layout.tsx
└── LazorkitProvider (Context)
    └── Navbar
    │   └── ConnectButton
    └── {children}
        ├── app/page.tsx (Homepage)
        ├── app/passkey-login/page.tsx (Tutorial 1)
        └── app/gasless-transfer/page.tsx (Tutorial 2)
            └── TransferForm
```

### State Management

- **Global**: LazorkitProvider context (`wallet`, `isConnected`, `smartWalletPubkey`)
- **Local**: Component state for form inputs, loading, errors
- **Persistence**: Session tokens in localStorage, cleared on disconnect

### Core SDK Usage Pattern

```typescript
// Provider setup in layout.tsx
<LazorkitProvider
  rpcUrl={process.env.NEXT_PUBLIC_RPC_URL}
  portalUrl={process.env.NEXT_PUBLIC_PORTAL_URL}
  paymasterConfig={{ paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL }}
>

// Hook usage in components
const { wallet, isConnected, connect, disconnect, signAndSendTransaction } = useWallet();

// Gasless transaction
const signature = await signAndSendTransaction({
  instructions: [transferInstruction],
  transactionOptions: { feeToken: 'USDC' }
});
```

### Buffer Polyfill

Required for @solana/web3.js in browser. Configure in `next.config.js`:

```javascript
webpack: (config) => {
  config.resolve.fallback = { buffer: require.resolve('buffer/') };
  return config;
}
```

## Environment Variables

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

## Project Documentation

- **ARCHITECTURE.md** - Detailed technical architecture, sequence diagrams, security model
- **PLAN.md** - Project plan, success metrics, risk assessment, SDK reference
- **IMPLEMENTATION-CHECKLIST.md** - Phase-by-phase task tracking with acceptance criteria

## Error Handling Pattern

```typescript
try {
  const signature = await signAndSendTransaction({...});
} catch (err) {
  if (err.name === 'UserCancelled') return; // Silent - user dismissed biometric
  if (err.message?.includes('insufficient')) setError('Insufficient balance');
  else if (err.message?.includes('paymaster')) setError('Try using SOL for fees');
  else setError(`Transaction failed: ${err.message}`);
}
```

## Quality Checklist

Before considering implementation complete:
- [ ] TypeScript strict mode, no `any` types
- [ ] All user inputs validated
- [ ] Loading states for async operations
- [ ] Error messages are user-friendly (no stack traces)
- [ ] `pnpm build` succeeds without errors
- [ ] Works on Chrome, Safari, Firefox, Edge
- [ ] Mobile responsive (biometrics work on iOS/Android)
