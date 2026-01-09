"use client";

import { useState } from "react";
import { PaymentWidget } from "@/components/payment";
import { PaymentResult } from "@/hooks/usePayment";

// Merchant wallet address for receiving payments
const DEMO_MERCHANT_ADDRESS = "2eT2TLGDRmP5KzCKcbZTnW9XDYiPMjB3TcmA9ofkMKLG";

export default function PaymentWidgetPage() {
  // Demo configuration state
  const [config, setConfig] = useState({
    fixedAmount: true,
    amount: 0.01,
    enableGasless: true,
  });

  // Track successful payments for demo
  const [lastPayment, setLastPayment] = useState<PaymentResult | null>(null);

  const handleSuccess = (result: PaymentResult) => {
    setLastPayment(result);
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">
          Tutorial 3: Payment Widget
        </h1>
        <p className="mt-2 text-base text-gray-600 sm:text-lg">
          A drop-in payment component for merchants to accept SOL payments with
          passkey authentication.
        </p>
      </div>

      <div className="grid gap-6 sm:gap-8 lg:grid-cols-2">
        {/* Left Column - Live Demo */}
        <div className="space-y-4 sm:space-y-6">
          {/* Demo Widget */}
          <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-gray-900">
              Live Demo
            </h2>
            <PaymentWidget
              merchantAddress={DEMO_MERCHANT_ADDRESS}
              merchantName="Coffee Shop"
              description="Premium Coffee (Large)"
              amount={config.fixedAmount ? config.amount : undefined}
              allowCustomAmount={!config.fixedAmount}
              enableGasless={config.enableGasless}
              onPaymentSuccess={handleSuccess}
            />
          </div>

          {/* Configuration Panel */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-base font-semibold text-gray-900 sm:text-lg">
              Try Different Configurations
            </h2>
            <div className="space-y-4">
              {/* Fixed vs Custom Amount */}
              <div>
                <label className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={config.fixedAmount}
                    onChange={(e) =>
                      setConfig({ ...config, fixedAmount: e.target.checked })
                    }
                    className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                  />
                  <span className="text-sm text-gray-700">
                    Fixed amount ({config.amount} SOL)
                  </span>
                </label>
                {config.fixedAmount && (
                  <div className="ml-7 mt-2">
                    <input
                      type="range"
                      min="0.001"
                      max="0.1"
                      step="0.001"
                      value={config.amount}
                      onChange={(e) =>
                        setConfig({ ...config, amount: parseFloat(e.target.value) })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0.001 SOL</span>
                      <span>0.1 SOL</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Enable Gasless */}
              <label className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={config.enableGasless}
                  onChange={(e) =>
                    setConfig({ ...config, enableGasless: e.target.checked })
                  }
                  className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  Enable gasless (USDC fees)
                </span>
              </label>
            </div>
          </div>

          {/* Last Payment Info */}
          {lastPayment && (
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <h3 className="font-medium text-green-800">Last Payment</h3>
              <p className="mt-1 text-sm text-green-700">
                {lastPayment.amount} {lastPayment.currency} at{" "}
                {new Date(lastPayment.timestamp).toLocaleTimeString()}
              </p>
              <a
                href={lastPayment.explorerUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-block text-sm text-green-600 hover:underline"
              >
                View on Explorer →
              </a>
            </div>
          )}
        </div>

        {/* Right Column - Instructions */}
        <div className="space-y-4 sm:space-y-6">
          {/* How to Integrate */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              How to Integrate
            </h2>
            <div className="space-y-4">
              <div className="-mx-4 rounded-lg bg-gray-900 p-3 sm:mx-0 sm:p-4">
                <pre className="overflow-x-auto text-xs text-gray-100 sm:text-sm">
                  <code>{`import { PaymentWidget }
  from "@/components/payment";

<PaymentWidget
  merchantAddress="YOUR_WALLET"
  merchantName="Your Store"
  description="Product description"
  amount={0.05}
  enableGasless
  onPaymentSuccess={(result) => {
    console.log("Paid!",
      result.signature);
  }}
/>`}</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Props Reference */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Widget Props
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-2 sm:flex-row sm:justify-between sm:gap-0">
                <code className="text-purple-600">merchantAddress</code>
                <span className="text-gray-500">string (required)</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-2 sm:flex-row sm:justify-between sm:gap-0">
                <code className="text-purple-600">amount</code>
                <span className="text-gray-500">number</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-2 sm:flex-row sm:justify-between sm:gap-0">
                <code className="text-purple-600">merchantName</code>
                <span className="text-gray-500">string</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-2 sm:flex-row sm:justify-between sm:gap-0">
                <code className="text-purple-600">description</code>
                <span className="text-gray-500">string</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-2 sm:flex-row sm:justify-between sm:gap-0">
                <code className="text-purple-600">enableGasless</code>
                <span className="text-gray-500">boolean</span>
              </div>
              <div className="flex flex-col gap-1 border-b border-gray-100 pb-2 sm:flex-row sm:justify-between sm:gap-0">
                <code className="text-purple-600">allowCustomAmount</code>
                <span className="text-gray-500">boolean</span>
              </div>
              <div className="flex flex-col gap-1 sm:flex-row sm:justify-between sm:gap-0">
                <code className="text-purple-600">onPaymentSuccess</code>
                <span className="text-gray-500">function</span>
              </div>
            </div>
          </div>

          {/* Use Cases */}
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <h2 className="mb-4 text-xl font-semibold text-gray-900">
              Use Cases
            </h2>
            <div className="grid grid-cols-2 gap-2 sm:gap-3">
              <div className="rounded-lg bg-purple-50 p-2 text-center sm:p-3">
                <span className="text-xl sm:text-2xl">🛒</span>
                <p className="mt-1 text-xs font-medium text-purple-800 sm:text-sm">
                  E-commerce
                </p>
                <p className="text-xs text-purple-600">Checkout</p>
              </div>
              <div className="rounded-lg bg-green-50 p-2 text-center sm:p-3">
                <span className="text-xl sm:text-2xl">💰</span>
                <p className="mt-1 text-xs font-medium text-green-800 sm:text-sm">
                  Donations
                </p>
                <p className="text-xs text-green-600">Tip jars</p>
              </div>
              <div className="rounded-lg bg-blue-50 p-2 text-center sm:p-3">
                <span className="text-xl sm:text-2xl">🎮</span>
                <p className="mt-1 text-xs font-medium text-blue-800 sm:text-sm">Gaming</p>
                <p className="text-xs text-blue-600">In-app</p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2 text-center sm:p-3">
                <span className="text-xl sm:text-2xl">📱</span>
                <p className="mt-1 text-xs font-medium text-amber-800 sm:text-sm">
                  Mobile
                </p>
                <p className="text-xs text-amber-600">Quick pay</p>
              </div>
            </div>
          </div>

          {/* Features */}
          <div className="rounded-lg border border-purple-200 bg-purple-50 p-4 sm:p-6">
            <h2 className="mb-4 text-lg font-semibold text-purple-800 sm:text-xl">
              Widget Features
            </h2>
            <ul className="space-y-2 text-xs text-purple-700 sm:text-sm">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-500">✓</span>
                <span>
                  <strong>Gasless Payments</strong> - Paymaster sponsors fees
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-500">✓</span>
                <span>
                  <strong>Passkey Auth</strong> - Biometric signing, no seed phrases
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-500">✓</span>
                <span>
                  <strong>Customizable</strong> - Branding, amounts, callbacks
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 text-purple-500">✓</span>
                <span>
                  <strong>Real-time Status</strong> - Processing, success, error
                </span>
              </li>
            </ul>
          </div>

          {/* Get Test SOL */}
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 sm:p-6">
            <h2 className="mb-2 text-lg font-semibold text-amber-800">
              Need Test SOL?
            </h2>
            <p className="text-sm text-amber-700">
              Get free devnet SOL from the Solana faucet to test payments.
            </p>
            <a
              href="https://faucet.solana.com"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-amber-700 hover:underline"
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
        </div>
      </div>
    </div>
  );
}
