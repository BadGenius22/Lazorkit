"use client";

import { useWallet } from "@lazorkit/wallet";
import { ConnectButton } from "@/components/ConnectButton";
import { WalletInfo } from "@/components/WalletInfo";
import { TransferForm } from "@/components/TransferForm";
import Link from "next/link";

export default function GaslessTransferPage() {
  const { isConnected } = useWallet();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tutorial 2: Gasless Transfer
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Send SOL without paying gas fees - Paymaster covers transaction costs
          with USDC.
        </p>
      </div>

      {/* Connection Guard */}
      {!isConnected ? (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-amber-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="mt-4 text-xl font-semibold text-amber-800">
            Wallet Not Connected
          </h2>
          <p className="mt-2 text-amber-700">
            Please connect your wallet to use the gasless transfer feature.
          </p>
          <div className="mt-6 flex flex-col items-center gap-3">
            <ConnectButton />
            <span className="text-sm text-amber-600">or</span>
            <Link
              href="/passkey-login"
              className="text-sm font-medium text-amber-700 hover:underline"
            >
              Learn how to create a passkey wallet →
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Left Column - Transfer Form */}
          <div className="space-y-6">
            {/* Wallet Info */}
            <WalletInfo />

            {/* Transfer Form */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                Send SOL
              </h2>
              <TransferForm />
            </div>
          </div>

          {/* Right Column - Instructions */}
          <div className="space-y-6">
            {/* How Gasless Works */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                How Gasless Works
              </h2>
              <ol className="space-y-4">
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600">
                    1
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      You Create a Transaction
                    </h3>
                    <p className="text-sm text-gray-600">
                      Enter recipient address and amount, select USDC for fees.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600">
                    2
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Paymaster Sponsors Gas
                    </h3>
                    <p className="text-sm text-gray-600">
                      The Paymaster service pays SOL gas fees on your behalf.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600">
                    3
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Sign with Passkey
                    </h3>
                    <p className="text-sm text-gray-600">
                      Authenticate with biometrics to authorize the transaction.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-sm font-medium text-green-600">
                    4
                  </span>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Transaction Confirmed
                    </h3>
                    <p className="text-sm text-gray-600">
                      SOL is transferred without you paying any gas fees!
                    </p>
                  </div>
                </li>
              </ol>
            </div>

            {/* What is Paymaster? */}
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-gray-900">
                What is a Paymaster?
              </h2>
              <p className="text-gray-600">
                A Paymaster is a service that pays transaction fees on behalf of
                users. This enables:
              </p>
              <ul className="mt-4 space-y-2 text-gray-600">
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">&#10003;</span>
                  <span>
                    <strong>Gasless onboarding</strong> - New users don&apos;t
                    need SOL to start
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">&#10003;</span>
                  <span>
                    <strong>Better UX</strong> - No need to manage multiple
                    tokens
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 text-green-500">&#10003;</span>
                  <span>
                    <strong>Flexible fees</strong> - Pay with USDC or other
                    tokens
                  </span>
                </li>
              </ul>
            </div>

            {/* Get Test SOL */}
            <div className="rounded-lg border border-purple-200 bg-purple-50 p-6">
              <h2 className="mb-2 text-lg font-semibold text-purple-800">
                Need Test SOL?
              </h2>
              <p className="text-sm text-purple-700">
                Get free devnet SOL from the Solana faucet to test transfers.
              </p>
              <a
                href="https://faucet.solana.com"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-purple-700 hover:underline"
              >
                Visit Solana Faucet
                <svg
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>

            {/* Troubleshooting */}
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
              <h2 className="mb-4 text-xl font-semibold text-amber-800">
                Troubleshooting
              </h2>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>
                  <strong>Transaction failed?</strong> Check that you have
                  enough SOL balance for the transfer amount.
                </li>
                <li>
                  <strong>Paymaster error?</strong> Try switching to SOL for
                  fees. The Paymaster may have rate limits on devnet.
                </li>
                <li>
                  <strong>Invalid address?</strong> Make sure you&apos;re
                  entering a valid Solana address (base58 encoded).
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
