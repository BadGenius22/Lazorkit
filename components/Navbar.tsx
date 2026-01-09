"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "./ConnectButton";

/** Navigation links configuration */
const navLinks = [
  { href: "/", label: "Home" },
  { href: "/passkey-login", label: "Passkey Login" },
  { href: "/gasless-transfer", label: "Gasless Transfer" },
  { href: "/payment-widget", label: "Payment Widget" },
];

/**
 * Application navigation bar
 *
 * @description
 * Responsive navigation component with:
 * - **Logo**: Links to homepage with brand styling
 * - **Nav Links**: Tutorial page links with active state highlighting
 * - **Connect Button**: Wallet connection integrated on the right
 *
 * Desktop shows full horizontal nav, mobile shows stacked layout.
 *
 * @example
 * ```tsx
 * // Used in app/layout.tsx
 * <body>
 *   <Navbar />
 *   <main>{children}</main>
 * </body>
 * ```
 *
 * @returns Navigation bar component
 */
export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo / Brand */}
          <div className="flex items-center gap-8">
            <Link href="/" className="text-xl font-bold text-gray-900">
              <span className="text-purple-600">Lazor</span>Kit
              <span className="ml-1 text-sm font-normal text-gray-500">
                Example
              </span>
            </Link>

            {/* Navigation Links */}
            <div className="hidden items-center gap-1 md:flex">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-purple-50 text-purple-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Connect Button */}
          <ConnectButton />
        </div>

        {/* Mobile Navigation */}
        <div className="flex gap-1 overflow-x-auto pb-3 md:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-purple-50 text-purple-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
