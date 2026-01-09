/**
 * Environment variable validation
 * Fails fast if required variables are missing
 */

function getEnvVar(key: string, required = true): string {
  const value = process.env[key];

  if (required && !value) {
    throw new Error(
      `Missing required environment variable: ${key}\n` +
      `Copy .env.local.example to .env.local and fill in the values.`
    );
  }

  return value ?? "";
}

// Validated environment variables
export const env = {
  RPC_URL: getEnvVar("NEXT_PUBLIC_RPC_URL"),
  PORTAL_URL: getEnvVar("NEXT_PUBLIC_PORTAL_URL"),
  PAYMASTER_URL: getEnvVar("NEXT_PUBLIC_PAYMASTER_URL"),
} as const;

// Type-safe access
export type Env = typeof env;
