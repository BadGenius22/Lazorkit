# LazorKit SDK Integration Example

A practical code example demonstrating passkey-based wallet creation and gasless transactions on Solana using the LazorKit SDK. No seed phrases required - just biometrics.

## Features

- **Passkey Authentication** - Create Solana wallets using Face ID, Touch ID, or Windows Hello
- **Gasless Transactions** - Send SOL without paying gas fees (Paymaster covers costs)
- **Smart Wallet** - Program Derived Address (PDA) derived from your passkey
- **Session Persistence** - Stay connected across page refreshes
- **Modern Stack** - Built with Next.js 16, TypeScript, and Tailwind CSS

## Live Demo

**[View Live Demo](https://lazorkit-example.vercel.app)** (Coming soon after deployment)

## Tech Stack

| Technology        | Version | Purpose                         |
| ----------------- | ------- | ------------------------------- |
| Next.js           | 16.1.1  | React framework with App Router |
| TypeScript        | 5.x     | Type safety                     |
| Tailwind CSS      | 4.x     | Styling                         |
| @lazorkit/wallet  | 2.0.1   | Passkey wallet SDK              |
| @solana/web3.js   | 1.98.4  | Solana blockchain interaction   |
| @coral-xyz/anchor | 0.32.1  | Solana program framework        |
| React             | 19.2.3  | UI library                      |

## Prerequisites

Before you begin, ensure you have:

- **Node.js 20+** - [Download](https://nodejs.org/)
- **pnpm 8+** - `npm install -g pnpm`
- **WebAuthn-compatible browser**:
  - Chrome 108+
  - Safari 16+
  - Firefox 122+
  - Edge 108+
- **Device with biometrics** (Face ID, Touch ID, Windows Hello) or a security key

## Quick Start

### 1. Clone the repository

```bash
git clone https://github.com/BadGenius22/Lazorkit.git
cd Lazorkit
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_RPC_URL=https://api.devnet.solana.com
NEXT_PUBLIC_PORTAL_URL=https://portal.lazor.sh
NEXT_PUBLIC_PAYMASTER_URL=https://kora.devnet.lazorkit.com
```

### 4. Start the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
Lazorkit/
├── app/                      # Next.js App Router pages
│   ├── layout.tsx            # Root layout with providers
│   ├── page.tsx              # Homepage
│   ├── providers.tsx         # LazorkitProvider wrapper
│   ├── globals.css           # Global styles
│   ├── passkey-login/        # Tutorial 1: Passkey authentication
│   │   └── page.tsx
│   └── gasless-transfer/     # Tutorial 2: Gasless transactions
│       └── page.tsx
├── components/               # Reusable UI components
│   ├── ConnectButton.tsx     # Wallet connect/disconnect button
│   ├── Navbar.tsx            # Navigation header
│   ├── TransferForm.tsx      # SOL transfer form
│   ├── WalletInfo.tsx        # Balance & address display
│   └── Skeleton.tsx          # Loading placeholders
├── hooks/                    # Custom React hooks
│   └── useBalance.ts         # SOL balance fetching
├── lib/                      # Utilities and constants
│   ├── constants.ts          # Config exports, helpers
│   └── env.ts                # Environment validation
├── docs/                     # Tutorial documentation
│   ├── 01-passkey-login.md   # Passkey tutorial
│   └── 02-gasless-transfer.md # Gasless tutorial
└── next.config.ts            # Next.js + Buffer polyfill
```

## Tutorials

### Tutorial 1: Passkey Login

Learn how to create a Solana wallet using device biometrics.

**[Read Tutorial 1 Documentation](docs/01-passkey-login.md)**

Key concepts:

- WebAuthn/FIDO2 passkey creation
- Smart wallet derivation from passkey
- Session persistence

### Tutorial 2: Gasless Transfer

Send SOL without paying gas fees using the Paymaster service.

**[Read Tutorial 2 Documentation](docs/02-gasless-transfer.md)**

Key concepts:

- Building transfer instructions
- Paymaster-sponsored transactions
- Fee token selection (USDC vs SOL)

## SDK Reference

### Provider Setup

```tsx
// app/providers.tsx
import { LazorkitProvider } from "@lazorkit/wallet";

export function Providers({ children }) {
  return (
    <LazorkitProvider
      rpcUrl={process.env.NEXT_PUBLIC_RPC_URL}
      portalUrl={process.env.NEXT_PUBLIC_PORTAL_URL}
      paymasterConfig={{ paymasterUrl: process.env.NEXT_PUBLIC_PAYMASTER_URL }}
    >
      {children}
    </LazorkitProvider>
  );
}
```

### useWallet Hook

```tsx
import { useWallet } from "@lazorkit/wallet";

function MyComponent() {
  const {
    connect, // Trigger passkey creation/login
    disconnect, // Clear session
    isConnected, // Boolean - wallet connected
    isConnecting, // Boolean - connection in progress
    smartWalletPubkey, // PublicKey - derived wallet address
    signAndSendTransaction, // Send transactions
  } = useWallet();
}
```

### Gasless Transaction

```tsx
import { SystemProgram, LAMPORTS_PER_SOL } from "@solana/web3.js";

const signature = await signAndSendTransaction({
  instructions: [
    SystemProgram.transfer({
      fromPubkey: smartWalletPubkey,
      toPubkey: recipientPubkey,
      lamports: 0.1 * LAMPORTS_PER_SOL,
    }),
  ],
  transactionOptions: {
    feeToken: "USDC", // Paymaster pays gas in USDC
  },
});
```

## Environment Variables

| Variable                    | Description                   | Default                            |
| --------------------------- | ----------------------------- | ---------------------------------- |
| `NEXT_PUBLIC_RPC_URL`       | Solana RPC endpoint           | `https://api.devnet.solana.com`    |
| `NEXT_PUBLIC_PORTAL_URL`    | LazorKit Portal service       | `https://portal.lazor.sh`          |
| `NEXT_PUBLIC_PAYMASTER_URL` | Paymaster service for gasless | `https://kora.devnet.lazorkit.com` |

## Commands

```bash
# Development
pnpm dev          # Start dev server at localhost:3000
pnpm build        # Production build
pnpm start        # Run production build
pnpm lint         # ESLint check

# Deployment
vercel            # Deploy preview
vercel --prod     # Deploy production
```

## Deployment

### Deploy to Vercel

1. Install Vercel CLI:

   ```bash
   pnpm add -g vercel
   ```

2. Login and deploy:

   ```bash
   vercel login
   vercel
   ```

3. Add environment variables in Vercel dashboard:

   - `NEXT_PUBLIC_RPC_URL`
   - `NEXT_PUBLIC_PORTAL_URL`
   - `NEXT_PUBLIC_PAYMASTER_URL`

4. Deploy to production:
   ```bash
   vercel --prod
   ```

## Troubleshooting

### Biometric prompt not appearing

- Ensure you're using a supported browser (Chrome, Safari, Firefox, Edge)
- Check that your device has biometrics enabled
- On desktop without biometrics, use a security key or phone authenticator

### "Buffer is not defined" error

The Buffer polyfill should be configured in `next.config.ts`. If you see this error:

1. Ensure `buffer` package is installed
2. Check the webpack/turbopack config in `next.config.ts`
3. Verify the Buffer global is set in `providers.tsx`

### Paymaster errors

- The Paymaster service may have rate limits on devnet
- Try switching to SOL for fees instead of USDC
- Check that your wallet has sufficient balance

### Transaction failed

- Verify the recipient address is a valid Solana address
- Ensure you have enough SOL balance for the transfer amount
- Check the Solana devnet status

### Session not persisting

- Clear browser cache and try again
- Ensure cookies/localStorage are enabled
- Try a different browser

## Getting Test SOL

Visit the [Solana Faucet](https://faucet.solana.com) to get free devnet SOL for testing.

## Resources

- [LazorKit Documentation](https://docs.lazorkit.com/)
- [LazorKit GitHub](https://github.com/lazor-kit/lazor-kit)
- [Solana Explorer (Devnet)](https://explorer.solana.com/?cluster=devnet)
- [Solana Web3.js Docs](https://solana-labs.github.io/solana-web3.js/)
- [WebAuthn Guide](https://webauthn.guide/)

## License

MIT

## Author

Dewangga Praxindo
Built for the [Superteam LazorKit Integration Contest](https://earn.superteam.fun/listing/integrate-passkey-technology-with-lazorkit-to-10x-solana-ux)
