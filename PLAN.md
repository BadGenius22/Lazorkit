# LazorKit SDK Integration Example - Project Plan

> **What We're Building:** A practical, easy-to-follow code example that helps developers integrate LazorKit SDK fast - not a full product.

## Table of Contents

- [Executive Summary](#executive-summary)
- [Contest Requirements](#contest-requirements)
- [Project Vision](#project-vision)
- [Technical Approach](#technical-approach)
- [Directory Structure](#directory-structure)
- [Implementation Roadmap](#implementation-roadmap)
- [Success Metrics](#success-metrics)
- [Risk Assessment](#risk-assessment)
- [Contingency Plans](#contingency-plans)
- [Resource Allocation](#resource-allocation)
- [Quality Gates](#quality-gates)
- [RACI Matrix](#raci-matrix)
- [Communication Plan](#communication-plan)
- [Change Management](#change-management)
- [SDK Reference](#sdk-reference)
- [Glossary](#glossary)
- [Resources](#resources)

---

## Executive Summary

### Project At a Glance

| Attribute                | Value                                                            |
| ------------------------ | ---------------------------------------------------------------- |
| **Project Name**         | LazorKit SDK Integration Example                                 |
| **Objective**            | Practical code example showing LazorKit SDK integration for devs |
| **Primary Deliverables** | Working code example + clear documentation + live demo           |
| **Focus**                | Help other developers get started fast                           |
| **Contest Deadline**     | January 15, 2026                                                 |
| **Target Outcome**       | Top 5 placement ($75 - $700 USDC)                                |

### Value Proposition

This is a **working code example** (not a full product) that shows developers how to integrate LazorKit SDK in a real-world environment. It's designed to be:

**Developer-Focused:**

- Copy-paste ready code snippets
- Clear, commented examples
- Minimal boilerplate, maximum learning
- Real-world integration patterns

**What Developers Will Learn:**

- Passkey wallet creation with biometrics
- Gasless transaction execution
- SDK configuration and best practices

---

## Contest Requirements

### Official Criteria

| Category            | Weight | Requirement                                 |
| ------------------- | ------ | ------------------------------------------- |
| **Documentation**   | 40%    | Clear, detailed README + tutorials          |
| **SDK Integration** | 30%    | Working passkey + gasless tx implementation |
| **Code Quality**    | 30%    | Clean, maintainable, well-structured code   |

### Prize Distribution

| Placement | Prize     |
| --------- | --------- |
| 1st Place | $700 USDC |
| 2nd Place | $400 USDC |
| 3rd Place | $200 USDC |
| 4th Place | $125 USDC |
| 5th Place | $75 USDC  |

### Minimum Submission Requirements

- [ ] Working passkey wallet creation demo
- [ ] Working gasless transaction demo
- [ ] Live deployment on Solana Devnet
- [ ] Comprehensive README.md
- [ ] Step-by-step tutorial documentation (2 tutorials)
- [ ] Blog post draft
- [ ] Twitter thread draft

---

## Project Vision

### What is LazorKit?

LazorKit is a framework for building **passkey-native Solana applications** that replaces traditional seed phrases with biometric authentication (FaceID, TouchID, Windows Hello).

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                    TRADITIONAL vs LAZORKIT                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  TRADITIONAL WALLET                    LAZORKIT WALLET                       │
│  ─────────────────                    ─────────────────                      │
│                                                                              │
│  1. Install wallet extension          1. Click "Connect"                     │
│  2. Create/import seed phrase         2. Use biometric (FaceID/TouchID)      │
│  3. Securely backup 12-24 words       3. Done - wallet created!              │
│  4. Remember/store password                                                  │
│  5. Sign in with password                                                    │
│                                                                              │
│  Time: 5-10 minutes                   Time: 5-10 seconds                     │
│  Friction: HIGH                       Friction: NONE                         │
│  Security: User-dependent             Security: Hardware-backed              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Core Features Matrix

| Feature               | Description                      | User Benefit              |
| --------------------- | -------------------------------- | ------------------------- |
| **Seedless**          | Passkeys instead of mnemonics    | No 24 words to lose       |
| **Gasless**           | Paymaster-sponsored transactions | No need to buy SOL first  |
| **Smart Wallets**     | PDAs with programmable logic     | Future-proof, recoverable |
| **Hardware Security** | Keys in Secure Enclave           | Phishing-resistant        |
| **Cross-Platform**    | FaceID, TouchID, Windows Hello   | Works everywhere          |

### Target Users

| User Type            | Pain Point                   | Solution                         |
| -------------------- | ---------------------------- | -------------------------------- |
| **Crypto Newcomers** | Seed phrases are confusing   | "Just use your face/fingerprint" |
| **Mobile Users**     | Wallet apps are cumbersome   | Native biometric integration     |
| **Developers**       | Complex wallet integrations  | Simple SDK, few lines of code    |
| **dApp Builders**    | User drop-off at wallet step | Seamless onboarding              |

---

## Technical Approach

### Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           TECHNOLOGY STACK                                   │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LAYER              TECHNOLOGY              PURPOSE                          │
│  ─────              ──────────              ───────                          │
│                                                                              │
│  Runtime            Node.js 20+                   JavaScript runtime         │
│  Package Manager    pnpm 8+                       Fast, disk-efficient       │
│  Framework          Next.js 14+ (App Router)      React server components    │
│  Language           TypeScript                    Type safety                │
│  Styling            Tailwind CSS                  Utility-first CSS          │
│  Blockchain         Solana Devnet                 Test network               │
│  SDK                @lazorkit/wallet              Passkey integration        │
│  Solana SDK         @solana/web3.js               Blockchain interaction     │
│  Anchor             @coral-xyz/anchor             Program framework          │
│  Deployment         Vercel                        Edge hosting               │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                            APPLICATION ARCHITECTURE                           │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────┐    ┌─────────────────────────────────────────────────────┐ │
│   │   USER      │    │                    NEXT.JS APP                       │ │
│   │   DEVICE    │    │  ┌─────────────────────────────────────────────────┐ │ │
│   │             │◄──►│  │              LazorkitProvider                   │ │ │
│   │ ┌─────────┐ │    │  │  ┌───────────────────────────────────────────┐  │ │ │
│   │ │ Secure  │ │    │  │  │              Pages                        │  │ │ │
│   │ │ Enclave │ │    │  │  │  ┌─────────┐ ┌─────────┐ ┌─────────────┐  │  │ │ │
│   │ │ (Keys)  │ │    │  │  │  │  Home   │ │ Passkey │ │  Gasless    │  │  │ │ │
│   │ └─────────┘ │    │  │  │  │         │ │ Login   │ │  Transfer   │  │  │ │ │
│   │ ┌─────────┐ │    │  │  │  └─────────┘ └─────────┘ └─────────────┘  │  │ │ │
│   │ │WebAuthn │ │    │  │  └───────────────────────────────────────────┘  │ │ │
│   │ │  API    │ │    │  │                       │                         │ │ │
│   │ └─────────┘ │    │  │  ┌───────────────────────────────────────────┐  │ │ │
│   └─────────────┘    │  │  │            Shared Components              │  │ │ │
│                      │  │  │  ConnectButton │ WalletInfo │ TransferForm│  │ │ │
│                      │  │  └───────────────────────────────────────────┘  │ │ │
│                      │  └─────────────────────────────────────────────────┘ │ │
│                      └──────────────────────────┬──────────────────────────┘ │
│                                                  │                            │
└──────────────────────────────────────────────────┼────────────────────────────┘
                                                   │
                    ┌──────────────────────────────┼──────────────────────────────┐
                    │                              ▼                              │
                    │  ┌──────────────┐   ┌──────────────┐   ┌──────────────┐    │
                    │  │   Portal     │   │  Paymaster   │   │   Solana     │    │
                    │  │   Service    │   │   Service    │   │   Devnet     │    │
                    │  │              │   │              │   │              │    │
                    │  │  - Passkey   │   │  - Fee       │   │  - Programs  │    │
                    │  │    registry  │   │    sponsor   │   │  - PDAs      │    │
                    │  │  - Sessions  │   │  - Tx wrap   │   │  - State     │    │
                    │  └──────────────┘   └──────────────┘   └──────────────┘    │
                    │                     LAZORKIT INFRASTRUCTURE                 │
                    └─────────────────────────────────────────────────────────────┘
```

### Data Flow Summary

| Flow                 | Steps                                                     | Key Technologies   |
| -------------------- | --------------------------------------------------------- | ------------------ |
| **Passkey Creation** | User biometric → Secure Enclave → Portal → PDA derivation | WebAuthn, P-256    |
| **Passkey Login**    | User biometric → Credential lookup → Session restore      | WebAuthn, JWT      |
| **Gasless Transfer** | Build tx → Paymaster wrap → User sign → Submit → Confirm  | Solana web3, ECDSA |

---

## Directory Structure

### Project Layout

```
/home/dewaxindo/Lazorkit/
│
├── app/                              # Next.js App Router
│   ├── layout.tsx                    # Root layout + LazorkitProvider
│   ├── page.tsx                      # Homepage
│   ├── globals.css                   # Global styles
│   ├── passkey-login/
│   │   └── page.tsx                  # Tutorial 1: Passkey authentication
│   └── gasless-transfer/
│       └── page.tsx                  # Tutorial 2: Gasless transactions
│
├── components/                       # Reusable React components
│   ├── Navbar.tsx                    # Navigation bar
│   ├── ConnectButton.tsx             # Wallet connect/disconnect
│   ├── WalletInfo.tsx                # Display wallet details
│   └── TransferForm.tsx              # SOL transfer form
│
├── hooks/                            # Custom React hooks
│   └── useBalance.ts                 # Fetch wallet balance
│
├── lib/                              # Utilities and configuration
│   └── constants.ts                  # Environment variables, URLs
│
├── docs/                             # Documentation files
│   ├── 01-passkey-login.md           # Tutorial 1 guide
│   ├── 02-gasless-transfer.md        # Tutorial 2 guide
│   ├── blog-post.md                  # Blog article draft
│   └── twitter-thread.md             # Social media content
│
├── public/                           # Static assets
│   └── screenshots/                  # Demo screenshots
│
├── README.md                         # Main documentation
├── PLAN.md                           # This file
├── ARCHITECTURE.md                   # Technical architecture
├── IMPLEMENTATION-CHECKLIST.md       # Task tracking
│
├── package.json                      # Dependencies
├── next.config.js                    # Next.js configuration
├── tailwind.config.js                # Tailwind configuration
├── tsconfig.json                     # TypeScript configuration
├── .env.local.example                # Environment template
└── .gitignore                        # Git ignore rules
```

### File Responsibilities

| File/Directory                 | Purpose                         | Priority |
| ------------------------------ | ------------------------------- | -------- |
| `app/layout.tsx`               | Provider setup, Buffer polyfill | P0       |
| `app/passkey-login/`           | Tutorial 1 implementation       | P0       |
| `app/gasless-transfer/`        | Tutorial 2 implementation       | P0       |
| `components/ConnectButton.tsx` | Core wallet interaction         | P0       |
| `components/TransferForm.tsx`  | Transaction submission          | P0       |
| `lib/constants.ts`             | Centralized configuration       | P1       |
| `README.md`                    | Primary documentation           | P0       |
| `docs/*.md`                    | Tutorial content                | P1       |

---

## Implementation Roadmap

### Phase Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         IMPLEMENTATION PHASES                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PHASE 1          PHASE 2          PHASE 3          PHASE 4                 │
│  Foundation       Infrastructure   Features         Polish                  │
│  ──────────       ──────────────   ────────         ──────                  │
│                                                                              │
│  □ Next.js        □ Provider       □ Passkey        □ Docs                  │
│  □ Dependencies   □ Constants      □ Transfer       □ QA                    │
│  □ Environment    □ Components     □ Homepage       □ Deploy                │
│  □ Polyfills      □ Navbar         □ Balance        □ Content               │
│                                                                              │
│  ◄─────────────────────────────────────────────────────────────────────────►│
│  PROJECT START                                           SUBMISSION DEADLINE │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Detailed Phase Breakdown

#### Phase 1: Project Foundation

| Task                  | Description                               | Deliverable          |
| --------------------- | ----------------------------------------- | -------------------- |
| Initialize Next.js    | `pnpm create next-app` with TS + Tailwind | Working dev server   |
| Install dependencies  | `pnpm add` LazorKit SDK, Solana packages  | No dependency errors |
| Configure environment | .env.local with service URLs              | Accessible env vars  |
| Setup polyfills       | Buffer for browser compatibility          | No runtime errors    |

**Exit Criteria:** `pnpm dev` runs without errors

#### Phase 2: Core Infrastructure

| Task             | Description               | Deliverable            |
| ---------------- | ------------------------- | ---------------------- |
| LazorkitProvider | Wrap app with SDK context | useWallet() accessible |
| Constants file   | Centralized configuration | DRY code               |
| Navbar component | Navigation between pages  | Working routing        |
| ConnectButton    | Wallet connection UI      | State-aware button     |
| WalletInfo       | Display wallet details    | Address + copy + link  |

**Exit Criteria:** Can connect/disconnect wallet via UI

#### Phase 3: Feature Implementation

| Task                  | Description                    | Deliverable            |
| --------------------- | ------------------------------ | ---------------------- |
| Passkey Login page    | Tutorial 1 complete flow       | Working biometric auth |
| Transfer form         | Input validation + tx building | Form with validation   |
| Gasless Transfer page | Tutorial 2 complete flow       | Working gasless tx     |
| Homepage              | Navigation + feature cards     | Entry point            |
| Balance hook          | Real-time balance display      | Updated balances       |

**Exit Criteria:** Both tutorials work end-to-end on Devnet

#### Phase 4: Documentation & Deployment

| Task              | Description           | Deliverable           |
| ----------------- | --------------------- | --------------------- |
| README.md         | Comprehensive docs    | Setup-to-deploy guide |
| Tutorial docs     | Step-by-step guides   | docs/ folder complete |
| QA testing        | Cross-browser, mobile | Test report           |
| Vercel deployment | Production hosting    | Live URL              |
| Blog post         | Technical article     | blog-post.md          |
| Twitter thread    | Social content        | twitter-thread.md     |

**Exit Criteria:** Live demo + all docs complete

---

## Success Metrics

### Quantitative Metrics

| Metric                     | Target       | Measurement                   |
| -------------------------- | ------------ | ----------------------------- |
| **Passkey Creation Time**  | < 10 seconds | User click to wallet address  |
| **Transaction Time**       | < 5 seconds  | Submit to confirmation        |
| **Page Load Time**         | < 2 seconds  | First contentful paint        |
| **Build Size**             | < 500KB JS   | Bundled JavaScript            |
| **Documentation Coverage** | 100%         | All features documented       |
| **Cross-Browser Support**  | 4+ browsers  | Chrome, Safari, Firefox, Edge |

### Qualitative Metrics

| Aspect              | Success Criteria                            |
| ------------------- | ------------------------------------------- |
| **User Experience** | Can complete demo without documentation     |
| **Code Quality**    | Reviewer can understand within 5 minutes    |
| **Documentation**   | New developer can run locally in 10 minutes |
| **Error Handling**  | All edge cases show helpful messages        |

### Submission Quality Checklist

| Category                  | Item                | Weight |
| ------------------------- | ------------------- | ------ |
| **Documentation (40%)**   | README completeness | 15%    |
|                           | Tutorial clarity    | 15%    |
|                           | Code comments       | 10%    |
| **SDK Integration (30%)** | Passkey flow works  | 15%    |
|                           | Gasless tx works    | 15%    |
| **Code Quality (30%)**    | Project structure   | 10%    |
|                           | TypeScript usage    | 10%    |
|                           | Error handling      | 10%    |

---

## Risk Assessment

### Risk Matrix

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                            RISK ASSESSMENT MATRIX                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  LIKELIHOOD                                                                  │
│      ▲                                                                       │
│      │                                                                       │
│ HIGH │           ┌───────────────┐                                          │
│      │           │ Scope Creep   │                                          │
│      │           │ (Medium/High) │                                          │
│      │           └───────────────┘                                          │
│      │                                                                       │
│ MED  │    ┌────────────────┐  ┌──────────────────┐                          │
│      │    │ Build Failures │  │ Paymaster Limits │                          │
│      │    │ (Medium/Med)   │  │ (Medium/Medium)  │                          │
│      │    └────────────────┘  └──────────────────┘                          │
│      │                                                                       │
│ LOW  │    ┌──────────────┐  ┌──────────────┐  ┌──────────────┐              │
│      │    │ WebAuthn Not │  │ Devnet Down  │  │ SDK Breaking │              │
│      │    │ Supported    │  │              │  │ Changes      │              │
│      │    │ (High/Low)   │  │ (High/Low)   │  │ (High/Low)   │              │
│      │    └──────────────┘  └──────────────┘  └──────────────┘              │
│      │                                                                       │
│      └────────────────────────────────────────────────────────────► IMPACT  │
│              LOW              MEDIUM              HIGH                       │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Risk Details

#### High Impact Risks

| Risk                       | Impact                   | Likelihood | Mitigation Strategy                       |
| -------------------------- | ------------------------ | ---------- | ----------------------------------------- |
| **WebAuthn Not Supported** | Blocks all functionality | Low        | Feature detection + compatibility message |
| **SDK Breaking Changes**   | Major code rewrite       | Low        | Pin versions in package.json              |
| **Devnet Unavailable**     | Cannot test/demo         | Low        | Wait + retry; document in submission      |

#### Medium Impact Risks

| Risk                      | Impact             | Likelihood | Mitigation Strategy                  |
| ------------------------- | ------------------ | ---------- | ------------------------------------ |
| **Paymaster Rate Limits** | Gasless demo fails | Medium     | Fall back to SOL fees; cache results |
| **Build Failures**        | Cannot deploy      | Medium     | Test builds early and often          |
| **Browser Compatibility** | Reduced audience   | Medium     | Test on multiple browsers early      |

#### Process Risks

| Risk                   | Impact             | Likelihood | Mitigation Strategy           |
| ---------------------- | ------------------ | ---------- | ----------------------------- |
| **Scope Creep**        | Miss deadline      | High       | Strict adherence to checklist |
| **Environment Issues** | Development delays | Medium     | Document setup thoroughly     |
| **Deadline Pressure**  | Quality issues     | Medium     | Prioritize P0 tasks first     |

---

## Contingency Plans

### Technical Fallbacks

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CONTINGENCY DECISION TREE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  PROBLEM                      FALLBACK                   ESCALATION          │
│  ───────                      ────────                   ──────────          │
│                                                                              │
│  Passkey creation fails   →   Check browser support  →   Show compat guide  │
│                               Retry with different                           │
│                               credential type                                │
│                                                                              │
│  Paymaster rejects tx     →   Switch to SOL fees    →   Document limitation │
│                               Reduce tx amount                               │
│                                                                              │
│  Devnet RPC down          →   Try alternate RPC      →   Wait + document    │
│                               (Helius, Quicknode)                            │
│                                                                              │
│  Build fails on Vercel    →   Check node version     →   Deploy manually    │
│                               Review env vars                                │
│                                                                              │
│  SDK method deprecated    →   Check changelog        →   Pin older version  │
│                               Use alternative API                            │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Minimum Viable Submission

If running out of time, prioritize in this order:

1. **Must Have (P0)**

   - Passkey creation works
   - One transfer works (even with SOL fees)
   - Basic README with setup instructions
   - Live deployment on Vercel

2. **Should Have (P1)**

   - Gasless with USDC fees
   - Both tutorial docs
   - Polished UI

3. **Nice to Have (P2)**
   - Blog post
   - Twitter thread
   - Balance display
   - Toast notifications

### Rollback Procedures

| Scenario             | Immediate Action                    | Recovery Steps                 |
| -------------------- | ----------------------------------- | ------------------------------ |
| Vercel deploy breaks | Revert to last deployment           | Debug locally, redeploy        |
| pnpm install breaks  | Delete node_modules, pnpm-lock.yaml | `pnpm install`, check versions |
| Git corruption       | Clone fresh from remote             | Check for uncommitted work     |
| SDK crash            | Check LazorKit status               | Pin working version            |

---

## Resource Allocation

### Time Budget (Estimate)

| Phase       | Tasks             | Allocation |
| ----------- | ----------------- | ---------- |
| **Phase 1** | Foundation        | 10%        |
| **Phase 2** | Infrastructure    | 20%        |
| **Phase 3** | Features          | 35%        |
| **Phase 4** | Polish + Docs     | 25%        |
| **Buffer**  | Unexpected issues | 10%        |

### Critical Path

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CRITICAL PATH                                      │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌────────┐   ┌────────────┐   ┌────────────┐   ┌────────┐   ┌──────────┐  │
│  │ Setup  │──►│ Provider   │──►│ Passkey    │──►│ Transfer│──►│ Deploy   │  │
│  │ Next.js│   │ + Connect  │   │ Tutorial   │   │ Tutorial│   │ + Docs   │  │
│  └────────┘   └────────────┘   └────────────┘   └────────┘   └──────────┘  │
│                                                                              │
│  Each step blocks the next. Cannot skip or parallelize.                     │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Parallelizable Work

| Can Run in Parallel | Dependencies             |
| ------------------- | ------------------------ |
| README writing      | After Phase 2            |
| Tutorial 1 docs     | After Phase 3 (passkey)  |
| Tutorial 2 docs     | After Phase 3 (transfer) |
| Blog post           | After deployment         |
| Screenshots         | After deployment         |

---

## Quality Gates

### Gate Definitions

| Gate               | Location         | Criteria                    |
| ------------------ | ---------------- | --------------------------- |
| **G1: Setup**      | After Phase 1    | Dev server runs, no errors  |
| **G2: Connection** | After Phase 2    | Wallet connects/disconnects |
| **G3: Passkey**    | After Tutorial 1 | Biometric creates wallet    |
| **G4: Transfer**   | After Tutorial 2 | Gasless tx confirmed        |
| **G5: Deploy**     | After deployment | Live URL functional         |
| **G6: Submit**     | Before deadline  | All criteria met            |

### Gate Checklist

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          QUALITY GATE CHECKLIST                              │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  GATE 1: SETUP                           GATE 2: CONNECTION                  │
│  □ pnpm dev succeeds                     □ LazorkitProvider wraps app        │
│  □ Page renders at localhost             □ ConnectButton shows states        │
│  □ No console errors                     □ useWallet() returns data          │
│  □ Env vars accessible                   □ Navbar links work                 │
│                                                                              │
│  GATE 3: PASSKEY                         GATE 4: TRANSFER                    │
│  □ Biometric prompt appears              □ Form validates inputs             │
│  □ Wallet address derived                □ Transaction builds correctly      │
│  □ Session persists on refresh           □ Signature returned                │
│  □ Disconnect clears state               □ Explorer link works               │
│                                                                              │
│  GATE 5: DEPLOY                          GATE 6: SUBMIT                      │
│  □ Vercel deployment succeeds            □ All tutorials work                │
│  □ Live URL accessible                   □ README complete                   │
│  □ All features work in prod             □ Tutorial docs complete            │
│  □ Mobile tested                         □ Blog post ready                   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## RACI Matrix

### Role Definitions

| Role                | Description                                       |
| ------------------- | ------------------------------------------------- |
| **R** - Responsible | Does the work to complete the task                |
| **A** - Accountable | Ultimately answerable for completion (1 per task) |
| **C** - Consulted   | Provides input before/during work                 |
| **I** - Informed    | Kept updated on progress                          |

### Task Assignments (Solo Developer Context)

For a solo bounty submission, adapt RACI as a personal checklist:

| Task                       | Developer | LazorKit (External) | Contest (Superteam) |
| -------------------------- | --------- | ------------------- | ------------------- |
| **Project Setup**          | R/A       | I                   | I                   |
| **SDK Integration**        | R/A       | C (docs/support)    | I                   |
| **Passkey Implementation** | R/A       | C (SDK behavior)    | I                   |
| **Gasless Transfer**       | R/A       | C (paymaster)       | I                   |
| **Documentation**          | R/A       | I                   | A (judges)          |
| **Deployment**             | R/A       | I                   | I                   |
| **Content Creation**       | R/A       | I                   | A (judges)          |
| **Final Submission**       | R/A       | I                   | A (evaluates)       |

### External Dependencies

| Dependency     | Owner             | Contact Method         | SLA         |
| -------------- | ----------------- | ---------------------- | ----------- |
| LazorKit SDK   | LazorKit Team     | GitHub Issues, Discord | Best effort |
| Solana Devnet  | Solana Foundation | Status page            | 99.9%       |
| Vercel Hosting | Vercel            | Support ticket         | 99.99%      |
| Contest Rules  | Superteam         | Discord, Earn page     | N/A         |

---

## Communication Plan

### Progress Reporting

| Checkpoint         | When        | What to Report                 | To Whom          |
| ------------------ | ----------- | ------------------------------ | ---------------- |
| **Daily**          | End of day  | Tasks completed, blockers      | Self (journal)   |
| **Phase Complete** | Per gate    | Gate checklist status          | Self + commit    |
| **Blocked**        | Immediately | Issue + attempted solutions    | LazorKit Discord |
| **Pre-Submission** | 24h before  | Final review, all requirements | Self             |

### Issue Escalation Path

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         ESCALATION FLOWCHART                                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ISSUE DETECTED                                                             │
│       │                                                                      │
│       ▼                                                                      │
│  ┌─────────────┐     YES    ┌─────────────────────────────────────────┐     │
│  │ Can solve   │───────────►│ Solve it. Document solution.            │     │
│  │ in < 1 hour?│            └─────────────────────────────────────────┘     │
│  └─────┬───────┘                                                            │
│        │ NO                                                                  │
│        ▼                                                                     │
│  ┌─────────────┐     YES    ┌─────────────────────────────────────────┐     │
│  │ SDK/Service │───────────►│ 1. Check docs & GitHub issues           │     │
│  │ issue?      │            │ 2. Search Discord                       │     │
│  └─────┬───────┘            │ 3. Post in LazorKit Discord             │     │
│        │ NO                 └─────────────────────────────────────────┘     │
│        ▼                                                                     │
│  ┌─────────────┐     YES    ┌─────────────────────────────────────────┐     │
│  │ Contest     │───────────►│ Post in Superteam Discord               │     │
│  │ rules issue?│            │ Tag organizers                          │     │
│  └─────┬───────┘            └─────────────────────────────────────────┘     │
│        │ NO                                                                  │
│        ▼                                                                     │
│  ┌─────────────────────────────────────────────────────────────────────┐    │
│  │ Technical blocker:                                                  │    │
│  │ 1. Document the issue thoroughly                                    │    │
│  │ 2. Try alternative approaches                                       │    │
│  │ 3. Implement workaround if possible                                 │    │
│  │ 4. Document limitation in submission if unresolved                  │    │
│  └─────────────────────────────────────────────────────────────────────┘    │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Documentation Trail

Maintain a decision log for significant choices:

```markdown
## Decision Log

### YYYY-MM-DD: [Decision Title]

- **Context:** What situation required a decision
- **Options Considered:** A, B, C
- **Decision:** Chose B
- **Rationale:** Why B was selected
- **Consequences:** What this means going forward
```

---

## Change Management

### Scope Change Process

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         CHANGE CONTROL PROCESS                               │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. IDENTIFY                                                                │
│     • New requirement discovered                                            │
│     • Bug requires architectural change                                     │
│     • External dependency changed                                           │
│                                                                              │
│  2. ASSESS                                                                  │
│     □ Is it required for minimum submission? (Must do)                      │
│     □ Does it improve judging criteria? (Should do if time)                 │
│     □ Is it nice-to-have? (Won't do unless ahead)                           │
│                                                                              │
│  3. DECIDE                                                                  │
│     • P0 change: Implement immediately                                      │
│     • P1 change: Add to backlog, schedule if time                           │
│     • P2/P3 change: Document for future, skip for now                       │
│                                                                              │
│  4. IMPLEMENT                                                               │
│     • Update IMPLEMENTATION-CHECKLIST.md                                    │
│     • Adjust priorities if needed                                           │
│     • Document in decision log                                              │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

### Version Control Strategy

| Branch      | Purpose               | Merge Strategy                    |
| ----------- | --------------------- | --------------------------------- |
| `main`      | Production-ready code | Protected, requires passing build |
| `dev`       | Active development    | Working commits                   |
| `feature/*` | New features          | PR to dev                         |
| `fix/*`     | Bug fixes             | PR to dev                         |

### Commit Message Convention

```
type(scope): description

Types: feat, fix, docs, style, refactor, test, chore
Scope: passkey, transfer, ui, docs, config

Examples:
- feat(passkey): add connect button component
- fix(transfer): handle insufficient balance error
- docs(readme): add deployment instructions
- chore(deps): pnpm update @lazorkit/wallet to 1.2.0
```

---

## SDK Reference

### Provider Configuration

```tsx
import { LazorkitProvider } from "@lazorkit/wallet";

<LazorkitProvider
  rpcUrl="https://api.devnet.solana.com"
  portalUrl="https://portal.lazor.sh"
  paymasterConfig={{
    paymasterUrl: "https://kora.devnet.lazorkit.com",
  }}
>
  <App />
</LazorkitProvider>;
```

### useWallet Hook

```tsx
const {
  // State
  wallet, // WalletAccount | null
  isConnected, // boolean
  isConnecting, // boolean
  smartWalletPubkey, // PublicKey | null

  // Actions
  connect, // () => Promise<void>
  disconnect, // () => Promise<void>
  signAndSendTransaction, // (params) => Promise<string>
} = useWallet();
```

### Transaction Building

```tsx
import { SystemProgram, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

// Build transfer instruction
const instruction = SystemProgram.transfer({
  fromPubkey: smartWalletPubkey,
  toPubkey: new PublicKey(recipientAddress),
  lamports: amount * LAMPORTS_PER_SOL,
});

// Execute with gasless fees
const signature = await signAndSendTransaction({
  instructions: [instruction],
  transactionOptions: {
    feeToken: "USDC", // Paymaster sponsors fees
  },
});
```

### Error Handling Pattern

```tsx
try {
  const signature = await signAndSendTransaction({...});
  // Success: show signature + explorer link
} catch (err) {
  if (err.name === 'UserCancelled') {
    // Silent: user cancelled biometric
    return;
  }
  if (err.message?.includes('insufficient')) {
    // Show: insufficient balance error
  } else if (err.message?.includes('paymaster')) {
    // Show: paymaster error, suggest SOL fees
  } else {
    // Show: generic error message
  }
}
```

---

## Glossary

| Term               | Definition                                                                |
| ------------------ | ------------------------------------------------------------------------- |
| **Passkey**        | FIDO2/WebAuthn credential stored in device's Secure Enclave               |
| **Secure Enclave** | Hardware security module for key storage (FaceID, TouchID, TPM)           |
| **WebAuthn**       | W3C standard for passwordless authentication                              |
| **PDA**            | Program Derived Address - deterministic address owned by a Solana program |
| **Smart Wallet**   | PDA that acts as user's wallet, controlled by passkey                     |
| **Paymaster**      | Service that pays transaction fees on behalf of users                     |
| **Gasless**        | Transaction where user doesn't pay fees (paymaster covers)                |
| **Lamports**       | Smallest unit of SOL (1 SOL = 1,000,000,000 lamports)                     |
| **Devnet**         | Solana test network with free test tokens                                 |
| **P-256**          | Elliptic curve used by passkeys (secp256r1)                               |

---

## Resources

### Official Documentation

| Resource        | URL                                    |
| --------------- | -------------------------------------- |
| LazorKit Docs   | https://docs.lazorkit.com/             |
| LazorKit GitHub | https://github.com/lazor-kit/lazor-kit |
| LazorKit Portal | https://portal.lazor.sh                |

### Solana Resources

| Resource                 | URL                                           |
| ------------------------ | --------------------------------------------- |
| Solana Docs              | https://solana.com/docs                       |
| Solana Explorer (Devnet) | https://explorer.solana.com/?cluster=devnet   |
| Solana Faucet            | https://faucet.solana.com                     |
| Web3.js Docs             | https://solana-labs.github.io/solana-web3.js/ |

### Contest Information

| Resource     | URL                                                                                            |
| ------------ | ---------------------------------------------------------------------------------------------- |
| Contest Page | https://earn.superteam.fun/listing/integrate-passkey-technology-with-lazorkit-to-10x-solana-ux |

### Development Tools

| Tool         | Purpose             |
| ------------ | ------------------- |
| Next.js      | React framework     |
| Vercel       | Deployment platform |
| Tailwind CSS | Styling             |
| TypeScript   | Type safety         |

---

## Revision History

| Version | Date     | Changes                                                                      |
| ------- | -------- | ---------------------------------------------------------------------------- |
| 1.0     | Initial  | Base plan                                                                    |
| 2.0     | Enhanced | Added risk matrix, contingency plans, success metrics, quality gates         |
| 2.1     | Industry | Added RACI matrix, communication plan, change management, commit conventions |
| 2.2     | Refocus  | Updated to pnpm, Node 20+, refocused on practical code example for devs      |
