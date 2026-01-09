# LazorKit SDK Integration Example - Implementation Checklist

> **Goal:** Create a practical, easy-to-follow code example that helps other devs integrate LazorKit SDK fast.

## Table of Contents
- [Overview](#overview)
- [Pre-Implementation Requirements](#pre-implementation-requirements)
- [Phase 1: Project Foundation](#phase-1-project-foundation)
- [Phase 2: Core Infrastructure](#phase-2-core-infrastructure)
- [Phase 3: Passkey Authentication](#phase-3-passkey-authentication)
- [Phase 4: Gasless Transactions](#phase-4-gasless-transactions)
- [Phase 5: User Experience](#phase-5-user-experience)
- [Phase 6: Documentation](#phase-6-documentation)
- [Phase 7: Quality Assurance](#phase-7-quality-assurance)
- [Phase 8: Deployment](#phase-8-deployment)
- [Phase 9: Content Creation](#phase-9-content-creation)
- [Submission Checklist](#submission-checklist)
- [Risk Register](#risk-register)
- [Quick Reference](#quick-reference)

---

## Overview

### Progress Tracking Legend

| Symbol | Meaning |
|--------|---------|
| `[ ]` | Not started |
| `[~]` | In progress |
| `[x]` | Completed |
| `[!]` | Blocked / Needs attention |
| `[?]` | Needs clarification |

### Priority Levels

| Priority | Description |
|----------|-------------|
| **P0** | Critical - Blocks everything |
| **P1** | High - Core functionality |
| **P2** | Medium - Important features |
| **P3** | Low - Nice to have |

### Definition of Ready (DoR)

Before starting any task, ensure:

| Criteria | Description |
|----------|-------------|
| **Requirements Clear** | Task description is unambiguous |
| **Dependencies Met** | All blocking tasks completed |
| **Acceptance Criteria Defined** | Know what "done" looks like |
| **Resources Available** | API docs, design specs accessible |
| **Environment Ready** | Dev environment matches requirements |

### Definition of Done (DoD)

A task is complete when:

| Criteria | Description |
|----------|-------------|
| **Code Complete** | Implementation finished |
| **Self-Tested** | Manually verified functionality |
| **Acceptance Criteria Met** | All criteria checked |
| **No Console Errors** | Clean browser console |
| **TypeScript Clean** | No type errors |
| **Lint Passing** | ESLint shows no errors |

### Phase Dependencies

```
Phase 1 ─────► Phase 2 ─────► Phase 3 ─────► Phase 4
   │              │              │              │
   │              │              │              ▼
   │              │              │         Phase 5
   │              │              │              │
   │              │              ▼              ▼
   │              │         Phase 6 ◄──────────┘
   │              │              │
   │              ▼              ▼
   │         Phase 7 ◄──────────┘
   │              │
   ▼              ▼
Phase 8 ◄────────┘
   │
   ▼
Phase 9
```

---

## Pre-Implementation Requirements

### Development Environment
- [ ] **Node.js 20+** installed (`node --version`)
- [ ] **pnpm 8+** installed (`pnpm --version`)
- [ ] **Git** configured with SSH/HTTPS
- [ ] **VS Code** or preferred editor
- [ ] **WebAuthn-compatible browser** (Chrome 108+, Safari 16+, Firefox 122+)
- [ ] **Device with biometrics** (FaceID, TouchID, Windows Hello, or security key)

### External Accounts
- [ ] **GitHub account** for repository
- [ ] **Vercel account** for deployment (free tier)
- [ ] **Solana Devnet faucet** access (https://faucet.solana.com)

### Documentation Review
- [ ] Read [LazorKit Documentation](https://docs.lazorkit.com/)
- [ ] Review [Contest Requirements](https://earn.superteam.fun/listing/integrate-passkey-technology-with-lazorkit-to-10x-solana-ux)
- [ ] Understand WebAuthn basics
- [ ] Review project ARCHITECTURE.md

---

## Phase 1: Project Foundation

> **Goal:** Establish project structure and verify development environment works
>
> **Blocking:** All subsequent phases
>
> **Testing Gate:** App runs with `npm run dev` without errors

### 1.1 Initialize Next.js Project [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create Next.js project with TypeScript | [ ] | `npx create-next-app@latest` succeeds | Pre-reqs |
| Enable App Router | [ ] | `app/` directory structure present | 1.1.1 |
| Configure Tailwind CSS | [ ] | Tailwind classes render correctly | 1.1.1 |
| Verify development server | [ ] | `pnpm dev` shows page at localhost:3000 | 1.1.3 |

```bash
# Commands
pnpm create next-app lazorkit-example --typescript --tailwind --app --src-dir=false
cd lazorkit-example
pnpm dev
```

### 1.2 Install Dependencies [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Install @lazorkit/wallet | [ ] | Package in node_modules | 1.1 |
| Install @coral-xyz/anchor | [ ] | Package in node_modules | 1.1 |
| Install @solana/web3.js | [ ] | Package in node_modules | 1.1 |
| Install buffer polyfill | [ ] | Package in node_modules | 1.1 |
| Verify no peer dependency conflicts | [ ] | `pnpm ls` shows no errors | 1.2.1-4 |

```bash
# Commands
pnpm add @lazorkit/wallet @coral-xyz/anchor @solana/web3.js buffer
pnpm ls # Check for errors
```

### 1.3 Configure Environment [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `.env.local.example` | [ ] | File exists with template | 1.1 |
| Create `.env.local` | [ ] | File exists with actual values | 1.3.1 |
| Add `.env.local` to `.gitignore` | [ ] | File not tracked by git | 1.3.2 |
| Verify env vars load | [ ] | `process.env.NEXT_PUBLIC_*` accessible | 1.3.2 |

```env
# .env.local
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

### 1.4 Configure Polyfills [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Update next.config.js with webpack fallback | [ ] | Buffer polyfill configured | 1.2 |
| Add Buffer global in layout.tsx | [ ] | `window.Buffer` available | 1.4.1 |
| Verify no "Buffer not defined" errors | [ ] | Console clean on page load | 1.4.2 |

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      buffer: require.resolve('buffer/'),
    };
    return config;
  },
};
module.exports = nextConfig;
```

### Phase 1 Completion Gate

- [ ] `pnpm dev` starts without errors
- [ ] Page renders at localhost:3000
- [ ] No console errors related to polyfills
- [ ] Environment variables accessible

---

## Phase 2: Core Infrastructure

> **Goal:** Set up provider context and shared components
>
> **Blocking:** Phases 3, 4, 5
>
> **Testing Gate:** LazorkitProvider wraps app, useWallet() hook accessible

### 2.1 Constants & Configuration [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `lib/constants.ts` | [ ] | File exports all config values | Phase 1 |
| Export RPC_URL | [ ] | Matches env variable | 2.1.1 |
| Export PORTAL_URL | [ ] | Matches env variable | 2.1.1 |
| Export PAYMASTER_URL | [ ] | Matches env variable | 2.1.1 |
| Export EXPLORER_BASE_URL | [ ] | Points to Solana devnet explorer | 2.1.1 |
| Export helper functions | [ ] | `getExplorerUrl(signature)` works | 2.1.4 |

```typescript
// lib/constants.ts
export const RPC_URL = process.env.NEXT_PUBLIC_RPC_URL!;
export const PORTAL_URL = process.env.NEXT_PUBLIC_PORTAL_URL!;
export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL!;
export const EXPLORER_BASE_URL = 'https://explorer.solana.com';

export const getExplorerUrl = (signature: string) =>
  `${EXPLORER_BASE_URL}/tx/${signature}?cluster=devnet`;
```

### 2.2 LazorkitProvider Setup [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create provider wrapper in layout.tsx | [ ] | App wrapped in provider | 2.1 |
| Add "use client" directive | [ ] | No SSR errors | 2.2.1 |
| Configure rpcUrl prop | [ ] | Uses constant | 2.2.1 |
| Configure portalUrl prop | [ ] | Uses constant | 2.2.1 |
| Configure paymasterConfig prop | [ ] | Uses constant | 2.2.1 |
| Handle hydration (Buffer polyfill) | [ ] | No hydration mismatch | 2.2.1 |
| Test: useWallet() returns object | [ ] | Hook accessible in child | 2.2.1-6 |

### 2.3 Navbar Component [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `components/Navbar.tsx` | [ ] | File exists | Phase 1 |
| Add logo/brand section | [ ] | "LazorKit Demo" visible | 2.3.1 |
| Add Home link (/) | [ ] | Navigates correctly | 2.3.1 |
| Add Passkey Login link | [ ] | Navigates to /passkey-login | 2.3.1 |
| Add Gasless Transfer link | [ ] | Navigates to /gasless-transfer | 2.3.1 |
| Add ConnectButton slot | [ ] | Button renders in navbar | 2.4 |
| Style with Tailwind | [ ] | Responsive, clean design | 2.3.1-6 |
| Active link highlighting | [ ] | Current page link styled | 2.3.3-5 |

### 2.4 ConnectButton Component [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `components/ConnectButton.tsx` | [ ] | File exists | 2.2 |
| Import useWallet() hook | [ ] | Hook accessible | 2.4.1 |
| Handle disconnected state | [ ] | Shows "Connect Wallet" | 2.4.2 |
| Handle connecting state | [ ] | Shows "Connecting...", disabled | 2.4.2 |
| Handle connected state | [ ] | Shows truncated address | 2.4.2 |
| Implement connect() on click | [ ] | Triggers passkey flow | 2.4.3-5 |
| Implement disconnect() on click | [ ] | Clears session | 2.4.5 |
| Add loading spinner | [ ] | Visual feedback during connect | 2.4.4 |
| Style with Tailwind | [ ] | Matches design system | 2.4.1-8 |

### 2.5 WalletInfo Component [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `components/WalletInfo.tsx` | [ ] | File exists | 2.2 |
| Display smart wallet address | [ ] | Full address visible | 2.5.1 |
| Truncate address for display | [ ] | "7xKp...3mNq" format | 2.5.2 |
| Add copy to clipboard | [ ] | Click copies, shows feedback | 2.5.2 |
| Add Solana Explorer link | [ ] | Opens in new tab | 2.5.2 |
| Style with Tailwind | [ ] | Card-like appearance | 2.5.1-5 |

### Phase 2 Completion Gate

- [ ] LazorkitProvider wraps entire app
- [ ] Navbar renders with all links
- [ ] ConnectButton shows correct state
- [ ] useWallet() hook returns expected shape
- [ ] No console errors

---

## Phase 3: Passkey Authentication

> **Goal:** Complete passkey creation and login flow
>
> **Blocking:** Phase 4 (transactions require wallet)
>
> **Testing Gate:** User can create passkey, reconnect on refresh, disconnect

### 3.1 Passkey Login Page [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `app/passkey-login/page.tsx` | [ ] | Page renders at /passkey-login | Phase 2 |
| Add "use client" directive | [ ] | Client component | 3.1.1 |
| Add page title | [ ] | "Tutorial 1: Passkey Login" | 3.1.1 |
| Add description text | [ ] | Explains what passkeys are | 3.1.3 |
| Import ConnectButton | [ ] | Button renders | 3.1.1 |
| Import WalletInfo | [ ] | Info renders when connected | 3.1.1 |

### 3.2 Conditional Rendering [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Show ConnectButton when disconnected | [ ] | Button visible | 3.1 |
| Show WalletInfo when connected | [ ] | Info visible after connect | 3.2.1 |
| Add smooth transition | [ ] | No jarring UI changes | 3.2.2 |

### 3.3 Passkey Flow Testing [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Test: New passkey creation | [ ] | Biometric prompt appears | 3.2 |
| Test: Passkey stores in device | [ ] | Browser saves credential | 3.3.1 |
| Test: Smart wallet address derived | [ ] | Address displayed after connect | 3.3.2 |
| Test: Session persists on refresh | [ ] | Still connected after F5 | 3.3.3 |
| Test: Disconnect clears session | [ ] | Returns to disconnected state | 3.3.4 |
| Test: Reconnect with existing passkey | [ ] | Uses stored credential | 3.3.5 |

### 3.4 Instructions Panel [P2]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Add step-by-step instructions | [ ] | Numbered list visible | 3.1 |
| Explain biometric requirement | [ ] | User knows what to expect | 3.4.1 |
| Add troubleshooting tips | [ ] | Common issues addressed | 3.4.2 |

### Phase 3 Completion Gate

- [ ] New user can create passkey via biometrics
- [ ] Returning user can login with existing passkey
- [ ] Session persists across page refresh
- [ ] Disconnect fully clears session
- [ ] Wallet address displays correctly

---

## Phase 4: Gasless Transactions

> **Goal:** Send SOL without paying gas fees
>
> **Blocking:** Phase 5 (UX polish)
>
> **Testing Gate:** User can send SOL with USDC fee token, tx confirmed on Devnet

### 4.1 TransferForm Component [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `components/TransferForm.tsx` | [ ] | File exists | Phase 3 |
| Add recipient input field | [ ] | Text input for address | 4.1.1 |
| Add amount input field | [ ] | Number input for SOL | 4.1.1 |
| Add fee token selector | [ ] | SOL / USDC toggle | 4.1.1 |
| Add submit button | [ ] | "Send" button | 4.1.1 |
| Style with Tailwind | [ ] | Form looks clean | 4.1.1-5 |

### 4.2 Input Validation [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Validate recipient address format | [ ] | Base58, 32-44 chars | 4.1.2 |
| Validate amount is positive | [ ] | Rejects 0, negative | 4.1.3 |
| Validate amount <= balance | [ ] | Shows "insufficient" if over | 4.1.3 |
| Show validation errors | [ ] | Inline error messages | 4.2.1-3 |
| Disable submit if invalid | [ ] | Button disabled + grayed | 4.2.4 |

### 4.3 Transaction Logic [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Import SystemProgram | [ ] | From @solana/web3.js | 4.1 |
| Build transfer instruction | [ ] | Correct params | 4.3.1 |
| Get signAndSendTransaction | [ ] | From useWallet() | 4.3.1 |
| Pass feeToken option | [ ] | 'USDC' for gasless | 4.3.3 |
| Call transaction on submit | [ ] | Awaits result | 4.3.4 |
| Handle loading state | [ ] | Button disabled, spinner | 4.3.5 |

### 4.4 Result Display [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Show loading spinner during tx | [ ] | Visual feedback | 4.3.6 |
| Display signature on success | [ ] | Base58 string shown | 4.3.5 |
| Add Explorer link | [ ] | Opens tx on explorer | 4.4.2 |
| Show error on failure | [ ] | User-friendly message | 4.3.5 |
| Add retry button on error | [ ] | Allows resubmission | 4.4.4 |
| Reset form after success | [ ] | Fields cleared | 4.4.2 |

### 4.5 Gasless Transfer Page [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `app/gasless-transfer/page.tsx` | [ ] | Page renders | Phase 2 |
| Add "use client" directive | [ ] | Client component | 4.5.1 |
| Add page title | [ ] | "Tutorial 2: Gasless Transfer" | 4.5.1 |
| Check wallet connection | [ ] | Guard if not connected | 4.5.1 |
| Show "Please connect" if disconnected | [ ] | Prompt to connect | 4.5.4 |
| Show WalletInfo when connected | [ ] | Balance visible | 4.5.4 |
| Show TransferForm when connected | [ ] | Form usable | 4.5.4 |

### 4.6 End-to-End Transaction Test [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Get test SOL from faucet | [ ] | Wallet has devnet SOL | 4.5 |
| Test: Transfer with USDC fees | [ ] | Tx succeeds without SOL gas | 4.4, 4.6.1 |
| Test: Verify on Solana Explorer | [ ] | Tx visible on chain | 4.6.2 |
| Test: Balance updates after tx | [ ] | Reflects new balance | 4.6.3 |
| Test: Error handling | [ ] | Invalid inputs show errors | 4.4.4 |

### Phase 4 Completion Gate

- [ ] Transfer form validates all inputs
- [ ] Transaction builds correctly
- [ ] Gasless tx with USDC fees works
- [ ] Success shows signature + explorer link
- [ ] Errors handled gracefully

---

## Phase 5: User Experience

> **Goal:** Polish UI, add balance display, improve feedback
>
> **Blocking:** None (can run in parallel with Phase 6)
>
> **Testing Gate:** Smooth UX, balance displays, all states handled

### 5.1 Homepage [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Update `app/page.tsx` | [ ] | Homepage styled | Phase 2 |
| Add hero section | [ ] | Project title prominent | 5.1.1 |
| Add feature cards | [ ] | 2 cards for tutorials | 5.1.1 |
| Link cards to tutorial pages | [ ] | Navigation works | 5.1.3 |
| Add "What is LazorKit?" section | [ ] | Brief explanation | 5.1.1 |
| Add "How it works" section | [ ] | 3-step process | 5.1.1 |

### 5.2 Balance Hook (Optional) [P2]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `hooks/useBalance.ts` | [ ] | Hook file exists | Phase 2 |
| Fetch SOL balance via RPC | [ ] | Returns lamports | 5.2.1 |
| Convert to SOL display | [ ] | Human-readable format | 5.2.2 |
| Add loading state | [ ] | Returns isLoading | 5.2.2 |
| Auto-refresh on wallet change | [ ] | Updates when address changes | 5.2.3 |
| Refresh after transaction | [ ] | Balance updates post-tx | 5.2.4 |

### 5.3 UI Polish [P2]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Add loading skeletons | [ ] | Placeholder during loads | Phase 4 |
| Add toast notifications | [ ] | Success/error feedback | Phase 4 |
| Improve form accessibility | [ ] | Labels, ARIA attributes | 4.1 |
| Add keyboard navigation | [ ] | Tab through form works | 5.3.3 |
| Mobile responsive design | [ ] | Works on small screens | 5.1 |

### Phase 5 Completion Gate

- [ ] Homepage provides clear navigation
- [ ] Balance displays when connected
- [ ] UI responds well to all screen sizes
- [ ] Accessible (keyboard nav, ARIA)

---

## Phase 6: Documentation

> **Goal:** Comprehensive documentation for submission
>
> **Blocking:** Phase 8 (deployment needs README)
>
> **Testing Gate:** Docs enable new developer to run project

### 6.1 README.md [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Project overview | [ ] | Clear description | Phase 4 |
| Features list | [ ] | Bullet points | 6.1.1 |
| Tech stack table | [ ] | All technologies listed | 6.1.1 |
| Prerequisites | [ ] | Node, npm, browser reqs | 6.1.1 |
| Installation instructions | [ ] | Step-by-step clone/install | 6.1.4 |
| Environment setup | [ ] | .env.local instructions | 6.1.5 |
| Running locally | [ ] | npm run dev command | 6.1.6 |
| Project structure | [ ] | Directory tree | 6.1.1 |
| API reference | [ ] | SDK methods explained | 6.1.1 |
| Deployment guide | [ ] | Vercel instructions | Phase 8 |
| Troubleshooting | [ ] | Common issues + fixes | 6.1.1 |
| Resources section | [ ] | Links to docs, repos | 6.1.1 |

### 6.2 Tutorial 1 Documentation [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `docs/01-passkey-login.md` | [ ] | File exists | Phase 3 |
| Introduction section | [ ] | What we're building | 6.2.1 |
| Prerequisites | [ ] | What user needs | 6.2.2 |
| Step-by-step implementation | [ ] | Code snippets | 6.2.2 |
| Code explanations | [ ] | What each part does | 6.2.4 |
| Expected results | [ ] | Screenshots/descriptions | 6.2.4 |
| Common issues | [ ] | Troubleshooting | 6.2.5 |

### 6.3 Tutorial 2 Documentation [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `docs/02-gasless-transfer.md` | [ ] | File exists | Phase 4 |
| Introduction section | [ ] | What we're building | 6.3.1 |
| Prerequisites | [ ] | Completed Tutorial 1 | 6.3.2 |
| Step-by-step implementation | [ ] | Code snippets | 6.3.2 |
| Code explanations | [ ] | Transaction logic | 6.3.4 |
| Expected results | [ ] | Screenshots/descriptions | 6.3.4 |
| Common issues | [ ] | Paymaster errors, etc. | 6.3.5 |

### Phase 6 Completion Gate

- [ ] README enables project setup from scratch
- [ ] Tutorial docs are step-by-step
- [ ] Code snippets are accurate
- [ ] Screenshots included

---

## Phase 7: Quality Assurance

> **Goal:** Verify all functionality, fix bugs
>
> **Blocking:** Phase 8 (must pass QA before deploy)
>
> **Testing Gate:** All test cases pass, no console errors

### 7.0 Security Review Gate [P0]

Before proceeding with testing, complete security checklist:

| Check | Status | Description |
|-------|--------|-------------|
| No secrets in code | [ ] | Grep for API keys, private keys, passwords |
| Environment variables secure | [ ] | NEXT_PUBLIC_* only contains non-sensitive data |
| No eval() or dangerouslySetInnerHTML | [ ] | Code review for injection vectors |
| Input validation | [ ] | All user inputs validated before use |
| HTTPS enforced | [ ] | No mixed content, secure connections |
| Dependencies audited | [ ] | `npm audit` shows no high/critical vulns |
| No sensitive data in localStorage | [ ] | Only session tokens, no keys |
| Error messages safe | [ ] | No stack traces or internal details exposed |

### 7.0.1 Accessibility Checklist (WCAG 2.1 AA) [P2]

| Check | Status | Guideline |
|-------|--------|-----------|
| All images have alt text | [ ] | WCAG 1.1.1 |
| Color contrast ratio ≥ 4.5:1 | [ ] | WCAG 1.4.3 |
| Form inputs have labels | [ ] | WCAG 1.3.1 |
| Focus indicators visible | [ ] | WCAG 2.4.7 |
| Keyboard navigation works | [ ] | WCAG 2.1.1 |
| ARIA labels on buttons | [ ] | WCAG 4.1.2 |
| Error messages announced | [ ] | WCAG 3.3.1 |
| Loading states communicated | [ ] | WCAG 4.1.3 |

### 7.1 Functional Testing [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Test: Fresh passkey creation | [ ] | New user flow works | Phase 3 |
| Test: Existing passkey login | [ ] | Returning user flow works | 7.1.1 |
| Test: Session persistence | [ ] | Survives page refresh | 7.1.2 |
| Test: Disconnect | [ ] | Clears all state | 7.1.3 |
| Test: SOL transfer (SOL fees) | [ ] | Works with SOL gas | Phase 4 |
| Test: SOL transfer (USDC fees) | [ ] | Gasless works | 7.1.5 |
| Test: Invalid address rejection | [ ] | Shows error | 7.1.6 |
| Test: Insufficient balance | [ ] | Shows error | 7.1.6 |
| Test: User cancels biometric | [ ] | Handles gracefully | 7.1.1 |
| Test: Network error | [ ] | Shows retry option | 7.1.6 |

### 7.2 Cross-Browser Testing [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Test: Chrome (desktop) | [ ] | All features work | 7.1 |
| Test: Safari (desktop) | [ ] | All features work | 7.1 |
| Test: Firefox (desktop) | [ ] | All features work | 7.1 |
| Test: Edge (desktop) | [ ] | All features work | 7.1 |
| Test: Safari (iOS) | [ ] | Mobile flow works | 7.1 |
| Test: Chrome (Android) | [ ] | Mobile flow works | 7.1 |

### 7.3 Build Verification [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Run `pnpm build` | [ ] | No build errors | 7.1 |
| Run `pnpm lint` | [ ] | No lint errors | 7.3.1 |
| Run `pnpm start` | [ ] | Production build works | 7.3.1 |
| Check bundle size | [ ] | Reasonable (<500KB JS) | 7.3.3 |

### 7.4 Cleanup [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Remove console.logs | [ ] | No debug logs in prod | 7.3 |
| Remove unused imports | [ ] | Clean imports | 7.4.1 |
| Remove unused components | [ ] | No dead code | 7.4.2 |
| Review all TODOs | [ ] | None remaining | 7.4.3 |
| Check for hardcoded values | [ ] | Use constants | 7.4.3 |

### 7.5 Code Review Checklist [P1]

Self-review before considering complete:

| Category | Check | Status |
|----------|-------|--------|
| **Readability** | Code is self-documenting | [ ] |
| | Variable names are descriptive | [ ] |
| | Complex logic has comments | [ ] |
| **Structure** | Files < 300 lines | [ ] |
| | Functions < 50 lines | [ ] |
| | Single responsibility principle | [ ] |
| **TypeScript** | No `any` types (except justified) | [ ] |
| | Interfaces defined for props | [ ] |
| | Strict mode enabled | [ ] |
| **React** | No unnecessary re-renders | [ ] |
| | Keys on list items | [ ] |
| | useEffect dependencies correct | [ ] |
| **Error Handling** | Try/catch on async operations | [ ] |
| | User-friendly error messages | [ ] |
| | Loading states handled | [ ] |

### Phase 7 Completion Gate

- [ ] All functional tests pass
- [ ] Works on major browsers
- [ ] Production build succeeds
- [ ] No console errors/warnings
- [ ] Code is clean

---

## Phase 8: Deployment

> **Goal:** Live demo on Vercel
>
> **Blocking:** Phase 9 (need live URL for content)
>
> **Testing Gate:** Live URL works, all features functional on production

### 8.1 Vercel Setup [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Install Vercel CLI | [ ] | `pnpm add -g vercel` | Phase 7 |
| Login to Vercel | [ ] | `vercel login` succeeds | 8.1.1 |
| Initialize project | [ ] | `vercel` links project | 8.1.2 |
| Configure env vars | [ ] | All NEXT_PUBLIC_* set | 8.1.3 |
| Deploy preview | [ ] | Preview URL works | 8.1.4 |
| Deploy production | [ ] | Production URL works | 8.1.5 |

### 8.2 Production Testing [P0]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Test passkey on live URL | [ ] | Creation works | 8.1.6 |
| Test transfer on live URL | [ ] | Gasless tx works | 8.2.1 |
| Test on mobile device | [ ] | Touch ID works | 8.2.2 |
| Verify explorer links | [ ] | Point to devnet | 8.2.3 |
| Check HTTPS | [ ] | Site is secure | 8.1.6 |

### 8.3 Final Touches [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Update README with live URL | [ ] | Demo link in docs | 8.2 |
| Take screenshots | [ ] | For docs/blog | 8.2.4 |
| Create demo video (optional) | [ ] | Short walkthrough | 8.2.4 |

### Phase 8 Completion Gate

- [ ] Live URL accessible
- [ ] All features work on production
- [ ] Mobile tested
- [ ] Screenshots captured

---

## Phase 9: Content Creation

> **Goal:** Blog post and Twitter thread for submission
>
> **Blocking:** None (final phase)
>
> **Testing Gate:** Content reviewed, links verified

### 9.1 Blog Post [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `docs/blog-post.md` | [ ] | File exists | Phase 8 |
| Write engaging hook | [ ] | First paragraph compelling | 9.1.1 |
| Explain the problem | [ ] | Seed phrase friction | 9.1.2 |
| Present LazorKit solution | [ ] | How passkeys help | 9.1.3 |
| Include code snippets | [ ] | Key implementation | 9.1.4 |
| Add demo link | [ ] | Live URL | 9.1.4 |
| Add screenshots | [ ] | Visual proof | 9.1.5 |
| Write call to action | [ ] | Try demo, check repo | 9.1.6 |
| Review and edit | [ ] | Proofread | 9.1.7 |

### 9.2 Twitter Thread [P1]

| Task | Status | Acceptance Criteria | Depends On |
|------|--------|---------------------|------------|
| Create `docs/twitter-thread.md` | [ ] | File exists | Phase 8 |
| Write hook tweet | [ ] | Attention-grabbing | 9.2.1 |
| Problem statement tweet | [ ] | Seed phrase pain | 9.2.2 |
| Solution intro tweet | [ ] | Enter LazorKit | 9.2.3 |
| Code example tweet | [ ] | Short code snippet | 9.2.4 |
| Demo link tweet | [ ] | Try it yourself | 9.2.5 |
| CTA tweet | [ ] | Star repo, follow | 9.2.6 |
| Prepare hashtags | [ ] | #Solana #Web3 etc. | 9.2.6 |

### Phase 9 Completion Gate

- [ ] Blog post ready to publish
- [ ] Twitter thread formatted
- [ ] All links verified
- [ ] Media assets ready

---

## Submission Checklist

### Core Requirements

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Working passkey wallet creation | [ ] | Demo URL |
| Working gasless transaction | [ ] | Demo URL + Explorer |
| Clean folder structure | [ ] | Directory tree |
| Well-documented code | [ ] | Comments, README |
| Comprehensive README | [ ] | README.md |
| 2 step-by-step tutorials | [ ] | docs/ folder |
| Live demo on Devnet | [ ] | Vercel URL |
| Blog post | [ ] | blog-post.md |
| Twitter thread | [ ] | twitter-thread.md |

### Quality Checks

| Check | Status |
|-------|--------|
| No console errors | [ ] |
| Mobile responsive | [ ] |
| Cross-browser compatible | [ ] |
| Accessible (ARIA) | [ ] |
| Fast load time | [ ] |
| Clean git history | [ ] |

---

## Risk Register

### Technical Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| WebAuthn not supported | High | Low | Show browser compatibility message |
| Paymaster rate limits | Medium | Medium | Fall back to SOL fees |
| Devnet down | High | Low | Wait, retry, document |
| SDK breaking changes | High | Low | Pin version in package.json |
| Build failures | Medium | Medium | Test locally before deploy |

### Process Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Scope creep | Medium | High | Stick to checklist |
| Environment issues | Medium | Medium | Document all setup steps |
| Deadline pressure | Medium | Medium | Prioritize P0/P1 tasks |

### Rollback Procedures

| Scenario | Action |
|----------|--------|
| Deploy breaks site | Revert to previous Vercel deployment |
| SDK update breaks app | Roll back package.json, `pnpm install` |
| Passkey flow broken | Check Portal service status |
| Paymaster errors | Switch to SOL fees, file issue |

---

## Quick Reference

### Commands

```bash
# Development
pnpm dev                    # Start dev server
pnpm build                  # Production build
pnpm start                  # Run production build
pnpm lint                   # Check linting

# Deployment
vercel                      # Deploy preview
vercel --prod               # Deploy production

# Utilities
pnpm dlx next info          # Debug info
pnpm ls                     # Check dependencies
```

### Environment Variables

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

### Useful Links

| Resource | URL |
|----------|-----|
| LazorKit Docs | https://docs.lazorkit.com/ |
| LazorKit GitHub | https://github.com/lazor-kit/lazor-kit |
| Solana Explorer | https://explorer.solana.com/?cluster=devnet |
| Solana Faucet | https://faucet.solana.com |
| Contest Page | https://earn.superteam.fun/listing/integrate-passkey-technology-with-lazorkit-to-10x-solana-ux |
| Vercel Dashboard | https://vercel.com/dashboard |

### Contact Points

| Issue | Contact |
|-------|---------|
| SDK questions | LazorKit Discord/GitHub Issues |
| Devnet issues | Solana Discord |
| Contest questions | Superteam Discord |
