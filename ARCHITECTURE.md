# LazorKit SDK Integration Example - Technical Architecture

> **Purpose:** A practical code example demonstrating LazorKit SDK integration for developers to get started fast.

## Table of Contents
- [System Overview](#system-overview)
- [Architecture Decision Records](#architecture-decision-records)
- [Architecture Layers](#architecture-layers)
- [Data Flow Diagrams](#data-flow-diagrams)
- [Component Architecture](#component-architecture)
- [State Management](#state-management)
- [Security Model](#security-model)
- [API Reference](#api-reference)
- [Error Handling Strategy](#error-handling-strategy)
- [Observability & Monitoring](#observability--monitoring)
- [Performance Considerations](#performance-considerations)
- [Testing Architecture](#testing-architecture)
- [Edge Cases & Failure Modes](#edge-cases--failure-modes)
- [Scalability & Future Considerations](#scalability--future-considerations)
- [Dependencies](#dependencies)
- [Compliance & Data Privacy](#compliance--data-privacy)

---

## System Overview

### High-Level Architecture

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                              USER DEVICE                                      │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐        │
│  │  Secure Enclave  │    │  Browser/App     │    │  WebAuthn API    │        │
│  │  ┌────────────┐  │    │  ┌────────────┐  │    │  ┌────────────┐  │        │
│  │  │ Private Key│  │◄──►│  │ Next.js    │  │◄──►│  │ Credential │  │        │
│  │  │ (P-256)    │  │    │  │ Frontend   │  │    │  │ Manager    │  │        │
│  │  └────────────┘  │    │  └────────────┘  │    │  └────────────┘  │        │
│  │  FaceID/TouchID  │    │  React Context   │    │  navigator.      │        │
│  │  Windows Hello   │    │  State Mgmt      │    │  credentials     │        │
│  └──────────────────┘    └────────┬─────────┘    └──────────────────┘        │
└───────────────────────────────────┼──────────────────────────────────────────┘
                                    │ HTTPS
                                    ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                         LAZORKIT INFRASTRUCTURE                               │
│                                                                               │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐        │
│  │  Portal Service  │    │  Paymaster       │    │  RPC Gateway     │        │
│  │  ┌────────────┐  │    │  ┌────────────┐  │    │  ┌────────────┐  │        │
│  │  │ Passkey    │  │    │  │ Fee        │  │    │  │ Load       │  │        │
│  │  │ Registry   │  │    │  │ Sponsor    │  │    │  │ Balancer   │  │        │
│  │  └────────────┘  │    │  └────────────┘  │    │  └────────────┘  │        │
│  │  ┌────────────┐  │    │  ┌────────────┐  │    │  ┌────────────┐  │        │
│  │  │ Session    │  │    │  │ Token      │  │    │  │ Rate       │  │        │
│  │  │ Manager    │  │    │  │ Validator  │  │    │  │ Limiter    │  │        │
│  │  └────────────┘  │    │  └────────────┘  │    │  └────────────┘  │        │
│  └────────┬─────────┘    └────────┬─────────┘    └────────┬─────────┘        │
└───────────┼────────────────────────┼────────────────────────┼────────────────┘
            │                        │                        │
            └────────────────────────┼────────────────────────┘
                                     ▼
┌──────────────────────────────────────────────────────────────────────────────┐
│                            SOLANA DEVNET                                      │
│                                                                               │
│  ┌──────────────────┐    ┌──────────────────┐    ┌──────────────────┐        │
│  │  LazorKit        │    │  Smart Wallet    │    │  System Program  │        │
│  │  Program         │    │  (PDA)           │    │                  │        │
│  │  ┌────────────┐  │    │  ┌────────────┐  │    │  ┌────────────┐  │        │
│  │  │ Verify     │  │───►│  │ User       │  │───►│  │ Transfer   │  │        │
│  │  │ Passkey    │  │    │  │ Funds      │  │    │  │ SOL        │  │        │
│  │  └────────────┘  │    │  └────────────┘  │    │  └────────────┘  │        │
│  │  ┌────────────┐  │    │  ┌────────────┐  │    │                  │        │
│  │  │ Derive     │  │    │  │ Access     │  │    │                  │        │
│  │  │ PDA        │  │    │  │ Control    │  │    │                  │        │
│  │  └────────────┘  │    │  └────────────┘  │    │                  │        │
│  └──────────────────┘    └──────────────────┘    └──────────────────┘        │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Layers

| Layer | Components | Responsibility |
|-------|------------|----------------|
| **Presentation** | Next.js Pages, React Components | UI rendering, user interaction |
| **Application** | Hooks, Context, State Management | Business logic, state coordination |
| **Integration** | LazorKit SDK, Web3.js | External service communication |
| **Security** | WebAuthn, Secure Enclave | Authentication, key management |
| **Infrastructure** | Portal, Paymaster, RPC | Backend services |
| **Blockchain** | Solana Programs, PDAs | On-chain state and execution |

---

## Architecture Decision Records

### ADR-001: Next.js App Router over Pages Router

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Context** | Need to choose between Next.js Pages Router and App Router for the demo application |
| **Decision** | Use App Router (app/ directory) |
| **Rationale** | - App Router is the recommended approach for new Next.js projects<br>- Better support for React Server Components<br>- Improved data fetching patterns<br>- Future-proof architecture |
| **Consequences** | + Modern patterns, better DX<br>- Requires "use client" directives for interactive components |

### ADR-002: React Context over External State Management

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Context** | Need state management for wallet connection state across components |
| **Decision** | Use LazorkitProvider's built-in React Context |
| **Rationale** | - SDK provides context out-of-box<br>- Demo scope is small (2 tutorials)<br>- Avoids unnecessary complexity<br>- No need for Redux/Zustand overhead |
| **Consequences** | + Simpler architecture<br>+ Fewer dependencies<br>- May need refactoring for larger apps |

### ADR-003: Tailwind CSS over CSS Modules/Styled Components

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Context** | Need styling solution for UI components |
| **Decision** | Use Tailwind CSS utility classes |
| **Rationale** | - Rapid prototyping with utility classes<br>- Built-in with create-next-app<br>- Excellent tree-shaking (small bundle)<br>- Consistent design system |
| **Consequences** | + Fast development<br>+ Small CSS bundle<br>- Class strings can be verbose |

### ADR-004: Client-Side Only for Wallet Operations

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Context** | WebAuthn and wallet operations require browser APIs |
| **Decision** | Mark wallet-related components as client-side ("use client") |
| **Rationale** | - WebAuthn only works in browser<br>- Passkey operations need Secure Enclave access<br>- Cannot SSR authentication flows |
| **Consequences** | + Works correctly with browser APIs<br>- Initial page load may show loading state |

### ADR-005: Environment Variables for Configuration

| Attribute | Value |
|-----------|-------|
| **Status** | Accepted |
| **Context** | Need to configure RPC URLs and service endpoints |
| **Decision** | Use NEXT_PUBLIC_* environment variables in .env.local |
| **Rationale** | - Standard Next.js pattern<br>- Easy to change per environment<br>- No hardcoded URLs in code<br>- Vercel supports env vars natively |
| **Consequences** | + Easy deployment configuration<br>+ No secrets in code<br>- Must remember NEXT_PUBLIC_ prefix |

---

## Data Flow Diagrams

### 1. Passkey Creation Flow (New User)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │     │ Browser │     │ Secure  │     │ Portal  │     │ Solana  │
│         │     │ (App)   │     │ Enclave │     │ Service │     │ Devnet  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     │ 1. Click      │               │               │               │
     │ "Connect"     │               │               │               │
     │──────────────►│               │               │               │
     │               │               │               │               │
     │               │ 2. Call       │               │               │
     │               │ navigator.    │               │               │
     │               │ credentials.  │               │               │
     │               │ create()      │               │               │
     │               │──────────────►│               │               │
     │               │               │               │               │
     │ 3. Biometric  │               │               │               │
     │ Prompt        │               │               │               │
     │◄──────────────┼───────────────│               │               │
     │               │               │               │               │
     │ 4. Authorize  │               │               │               │
     │ (FaceID/      │               │               │               │
     │  TouchID)     │               │               │               │
     │──────────────►│──────────────►│               │               │
     │               │               │               │               │
     │               │ 5. Generate   │               │               │
     │               │ P-256 keypair │               │               │
     │               │ in Secure     │               │               │
     │               │ Enclave       │               │               │
     │               │◄──────────────│               │               │
     │               │ (PublicKey +  │               │               │
     │               │  CredentialID)│               │               │
     │               │               │               │               │
     │               │ 6. Register   │               │               │
     │               │ passkey       │               │               │
     │               │──────────────────────────────►│               │
     │               │               │               │               │
     │               │               │               │ 7. Derive     │
     │               │               │               │ Smart Wallet  │
     │               │               │               │ PDA from      │
     │               │               │               │ public key    │
     │               │               │               │──────────────►│
     │               │               │               │               │
     │               │               │               │◄──────────────│
     │               │               │               │ 8. PDA Address│
     │               │               │               │               │
     │               │◄──────────────────────────────│               │
     │               │ 9. Return wallet address      │               │
     │               │    + session token            │               │
     │               │               │               │               │
     │◄──────────────│               │               │               │
     │ 10. Show      │               │               │               │
     │ connected     │               │               │               │
     │ state         │               │               │               │
     │               │               │               │               │
```

### 2. Passkey Login Flow (Returning User)

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │     │ Browser │     │ Secure  │     │ Portal  │
│         │     │ (App)   │     │ Enclave │     │ Service │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │
     │ 1. Click      │               │               │
     │ "Connect"     │               │               │
     │──────────────►│               │               │
     │               │               │               │
     │               │ 2. Check for  │               │
     │               │ existing      │               │
     │               │ credentials   │               │
     │               │──────────────►│               │
     │               │               │               │
     │               │◄──────────────│               │
     │               │ 3. Found      │               │
     │               │ credential    │               │
     │               │               │               │
     │ 4. Biometric  │               │               │
     │ Prompt        │               │               │
     │◄──────────────┼───────────────│               │
     │               │               │               │
     │ 5. Authorize  │               │               │
     │──────────────►│──────────────►│               │
     │               │               │               │
     │               │ 6. Sign       │               │
     │               │ challenge     │               │
     │               │◄──────────────│               │
     │               │               │               │
     │               │ 7. Verify     │               │
     │               │ signature     │               │
     │               │──────────────────────────────►│
     │               │               │               │
     │               │◄──────────────────────────────│
     │               │ 8. Session    │               │
     │               │ restored      │               │
     │               │               │               │
     │◄──────────────│               │               │
     │ 9. Connected  │               │               │
     │               │               │               │
```

### 3. Gasless Transaction Flow

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  User   │     │ App     │     │ Secure  │     │Paymaster│     │ Solana  │
│         │     │         │     │ Enclave │     │         │     │ Devnet  │
└────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘     └────┬────┘
     │               │               │               │               │
     │ 1. Enter      │               │               │               │
     │ recipient     │               │               │               │
     │ + amount      │               │               │               │
     │──────────────►│               │               │               │
     │               │               │               │               │
     │               │ 2. Build      │               │               │
     │               │ SystemProgram │               │               │
     │               │ .transfer()   │               │               │
     │               │ instruction   │               │               │
     │               │               │               │               │
     │               │ 3. Request    │               │               │
     │               │ fee wrapping  │               │               │
     │               │ (feeToken:    │               │               │
     │               │  USDC)        │               │               │
     │               │──────────────────────────────►│               │
     │               │               │               │               │
     │               │               │               │ 4. Validate   │
     │               │               │               │ transaction   │
     │               │               │               │ & check       │
     │               │               │               │ sponsorship   │
     │               │               │               │ eligibility   │
     │               │               │               │               │
     │               │◄──────────────────────────────│               │
     │               │ 5. Return     │               │               │
     │               │ wrapped tx    │               │               │
     │               │ with fee      │               │               │
     │               │ instruction   │               │               │
     │               │               │               │               │
     │ 6. Biometric  │               │               │               │
     │ prompt to     │               │               │               │
     │ sign tx       │               │               │               │
     │◄──────────────┼───────────────│               │               │
     │               │               │               │               │
     │ 7. Authorize  │               │               │               │
     │──────────────►│──────────────►│               │               │
     │               │               │               │               │
     │               │ 8. Sign tx    │               │               │
     │               │ with passkey  │               │               │
     │               │◄──────────────│               │               │
     │               │               │               │               │
     │               │ 9. Submit     │               │               │
     │               │ signed tx     │               │               │
     │               │──────────────────────────────►│               │
     │               │               │               │               │
     │               │               │               │ 10. Relay to  │
     │               │               │               │ Solana with   │
     │               │               │               │ sponsored fee │
     │               │               │               │──────────────►│
     │               │               │               │               │
     │               │               │               │◄──────────────│
     │               │               │               │ 11. Confirm   │
     │               │               │               │               │
     │               │◄──────────────────────────────│               │
     │               │ 12. Signature │               │               │
     │               │               │               │               │
     │◄──────────────│               │               │               │
     │ 13. Success   │               │               │               │
     │ + Explorer    │               │               │               │
     │ link          │               │               │               │
```

---

## Component Architecture

### Component Hierarchy

```
app/layout.tsx
└── LazorkitProvider (Context Provider)
    ├── <head> metadata
    └── <body>
        └── BufferPolyfill (Client-side)
            └── Navbar
            │   ├── Logo/Brand
            │   ├── NavLinks
            │   │   ├── Link: Home (/)
            │   │   ├── Link: Passkey Login (/passkey-login)
            │   │   └── Link: Gasless Transfer (/gasless-transfer)
            │   └── ConnectButton
            │       ├── State: Disconnected → "Connect Wallet"
            │       ├── State: Connecting → "Connecting..." (disabled)
            │       └── State: Connected → "Disconnect (0x...)"
            └── {children} (Page Content)
                │
                ├── app/page.tsx (Homepage)
                │   ├── HeroSection
                │   ├── FeatureCards
                │   │   ├── PasskeyCard → /passkey-login
                │   │   └── GaslessCard → /gasless-transfer
                │   └── InfoSection
                │
                ├── app/passkey-login/page.tsx
                │   ├── PageHeader
                │   ├── InstructionsPanel
                │   ├── ConnectButton (if disconnected)
                │   └── WalletInfo (if connected)
                │       ├── AddressDisplay
                │       ├── CopyButton
                │       ├── ExplorerLink
                │       └── BalanceDisplay
                │
                └── app/gasless-transfer/page.tsx
                    ├── PageHeader
                    ├── ConnectionGuard (requires wallet)
                    │   ├── WalletInfo
                    │   └── TransferForm
                    │       ├── RecipientInput
                    │       ├── AmountInput
                    │       ├── FeeTokenSelector
                    │       │   ├── Option: SOL
                    │       │   └── Option: USDC (gasless)
                    │       ├── SubmitButton
                    │       └── ResultDisplay
                    │           ├── LoadingSpinner
                    │           ├── SuccessMessage + ExplorerLink
                    │           └── ErrorMessage + RetryButton
                    └── NotConnectedPrompt (if disconnected)
```

### Component Specifications

#### LazorkitProvider (`app/layout.tsx`)

```typescript
interface LazorkitProviderProps {
  children: React.ReactNode;
  rpcUrl: string;              // Solana RPC endpoint
  portalUrl: string;           // LazorKit portal service
  paymasterConfig: {
    paymasterUrl: string;      // Fee sponsorship service
  };
}

// Context value provided to children
interface LazorkitContextValue {
  wallet: WalletAccount | null;
  isConnected: boolean;
  isConnecting: boolean;
  smartWalletPubkey: PublicKey | null;
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (params: TransactionParams) => Promise<string>;
}
```

#### ConnectButton (`components/ConnectButton.tsx`)

```typescript
interface ConnectButtonProps {
  className?: string;
  variant?: 'default' | 'compact';
}

// Internal state machine
type ButtonState =
  | { status: 'disconnected' }
  | { status: 'connecting' }
  | { status: 'connected'; address: string };

// Rendered outputs by state
// disconnected → <button>Connect Wallet</button>
// connecting   → <button disabled>Connecting...</button>
// connected    → <button>Disconnect ({truncatedAddress})</button>
```

#### WalletInfo (`components/WalletInfo.tsx`)

```typescript
interface WalletInfoProps {
  showBalance?: boolean;       // Default: true
  showExplorerLink?: boolean;  // Default: true
  showCopyButton?: boolean;    // Default: true
}

// Display format
// ┌────────────────────────────────────┐
// │ Smart Wallet Address               │
// │ 7xKp...3mNq  [Copy] [Explorer ↗]  │
// │                                    │
// │ Balance: 1.5 SOL                   │
// └────────────────────────────────────┘
```

#### TransferForm (`components/TransferForm.tsx`)

```typescript
interface TransferFormProps {
  onSuccess?: (signature: string) => void;
  onError?: (error: Error) => void;
}

interface FormState {
  recipient: string;           // Solana address (base58)
  amount: string;              // SOL amount as string
  feeToken: 'SOL' | 'USDC';    // Fee payment method
  isSubmitting: boolean;
  result: TransferResult | null;
  error: string | null;
}

type TransferResult = {
  signature: string;
  explorerUrl: string;
};

// Validation rules
// - recipient: Valid Solana address (32-44 chars, base58)
// - amount: Positive number, <= wallet balance
// - feeToken: 'SOL' or 'USDC'
```

---

## State Management

### Global State (LazorkitProvider Context)

```
┌─────────────────────────────────────────────────────────────────┐
│                    LazorkitProvider Context                      │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    Connection State                        │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │ isConnecting    │  │ Source: connect() async         │ │  │
│  │  │ boolean         │  │ Transitions: false → true →     │ │  │
│  │  │                 │  │              false              │ │  │
│  │  └─────────────────┘  └─────────────────────────────────┘ │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │ isConnected     │  │ Source: wallet !== null         │ │  │
│  │  │ boolean         │  │ Derived state                   │ │  │
│  │  └─────────────────┘  └─────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Wallet State                           │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │ wallet          │  │ Type: WalletAccount | null      │ │  │
│  │  │                 │  │ Contains: credential, session   │ │  │
│  │  └─────────────────┘  └─────────────────────────────────┘ │  │
│  │  ┌─────────────────┐  ┌─────────────────────────────────┐ │  │
│  │  │ smartWalletPub- │  │ Type: PublicKey | null          │ │  │
│  │  │ key             │  │ Derived: PDA from passkey       │ │  │
│  │  └─────────────────┘  └─────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                     Actions                                │  │
│  │  connect()              → Initiates passkey flow          │  │
│  │  disconnect()           → Clears session                  │  │
│  │  signAndSendTransaction → Signs + submits tx via passkey  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Local Component State

```typescript
// TransferForm local state
interface TransferFormLocalState {
  // Form inputs
  recipient: string;
  amount: string;
  feeToken: 'SOL' | 'USDC';

  // UI state
  isSubmitting: boolean;

  // Result state
  result: { signature: string } | null;
  error: string | null;
}

// State transitions
// IDLE → SUBMITTING → SUCCESS | ERROR → IDLE
```

### Session Persistence

```
┌─────────────────────────────────────────────────────────────┐
│                   Session Lifecycle                          │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  1. New Session (connect())                                 │
│     ┌──────────────┐                                        │
│     │ WebAuthn     │ → Create credential in Secure Enclave  │
│     │ create()     │ → Store session in Portal              │
│     └──────────────┘ → Set local state                      │
│                                                              │
│  2. Page Refresh (auto-reconnect)                           │
│     ┌──────────────┐                                        │
│     │ LazorkitPro- │ → Check localStorage for session       │
│     │ vider mount  │ → Validate with Portal                 │
│     └──────────────┘ → Restore wallet state                 │
│                                                              │
│  3. Session End (disconnect())                              │
│     ┌──────────────┐                                        │
│     │ disconnect() │ → Clear local state                    │
│     │              │ → Clear localStorage                   │
│     └──────────────┘ → Invalidate Portal session            │
│                                                              │
│  4. Session Timeout                                         │
│     ┌──────────────┐                                        │
│     │ Portal       │ → Session expires server-side          │
│     │ validation   │ → Next action triggers re-auth         │
│     └──────────────┘                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Security Model

### Trust Boundaries

```
┌─────────────────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 1: Device Hardware                                        │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ Secure Enclave / TPM                                                │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ • P-256 private key (NEVER leaves enclave)                      │ │ │
│ │ │ • Biometric templates (FaceID/TouchID)                          │ │ │
│ │ │ • Hardware-backed key attestation                               │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 2: Browser Sandbox                                        │
│ ┌─────────────────────────────────────────────────────────────────────┐ │
│ │ WebAuthn API                                                        │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ • Credential ID (public)                                        │ │ │
│ │ │ • Public key (can be exported)                                  │ │ │
│ │ │ • Origin binding (phishing protection)                          │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ │ Application Code                                                    │ │
│ │ ┌─────────────────────────────────────────────────────────────────┐ │ │
│ │ │ • Session tokens (memory only)                                  │ │ │
│ │ │ • Public wallet address                                         │ │ │
│ │ │ • Transaction data (before signing)                             │ │ │
│ │ └─────────────────────────────────────────────────────────────────┘ │ │
│ └─────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ TRUST BOUNDARY 3: Network                                                │
│ ┌───────────────────────────────┐ ┌───────────────────────────────────┐ │
│ │ Encrypted (HTTPS)             │ │ Exposed to Network                │ │
│ │ • API requests to Portal      │ │ • Public key                      │ │
│ │ • API requests to Paymaster   │ │ • Signed transactions             │ │
│ │ • Transaction submissions     │ │ • Wallet addresses                │ │
│ └───────────────────────────────┘ └───────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────┘
```

### Security Properties

| Property | Implementation | Guarantee |
|----------|----------------|-----------|
| **Key Security** | Secure Enclave P-256 | Private key never exposed to JavaScript |
| **Phishing Resistance** | WebAuthn origin binding | Credentials only work on registered domain |
| **Replay Protection** | Challenge-response | Each signature unique per transaction |
| **Transaction Integrity** | ECDSA signatures | Tamper-evident, non-repudiable |
| **Session Security** | Short-lived tokens | Limited blast radius if compromised |
| **No Seed Phrase** | Hardware-bound keys | Nothing to phish, leak, or lose |

### Threat Mitigation

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          THREAT MODEL                                     │
├──────────────────────────────────────────────────────────────────────────┤
│ THREAT                    │ MITIGATION                                    │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Private key theft         │ Key never leaves Secure Enclave              │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Phishing attacks          │ WebAuthn origin binding + biometric required │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Man-in-the-middle         │ HTTPS + challenge-response protocol          │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Transaction tampering     │ User signs exact transaction data            │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Session hijacking         │ Short-lived tokens + device binding          │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Malicious paymaster       │ User reviews & signs before submission       │
├───────────────────────────┼──────────────────────────────────────────────┤
│ Frontend compromise       │ Signature happens in Secure Enclave          │
└───────────────────────────┴──────────────────────────────────────────────┘
```

---

## API Reference

### External Services

| Service | Base URL | Purpose | Rate Limit |
|---------|----------|---------|------------|
| **Solana RPC** | `https://api.devnet.solana.com` | Blockchain queries, tx submission | 100 req/10s |
| **LazorKit Portal** | `https://portal.lazor.sh` | Passkey registration, session mgmt | - |
| **Paymaster** | `https://kora.devnet.lazorkit.com` | Fee sponsorship, tx wrapping | - |
| **Explorer** | `https://explorer.solana.com` | Transaction viewing | N/A |

### SDK Methods

#### `useWallet()` Hook

```typescript
function useWallet(): {
  // State
  wallet: WalletAccount | null;
  isConnected: boolean;
  isConnecting: boolean;
  smartWalletPubkey: PublicKey | null;

  // Actions
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (params: TransactionParams) => Promise<string>;
}

interface TransactionParams {
  instructions: TransactionInstruction[];
  transactionOptions?: {
    feeToken?: 'SOL' | 'USDC';
  };
}

// Returns: Transaction signature (base58 string)
```

#### Connection Methods

```typescript
// Connect - triggers WebAuthn flow
await connect();
// - Opens biometric prompt
// - Creates/retrieves passkey
// - Establishes session
// - Throws on cancel or error

// Disconnect - clears session
await disconnect();
// - Clears local state
// - Invalidates session token
```

#### Transaction Signing

```typescript
import { SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Build instruction
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: new PublicKey(recipientAddress),
  lamports: amount * LAMPORTS_PER_SOL,
});

// Sign and send (gasless with USDC)
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: 'USDC', // Paymaster sponsors fees
  },
});

// signature: "5xGp...3nRq" (base58)
```

---

## Error Handling Strategy

### Error Classification

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            ERROR TAXONOMY                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ RECOVERABLE ERRORS (User can retry)                                     ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ NetworkError        │ Connection failed, timeout                        ││
│  │                     │ → Show retry button, check connection             ││
│  ├─────────────────────┼───────────────────────────────────────────────────┤│
│  │ TransactionFailed   │ Insufficient funds, invalid recipient             ││
│  │                     │ → Show specific error, suggest fix                ││
│  ├─────────────────────┼───────────────────────────────────────────────────┤│
│  │ PaymasterError      │ Fee sponsorship failed                            ││
│  │                     │ → Suggest using SOL for fees instead              ││
│  ├─────────────────────┼───────────────────────────────────────────────────┤│
│  │ RPCError            │ Solana RPC issues                                 ││
│  │                     │ → Retry with exponential backoff                  ││
│  └─────────────────────┴───────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ USER-INITIATED CANCELLATION (Silent handling)                           ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ UserCancelled       │ User dismissed biometric prompt                   ││
│  │                     │ → Reset UI state, no error shown                  ││
│  └─────────────────────┴───────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ BLOCKING ERRORS (Requires user action/different approach)               ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ PasskeyNotSupported │ Browser/device doesn't support WebAuthn           ││
│  │                     │ → Show compatibility message, suggest browser     ││
│  ├─────────────────────┼───────────────────────────────────────────────────┤│
│  │ SessionExpired      │ Portal session timed out                          ││
│  │                     │ → Prompt reconnection                             ││
│  └─────────────────────┴───────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Error Handling Implementation

```typescript
// Error boundary pattern
async function handleTransfer() {
  try {
    setIsSubmitting(true);
    setError(null);

    const signature = await signAndSendTransaction({
      instructions: [transferInstruction],
      transactionOptions: { feeToken },
    });

    setResult({ signature });

  } catch (err) {
    if (err.name === 'UserCancelled') {
      // Silent - user cancelled biometric
      return;
    }

    if (err.message?.includes('insufficient')) {
      setError('Insufficient balance. Please add funds to your wallet.');
    } else if (err.message?.includes('paymaster')) {
      setError('Fee sponsorship unavailable. Try using SOL for fees.');
    } else if (err.name === 'NetworkError') {
      setError('Network error. Please check connection and retry.');
    } else {
      setError(`Transaction failed: ${err.message}`);
    }

  } finally {
    setIsSubmitting(false);
  }
}
```

---

## Observability & Monitoring

### Logging Strategy

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           LOGGING LEVELS                                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LEVEL       WHEN TO USE                           EXAMPLE                   │
│  ─────       ───────────                           ───────                   │
│                                                                              │
│  ERROR       Unrecoverable failures                Transaction submission    │
│              User-impacting issues                 failed with 500           │
│                                                                              │
│  WARN        Recoverable issues                    Paymaster rate limited,   │
│              Degraded functionality                falling back to SOL       │
│                                                                              │
│  INFO        Business events                       User connected wallet,    │
│              State transitions                     Transfer completed        │
│                                                                              │
│  DEBUG       Development diagnostics               Request/response payloads │
│              (disabled in production)              State snapshots           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Key Metrics to Track

| Metric | Type | Description | Alert Threshold |
|--------|------|-------------|-----------------|
| `wallet.connect.duration` | Histogram | Time from click to connected | > 10s |
| `wallet.connect.success` | Counter | Successful connections | - |
| `wallet.connect.failure` | Counter | Failed connections | > 10% of attempts |
| `tx.submit.duration` | Histogram | Transaction submission time | > 5s |
| `tx.confirm.duration` | Histogram | Transaction confirmation time | > 30s |
| `tx.gasless.usage` | Counter | Gasless transactions used | - |
| `tx.gasless.fallback` | Counter | Fallbacks to SOL fees | > 20% |
| `error.rate` | Gauge | Errors per minute | > 5/min |

### Error Tracking Integration

```typescript
// Recommended: Sentry or similar error tracking
// Example integration pattern (optional for demo)

interface ErrorContext {
  userId?: string;           // Anonymized wallet address hash
  walletConnected: boolean;
  lastAction: string;
  browserInfo: string;
  timestamp: number;
}

// Log structure for errors
{
  level: 'error',
  message: 'Transaction failed',
  error: {
    name: 'PaymasterError',
    message: 'Rate limit exceeded',
    stack: '...'
  },
  context: {
    action: 'gasless_transfer',
    feeToken: 'USDC',
    amount: 0.1
  },
  timestamp: '2024-01-15T10:30:00Z'
}
```

### Health Check Endpoints

| Endpoint | Check | Expected Response |
|----------|-------|-------------------|
| `/` (homepage) | App renders | 200 OK, HTML content |
| Solana RPC | `getHealth()` | "ok" |
| Portal Service | Implicit via SDK | Connection succeeds |
| Paymaster | Implicit via SDK | Fee quote returns |

---

## Performance Considerations

### Optimization Strategies

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       PERFORMANCE OPTIMIZATIONS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ INITIAL LOAD                                                            ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ • Dynamic imports for LazorKit SDK (code splitting)                     ││
│  │ • Lazy load non-critical components                                     ││
│  │ • Buffer polyfill loaded only on client                                 ││
│  │ • Minimal CSS with Tailwind (tree-shaking)                              ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ RUNTIME                                                                 ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ • Connection state cached in React context                              ││
│  │ • Balance fetched on-demand, cached locally                             ││
│  │ • Debounced input validation                                            ││
│  │ • Optimistic UI updates                                                 ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────────┐│
│  │ NETWORK                                                                 ││
│  ├─────────────────────────────────────────────────────────────────────────┤│
│  │ • Single RPC call for balance checks                                    ││
│  │ • Batch transaction building                                            ││
│  │ • WebSocket subscriptions for tx confirmation (future)                  ││
│  └─────────────────────────────────────────────────────────────────────────┘│
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Critical Path Analysis

```
User clicks "Transfer" → Signature returned

┌────────────────────────────────────────────────────────────────────────────┐
│ CRITICAL PATH (Target: < 5 seconds total)                                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│ 1. Build instruction          ~10ms   │ Local computation                  │
│ 2. Paymaster wrapping        ~200ms   │ Network (LazorKit)                 │
│ 3. Biometric prompt        ~1-3000ms  │ User interaction (variable)        │
│ 4. Sign in Secure Enclave     ~50ms   │ Hardware operation                 │
│ 5. Submit to Paymaster       ~100ms   │ Network (LazorKit)                 │
│ 6. Relay to Solana           ~200ms   │ Network (Solana RPC)               │
│ 7. Confirmation polling      ~400ms   │ Network (Solana RPC)               │
│                                                                             │
│ Total (excl. biometric): ~960ms                                            │
│ Total (incl. biometric): ~2-4 seconds                                      │
│                                                                             │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Testing Architecture

### Test Layers

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TEST PYRAMID                                       │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│                          ┌─────────────────┐                                │
│                          │    E2E Tests    │  ← Playwright/Cypress          │
│                          │   (Critical     │    Full user flows             │
│                          │    Paths)       │                                │
│                          └────────┬────────┘                                │
│                                   │                                          │
│                    ┌──────────────┴──────────────┐                          │
│                    │     Integration Tests       │  ← Vitest + MSW          │
│                    │  (Component + API mocks)    │    Hook behavior         │
│                    └──────────────┬──────────────┘                          │
│                                   │                                          │
│         ┌─────────────────────────┴─────────────────────────┐               │
│         │              Unit Tests                           │  ← Vitest     │
│         │  (Utils, validation, pure functions)              │    Fast       │
│         └───────────────────────────────────────────────────┘               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Test Scenarios

```typescript
// Unit Tests
describe('TransferForm validation', () => {
  test('validates Solana address format');
  test('rejects negative amounts');
  test('rejects amounts exceeding balance');
  test('handles empty inputs gracefully');
});

// Integration Tests
describe('useWallet hook', () => {
  test('connect() updates isConnected state');
  test('disconnect() clears wallet state');
  test('signAndSendTransaction returns signature');
  test('handles paymaster errors gracefully');
});

// E2E Tests
describe('Gasless Transfer Flow', () => {
  test('complete transfer from form to explorer link');
  test('shows error on insufficient balance');
  test('handles user cancellation');
});
```

---

## Edge Cases & Failure Modes

### Edge Case Matrix

| Scenario | Expected Behavior | Implementation |
|----------|-------------------|----------------|
| **No biometric hardware** | Show unsupported message | Check `PublicKeyCredential` API |
| **User cancels biometric** | Silent reset to disconnected | Catch `UserCancelled` error |
| **Session expired mid-tx** | Re-prompt for authentication | Detect 401, call `connect()` |
| **Zero balance transfer** | Allow (0 SOL transfer valid) | No minimum validation |
| **Self-transfer** | Allow (valid on Solana) | No recipient === sender check |
| **Invalid address paste** | Disable submit, show error | Real-time validation |
| **Paymaster down** | Fallback to SOL fees | Try/catch with suggestion |
| **RPC rate limited** | Retry with backoff | Exponential backoff |
| **Devnet congestion** | Longer confirmation | Timeout with retry |
| **Page refresh mid-tx** | Tx may complete, show unknown | Check tx status on load |

### Failure Recovery Flows

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       FAILURE RECOVERY PATTERNS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  SCENARIO: Transaction submitted but confirmation fails                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Save signature locally (localStorage)                              │  │
│  │ 2. Show "Transaction may have succeeded" message                      │  │
│  │ 3. Provide explorer link for manual check                             │  │
│  │ 4. On next page load, check status and update                         │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  SCENARIO: Paymaster rejects transaction                                     │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Parse rejection reason                                             │  │
│  │ 2. If "daily limit exceeded": suggest trying tomorrow                 │  │
│  │ 3. If "invalid token": fall back to SOL fees                          │  │
│  │ 4. If "transaction invalid": show validation errors                   │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
│  SCENARIO: Network error during connect                                      │
│  ┌───────────────────────────────────────────────────────────────────────┐  │
│  │ 1. Retry up to 3 times with exponential backoff                       │  │
│  │ 2. Show "Connection issues" after retries exhausted                   │  │
│  │ 3. Provide manual retry button                                        │  │
│  │ 4. Check navigator.onLine for offline detection                       │  │
│  └───────────────────────────────────────────────────────────────────────┘  │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Dependencies

### Package Dependencies

```
package.json
├── Production Dependencies
│   ├── @lazorkit/wallet        ^x.x.x   # Core SDK for passkey wallets
│   ├── @coral-xyz/anchor       ^0.29.0  # Solana framework
│   ├── @solana/web3.js         ^1.87.0  # Solana JavaScript SDK
│   ├── buffer                  ^6.0.3   # Node.js Buffer polyfill
│   ├── next                    ^14.0.0  # React framework
│   ├── react                   ^18.2.0  # UI library
│   └── react-dom               ^18.2.0  # React DOM bindings
│
├── Development Dependencies
│   ├── typescript              ^5.0.0   # Type safety
│   ├── tailwindcss             ^3.3.0   # Utility CSS
│   ├── postcss                 ^8.4.0   # CSS processing
│   ├── autoprefixer            ^10.4.0  # CSS vendor prefixes
│   ├── eslint                  ^8.0.0   # Code linting
│   └── @types/*                         # TypeScript definitions
│
└── Polyfills (configured in next.config.js)
    └── buffer → Buffer (webpack fallback)
```

### Dependency Graph

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DEPENDENCY RELATIONSHIPS                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  @lazorkit/wallet                                                           │
│  ├── @solana/web3.js (peer)                                                 │
│  ├── @coral-xyz/anchor (peer)                                               │
│  └── WebAuthn browser APIs (runtime)                                        │
│                                                                              │
│  @solana/web3.js                                                            │
│  ├── buffer (requires polyfill in browser)                                  │
│  ├── @solana/buffer-layout                                                  │
│  └── bs58 (base58 encoding)                                                 │
│                                                                              │
│  next                                                                       │
│  ├── react                                                                  │
│  ├── react-dom                                                              │
│  └── webpack (build tooling)                                                │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| WebAuthn | 67+ | 60+ | 13+ | 18+ |
| Passkeys | 108+ | 122+ | 16+ | 108+ |
| Secure Enclave | Platform | Platform | Platform | Platform |

---

## Scalability & Future Considerations

### Current Limitations (Demo Scope)

| Aspect | Current State | Production Consideration |
|--------|---------------|--------------------------|
| **Users** | Single user per session | Multi-account support |
| **Network** | Devnet only | Mainnet configuration |
| **RPC** | Public endpoint | Dedicated RPC (Helius, Quicknode) |
| **Caching** | None | Redis for session/balance cache |
| **CDN** | Vercel default | Custom CDN for global distribution |

### Scaling Path

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SCALING CONSIDERATIONS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  DEMO (Current)              →    PRODUCTION                                │
│  ─────────────                    ──────────                                │
│                                                                              │
│  Public RPC                  →    Dedicated RPC provider                    │
│  (rate limited)                   (Helius, Quicknode, Triton)               │
│                                                                              │
│  Single region               →    Multi-region deployment                   │
│  (Vercel auto)                    (Edge functions, regional DBs)            │
│                                                                              │
│  In-memory state             →    Distributed cache                         │
│  (React context)                  (Redis, Upstash)                          │
│                                                                              │
│  No analytics                →    Full observability stack                  │
│                                   (Datadog, Sentry, Mixpanel)               │
│                                                                              │
│  Manual testing              →    Automated E2E testing                     │
│                                   (Playwright, Cypress)                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Version Compatibility Matrix

| Component | Minimum | Recommended | Maximum Tested |
|-----------|---------|-------------|----------------|
| Node.js | 20.0.0 | 22.x LTS | 23.x |
| Next.js | 14.0.0 | 14.x latest | 15.x |
| @lazorkit/wallet | Check docs | Latest | - |
| @solana/web3.js | 1.87.0 | 1.9x.x | 2.x (breaking) |
| TypeScript | 5.0.0 | 5.x latest | - |

### Future Enhancements Roadmap

| Enhancement | Priority | Complexity | Description |
|-------------|----------|------------|-------------|
| Multi-wallet support | High | Medium | Support multiple passkeys per user |
| Token transfers | High | Low | SPL token support beyond SOL |
| Transaction history | Medium | Medium | Show past transactions |
| Address book | Medium | Low | Save frequent recipients |
| Mainnet support | High | Low | Configuration switch |
| Mobile app (PWA) | Low | High | Progressive Web App |

---

## Compliance & Data Privacy

### Data Handling

| Data Type | Storage Location | Retention | Notes |
|-----------|------------------|-----------|-------|
| **Private Key** | Secure Enclave (device) | Permanent | Never leaves device |
| **Public Key** | Portal Service | Session | Registered with domain |
| **Credential ID** | Browser + Portal | Permanent | Links device to wallet |
| **Session Token** | Memory + localStorage | Session | Cleared on disconnect |
| **Wallet Address** | Blockchain (public) | Permanent | Publicly visible |
| **Transaction Data** | Blockchain (public) | Permanent | Immutable record |

### Privacy Principles

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PRIVACY BY DESIGN                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. DATA MINIMIZATION                                                       │
│     • Only collect what's necessary for functionality                       │
│     • No tracking pixels, analytics cookies, or fingerprinting              │
│     • Wallet address is pseudonymous (not linked to identity)               │
│                                                                              │
│  2. USER CONTROL                                                            │
│     • User initiates all actions (connect, transfer, disconnect)            │
│     • Clear disconnect removes local session data                           │
│     • No background data collection                                         │
│                                                                              │
│  3. TRANSPARENCY                                                            │
│     • All transactions visible on public blockchain                         │
│     • No hidden data flows                                                  │
│     • Open source code (auditable)                                          │
│                                                                              │
│  4. SECURITY                                                                │
│     • Private keys never transmitted                                        │
│     • HTTPS for all communications                                          │
│     • Hardware-backed key storage                                           │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Regulatory Considerations

| Regulation | Applicability | Compliance Notes |
|------------|---------------|------------------|
| **GDPR** | EU users | Pseudonymous data; no PII collected |
| **CCPA** | California users | No sale of personal data |
| **WebAuthn Standard** | All users | W3C compliant implementation |
| **FIDO2** | All users | Alliance-certified authenticators |

### License & Attribution

| Component | License | Attribution Required |
|-----------|---------|----------------------|
| LazorKit SDK | Check official | Per SDK license |
| Next.js | MIT | No |
| Solana Web3.js | Apache 2.0 | No |
| Tailwind CSS | MIT | No |

---

## Revision History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | Initial | Base architecture |
| 1.1 | Enhanced | Added sequence diagrams, security model, edge cases |
| 1.2 | Industry Standard | Added ADR, observability, scalability, compliance sections |
