# Contributing to LazorKit SDK Example

[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/your-username/lazorkit-example/pulls)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Code Style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://prettier.io/)

Thank you for your interest in contributing to this LazorKit SDK integration example! This guide will help you get started.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Code Standards](#code-standards)
- [Making Changes](#making-changes)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Security](#security)
- [Getting Help](#getting-help)

---

## Code of Conduct

We are committed to providing a welcoming and inclusive experience for everyone. Please be respectful and constructive in all interactions. Harassment, discrimination, or abusive behavior will not be tolerated.

---

## Getting Started

### Prerequisites

Before you begin, ensure you have:

| Requirement | Version | Check Command    |
| ----------- | ------- | ---------------- |
| Node.js     | 20+     | `node --version` |
| pnpm        | 8+      | `pnpm --version` |
| Git         | Any     | `git --version`  |

You'll also need:

- A WebAuthn-compatible browser (Chrome 108+, Safari 16+, Firefox 122+)
- A device with biometrics (TouchID, FaceID, Windows Hello) or a security key

### Quick Start

```bash
# Clone the repository
git clone https://github.com/your-username/lazorkit-example.git
cd lazorkit-example

# Install dependencies
pnpm install

# Set up environment variables
cp .env.local.example .env.local

# Start development server
pnpm dev
```

Visit `http://localhost:3000` to see the app running.

### First-Time Contributors

New to open source? Look for issues labeled:

| Label              | Description                                  |
| ------------------ | -------------------------------------------- |
| `good first issue` | Great for newcomers, well-documented tasks   |
| `help wanted`      | Issues where we need community help          |
| `documentation`    | Improvements to docs, comments, or tutorials |

> **Tip:** Start with documentation or small bug fixes to familiarize yourself with the codebase before tackling larger features.

---

## Development Setup

### Environment Variables

Create `.env.local` with the following:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

> **Note:** These are devnet URLs. Never commit mainnet credentials to the repository.

### Available Commands

| Command      | Description                              |
| ------------ | ---------------------------------------- |
| `pnpm dev`   | Start development server with hot reload |
| `pnpm build` | Create production build                  |
| `pnpm start` | Run production build locally             |
| `pnpm lint`  | Run ESLint checks                        |

---

## Project Structure

```
lazorkit-example/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Homepage
│   ├── passkey-login/      # Tutorial 1: Passkey authentication
│   ├── gasless-transfer/   # Tutorial 2: Gasless transactions
│   └── payment-widget/     # Tutorial 3: Payment component
│
├── components/             # Reusable React components
│   ├── ConnectButton.tsx   # Wallet connection button
│   ├── WalletInfo.tsx      # Wallet details display
│   ├── TransferForm.tsx    # SOL transfer form
│   ├── Navbar.tsx          # Navigation bar
│   ├── Skeleton.tsx        # Loading placeholders
│   └── payment/            # Payment widget components
│       ├── PaymentWidget.tsx
│       └── PaymentStatus.tsx
│
├── hooks/                  # Custom React hooks
│   ├── useBalance.ts       # SOL balance fetching
│   └── usePayment.ts       # Payment processing logic
│
├── lib/                    # Utilities and constants
│   ├── constants.ts        # App configuration
│   └── solana-pay.ts       # Payment utilities
│
├── docs/                   # Tutorial documentation
│   ├── 01-passkey-login.md
│   ├── 02-gasless-transfer.md
│   ├── 03-payment-widget.md
│   └── 04-cross-device-session.md
│
└── public/                 # Static assets
```

### Key Files

| File                                   | Purpose                                     |
| -------------------------------------- | ------------------------------------------- |
| `app/providers.tsx`                    | LazorkitProvider setup with Buffer polyfill |
| `hooks/usePayment.ts`                  | Core payment logic with error handling      |
| `components/payment/PaymentWidget.tsx` | Drop-in payment component                   |

---

## Code Standards

### TypeScript

- **Strict mode enabled** — No `any` types allowed
- **All exports documented** — JSDoc comments with `@description`, `@param`, `@returns`, `@example`
- **Interfaces over types** — For object shapes that may be extended

```typescript
// ✓ Good - Full JSDoc documentation
/**
 * Formats a payment amount for display
 *
 * @param amount - Amount in SOL
 * @param currency - Currency symbol to display
 * @returns Formatted string like "0.05 SOL"
 *
 * @example
 * formatPaymentAmount(0.05, "SOL"); // "0.0500 SOL"
 */
export function formatPaymentAmount(amount: number, currency: string): string {
  // ...
}
```

```typescript
// ✗ Avoid - Missing documentation
export function formatPaymentAmount(amount: any, currency: any) {
  // ...
}
```

### React Components

- **Client components** — Use `"use client"` directive for components using hooks
- **Prop interfaces** — Document all props with JSDoc comments
- **Error boundaries** — Handle errors gracefully with user-friendly messages

```typescript
// ✓ Good - Documented component
/**
 * Wallet connection button
 *
 * @description Handles connect/disconnect with passkey authentication
 * @example <ConnectButton />
 */
export function ConnectButton() {
  // ...
}
```

### Styling

| Do                                        | Don't                         |
| ----------------------------------------- | ----------------------------- |
| Use Tailwind CSS classes                  | Write custom CSS files        |
| Mobile-first with `sm:`, `md:`, `lg:`     | Desktop-first design          |
| Tailwind's spacing scale (`p-4`, `gap-2`) | Arbitrary values (`p-[17px]`) |

### Accessibility

> **Important:** All features must be accessible to users with disabilities.

- **ARIA labels** — All interactive elements must have accessible names
- **Keyboard navigation** — All features must be keyboard accessible
- **Focus indicators** — Visible focus states on all interactive elements
- **Screen reader support** — Use `aria-live` for dynamic content

---

## Making Changes

### Branch Naming

```
feature/add-token-support
fix/balance-refresh-bug
docs/update-readme
chore/update-dependencies
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):

| Type       | Description                                             |
| ---------- | ------------------------------------------------------- |
| `feat`     | New feature                                             |
| `fix`      | Bug fix                                                 |
| `docs`     | Documentation only                                      |
| `style`    | Formatting, no code change                              |
| `refactor` | Code change that neither fixes a bug nor adds a feature |
| `test`     | Adding tests                                            |
| `chore`    | Maintenance tasks                                       |

```bash
# Examples
feat: add USDC token support
fix: resolve balance refresh on disconnect
docs: update installation instructions
style: improve mobile responsiveness
refactor: extract validation logic to hook
```

### Code Changes Checklist

Before submitting, ensure:

- [ ] `pnpm build` passes without errors
- [ ] `pnpm lint` shows no warnings
- [ ] All new functions have JSDoc comments
- [ ] Component props are documented
- [ ] Error states are handled with user-friendly messages
- [ ] Mobile responsive (test at 375px width)
- [ ] Accessible (keyboard navigation works)

---

## Testing

### Manual Testing Checklist

#### Passkey Flow

- [ ] New passkey creation works
- [ ] Existing passkey login works
- [ ] Session persists on page refresh
- [ ] Disconnect clears session

#### Transfer Flow

- [ ] Address validation shows errors
- [ ] Amount validation works
- [ ] USDC (gasless) transfer succeeds
- [ ] SOL fee transfer succeeds
- [ ] Explorer link opens correctly

#### Cross-Browser

| Browser | Platform    | Status      |
| ------- | ----------- | ----------- |
| Chrome  | Desktop     | Required    |
| Safari  | Desktop/iOS | Required    |
| Firefox | Desktop     | Required    |
| Edge    | Desktop     | Recommended |

### Getting Test SOL

1. Visit [Solana Faucet](https://faucet.solana.com)
2. Enter your smart wallet address
3. Request devnet SOL

---

## Submitting Changes

### Pull Request Process

1. **Fork the repository**
2. **Create a feature branch** from `main`
3. **Make your changes** following the code standards
4. **Test thoroughly** using the manual testing checklist
5. **Push to your fork**
6. **Open a Pull Request**

### PR Template

When opening a PR, use this template:

```markdown
## Summary

Brief description of changes

## Changes

- Added feature X
- Fixed bug Y
- Updated documentation Z

## Testing

- [ ] Tested on Chrome
- [ ] Tested on Safari
- [ ] Tested on mobile
- [ ] All lint checks pass
- [ ] Build succeeds

## Screenshots

(if applicable)
```

### Review Process

1. A maintainer will review your PR
2. Address any requested changes
3. Once approved, your PR will be merged

> **Note:** PRs that don't follow the code standards or fail CI checks may be closed without review.

---

## Security

### Reporting Vulnerabilities

> **Warning:** Do NOT report security vulnerabilities through public GitHub issues.

If you discover a security vulnerability:

1. **Do not** create a public issue
2. Email the maintainers directly (if available) or use GitHub's private vulnerability reporting
3. Include steps to reproduce the vulnerability
4. Allow time for the issue to be addressed before public disclosure

### Security Best Practices

When contributing, ensure:

- [ ] No secrets or API keys committed
- [ ] No `eval()` or dynamic code execution
- [ ] User inputs are validated and sanitized
- [ ] External URLs are verified before use

---

## Getting Help

| Resource      | Link                                                                      |
| ------------- | ------------------------------------------------------------------------- |
| LazorKit Docs | [docs.lazorkit.com](https://docs.lazorkit.com)                            |
| Solana Docs   | [docs.solana.com](https://docs.solana.com)                                |
| Issues        | [GitHub Issues](https://github.com/your-username/lazorkit-example/issues) |

### Questions?

- **Bug reports** — Open an issue with the `bug` label
- **Feature requests** — Open an issue with the `enhancement` label
- **Questions** — Open a discussion or check existing issues first

---

## Recognition

Contributors who submit accepted PRs will be:

- Listed in our contributors section
- Credited in release notes for significant contributions

---

## License

By contributing, you agree that your contributions will be licensed under the same license as the project (MIT).

---

**Thank you for contributing!** Your efforts help make LazorKit more accessible to developers everywhere.
