import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Hero Section */}
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          <span className="text-purple-600">Lazor</span>Kit SDK
          <span className="block text-purple-600">Integration Example</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
          A practical code example demonstrating passkey-based wallet creation
          and gasless transactions on Solana. No seed phrases, just biometrics.
        </p>
      </div>

      {/* Feature Cards */}
      <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Tutorial 1 */}
        <Link
          href="/passkey-login"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-purple-500 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 text-purple-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-purple-600">
            Tutorial 1: Passkey Login
          </h2>
          <p className="mt-2 text-gray-600">
            Create a Solana wallet using Face ID, Touch ID, or Windows Hello. No
            seed phrases required.
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-purple-600">
            Get Started
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>

        {/* Tutorial 2 */}
        <Link
          href="/gasless-transfer"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-green-500 hover:shadow-md"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-green-600">
            Tutorial 2: Gasless Transfer
          </h2>
          <p className="mt-2 text-gray-600">
            Send SOL without paying gas fees. Pay transaction fees with USDC via
            Paymaster.
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-green-600">
            Try It Out
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>

        {/* Tutorial 3 */}
        <Link
          href="/payment-widget"
          className="group rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-amber-500 hover:shadow-md sm:col-span-2 lg:col-span-1"
        >
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-amber-100 text-amber-600">
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 group-hover:text-amber-600">
            Tutorial 3: Payment Widget
          </h2>
          <p className="mt-2 text-gray-600">
            Drop-in payment component for merchants. Accept SOL with QR codes and
            passkey authentication.
          </p>
          <div className="mt-4 flex items-center text-sm font-medium text-amber-600">
            Explore Widget
            <svg
              className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      </div>

      {/* How It Works */}
      <div className="mt-16">
        <h2 className="text-center text-2xl font-bold text-gray-900">
          How It Works
        </h2>
        <div className="mt-8 grid gap-8 sm:grid-cols-3">
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
              1
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">
              Connect with Passkey
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Use your device&apos;s biometrics to create a secure wallet
              instantly.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
              2
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">
              Smart Wallet Created
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              A Solana PDA is derived from your passkey - no seed phrase needed.
            </p>
          </div>
          <div className="text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-xl font-bold text-purple-600">
              3
            </div>
            <h3 className="mt-4 font-semibold text-gray-900">
              Gasless Transactions
            </h3>
            <p className="mt-2 text-sm text-gray-600">
              Send tokens without SOL for gas - Paymaster handles the fees.
            </p>
          </div>
        </div>
      </div>

      {/* Tech Stack */}
      <div className="mt-16 rounded-xl border border-gray-200 bg-gray-50 p-6">
        <h2 className="text-lg font-semibold text-gray-900">Built With</h2>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            "Next.js 16",
            "TypeScript",
            "Tailwind CSS",
            "@lazorkit/wallet",
            "@solana/web3.js",
            "WebAuthn",
          ].map((tech) => (
            <span
              key={tech}
              className="rounded-full bg-white px-3 py-1 text-sm text-gray-700 shadow-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
