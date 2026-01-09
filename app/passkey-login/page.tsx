"use client";

import { useWallet } from "@lazorkit/wallet";
import { ConnectButton } from "@/components/ConnectButton";
import { WalletInfo } from "@/components/WalletInfo";

export default function PasskeyLoginPage() {
  const { isConnected } = useWallet();

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Tutorial 1: Passkey Login
        </h1>
        <p className="mt-2 text-lg text-gray-600">
          Create a Solana wallet using your device&apos;s biometrics - no seed
          phrase required.
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Interactive Demo */}
        <div className="space-y-6">
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Try It Out
            </h2>

            {isConnected ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-green-600">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="font-medium">Wallet Connected!</span>
                </div>
                <WalletInfo />
                <p className="text-sm text-gray-600">
                  Your passkey has been created and stored securely on your
                  device. You can now use it to sign transactions.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Click the button below to create your passkey wallet. Your
                  device will prompt you for biometric authentication.
                </p>
                <ConnectButton />
              </div>
            )}
          </div>

          {/* What is a Passkey? */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              What is a Passkey?
            </h2>
            <p className="text-gray-600">
              Passkeys are a modern replacement for passwords. They use your
              device&apos;s built-in biometric authentication (Face ID, Touch
              ID, Windows Hello) to create cryptographic credentials that are:
            </p>
            <ul className="mt-4 space-y-2 text-gray-600">
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-500">&#10003;</span>
                <span>
                  <strong>Phishing-resistant</strong> - Bound to the specific
                  website
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-500">&#10003;</span>
                <span>
                  <strong>Hardware-backed</strong> - Stored in secure enclave
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-1 text-green-500">&#10003;</span>
                <span>
                  <strong>User-friendly</strong> - No seed phrases to remember
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column - Instructions */}
        <div className="space-y-6">
          {/* Step by Step */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              How It Works
            </h2>
            <ol className="space-y-4">
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
                  1
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Click &quot;Connect Wallet&quot;
                  </h3>
                  <p className="text-sm text-gray-600">
                    This initiates the WebAuthn passkey creation flow.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
                  2
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">
                    Authenticate with Biometrics
                  </h3>
                  <p className="text-sm text-gray-600">
                    Use Face ID, Touch ID, or Windows Hello to verify your
                    identity.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-100 text-sm font-medium text-purple-600">
                  3
                </span>
                <div>
                  <h3 className="font-medium text-gray-900">Wallet Created!</h3>
                  <p className="text-sm text-gray-600">
                    A smart wallet is derived from your passkey. Your address is
                    displayed above.
                  </p>
                </div>
              </li>
            </ol>
          </div>

          {/* Technical Details */}
          <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Under the Hood
            </h2>
            <div className="space-y-3 text-sm text-gray-600">
              <p>
                <strong className="text-gray-900">1. Passkey Creation:</strong>{" "}
                WebAuthn API creates a P-256 key pair stored in your
                device&apos;s secure enclave.
              </p>
              <p>
                <strong className="text-gray-900">
                  2. Smart Wallet Derivation:
                </strong>{" "}
                LazorKit derives a Solana PDA (Program Derived Address) from
                your passkey&apos;s public key.
              </p>
              <p>
                <strong className="text-gray-900">3. Session Token:</strong> A
                session token is stored locally for auto-reconnect on page
                refresh.
              </p>
            </div>
          </div>

          {/* Troubleshooting */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
            <h2 className="mb-4 text-xl font-semibold text-amber-800">
              Troubleshooting
            </h2>
            <ul className="space-y-2 text-sm text-amber-700">
              <li>
                <strong>Biometric prompt not appearing?</strong> Make sure
                you&apos;re using a supported browser (Chrome, Safari, Firefox,
                Edge).
              </li>
              <li>
                <strong>Using a desktop without biometrics?</strong> You can use
                a security key (YubiKey) or your phone as an authenticator.
              </li>
              <li>
                <strong>Connection failed?</strong> Try refreshing the page and
                attempting again. Check your internet connection.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
