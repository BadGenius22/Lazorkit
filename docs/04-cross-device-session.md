# Tutorial 4: Cross-Device Session Persistence

<div align="center">

![Difficulty](https://img.shields.io/badge/Difficulty-Intermediate-yellow?style=flat-square)
![Time](https://img.shields.io/badge/Time-20%20min-blue?style=flat-square)
![Prerequisites](https://img.shields.io/badge/Prerequisites-Tutorial%201-orange?style=flat-square)

**Access your passkey wallet from any device using platform sync - no seed phrases to transfer.**

[Live Demo](https://lazorkit-lovat.vercel.app/cross-device) | [Source Code](../app/cross-device)

</div>

---

## Table of Contents

- [Introduction](#introduction)
- [How Cross-Device Sync Works](#how-cross-device-sync-works)
- [Cross-Device Flow](#cross-device-flow)
- [Implementation](#implementation)
- [Platform Sync Comparison](#platform-sync-comparison)
- [Common Issues](#common-issues)
- [Security Considerations](#security-considerations)
- [Best Practices](#best-practices)
- [Next Steps](#next-steps)

---

## Introduction

One of the most powerful features of passkey-based wallets is **cross-device access**. Unlike traditional crypto wallets where you must carefully back up and restore seed phrases, passkeys can automatically sync across your devices through platform ecosystems like iCloud Keychain, Google Password Manager, or Windows Hello.

### What You'll Learn

| Topic | Description |
|-------|-------------|
| 🔄 Platform Sync | How passkeys sync across devices |
| 🔀 Session vs Passkey | The difference between what syncs and what doesn't |
| 🛠️ Implementation | Building cross-device wallet access |
| 🔧 Edge Cases | Handling troubleshooting sync issues |
| ✨ Best Practices | Multi-device UX recommendations |

### Prerequisites

| Requirement | Notes |
|-------------|-------|
| [Tutorial 1: Passkey Login](./01-passkey-login.md) | Must be completed |
| WebAuthn/FIDO2 basics | Understanding of passkeys |
| Platform authenticator | Face ID, Touch ID, or Windows Hello |

---

## How Cross-Device Sync Works

### Platform Ecosystem Sync

Passkeys automatically sync through your platform's credential manager:

<table>
<tr>
<td width="33%" align="center">

### Apple

**iCloud Keychain**

iPhone, iPad, Mac

</td>
<td width="33%" align="center">

### Google

**Password Manager**

Android, Chrome (any OS)

</td>
<td width="33%" align="center">

### Windows

**Windows Hello**

Windows 10/11 devices

</td>
</tr>
</table>

### What Syncs vs What Doesn't

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         SYNC COMPARISON                                     │
└─────────────────────────────────────────────────────────────────────────────┘

  ┌─────────────────────────────────┐    ┌─────────────────────────────────┐
  │     ✅ PASSKEY (Syncs)          │    │  ❌ SESSION (Does NOT Sync)     │
  ├─────────────────────────────────┤    ├─────────────────────────────────┤
  │                                 │    │                                 │
  │  • Cryptographic key pair       │    │  • localStorage tokens          │
  │  • Website/app origin           │    │  • Session cookies              │
  │  • User identifier              │    │  • App-specific cached data     │
  │  • Credential metadata          │    │                                 │
  │                                 │    │                                 │
  │  Stored in: iCloud/Google/MS    │    │  Stored in: Browser only        │
  │                                 │    │                                 │
  └─────────────────────────────────┘    └─────────────────────────────────┘
```

> **Key insight:** The passkey itself syncs across devices, but your app's session data (stored in localStorage) does not. Users can authenticate on any synced device, but they'll need to "reconnect" on each new device.

---

## Cross-Device Flow

### Scenario: iPhone → MacBook

```
┌─────────────────────────────────────────────────────────────────────────────┐
│              CROSS-DEVICE WALLET ACCESS FLOW                                │
└─────────────────────────────────────────────────────────────────────────────┘

  📱 iPhone (Original)              ☁️ iCloud              💻 MacBook (New)
  ─────────────────────            ─────────              ─────────────────

  1. Create passkey    ────────►   Passkey    ────────►   2. Visit app
     wallet                        syncs                     (no session)
        │                            │                           │
        │                            │                           ▼
        ▼                            │                     3. Click "Connect"
  Wallet: 7xKp...3mNq               │                           │
                                     │                           ▼
                                     │                     4. Passkey picker
                                     │                        shows synced
                                     │                        passkeys
                                     │                           │
                                     └──────────────────────────►│
                                                                 ▼
                                                           5. Select passkey
                                                              & authenticate
                                                                 │
                                                                 ▼
                                                           6. Same wallet!
                                                              7xKp...3mNq ✅
```

### The Magic: Same Passkey = Same Wallet

Because the wallet address is **derived from the passkey's public key**, using the same passkey on any device always produces the same wallet address.

```typescript
// On iPhone (original device)
const walletAddress = deriveFromPasskey(passkey.publicKey);
// Result: "7xKp...3mNq"

// On MacBook (synced passkey)
const walletAddress = deriveFromPasskey(passkey.publicKey);
// Result: "7xKp...3mNq"  ← Same address! No seed phrase needed!
```

---

## Implementation

### Step 1: Auto-Reconnect Detection

```tsx
// components/CrossDeviceConnect.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

export function CrossDeviceConnect() {
  const { connect, isConnected, isConnecting } = useWallet();
  const [isNewDevice, setIsNewDevice] = useState(false);

  useEffect(() => {
    // Check if this appears to be a new device (no cached session)
    const hasSession = localStorage.getItem("lazorkit_session");
    if (!hasSession && !isConnected) {
      setIsNewDevice(true);
    }
  }, [isConnected]);

  if (isConnected || !isNewDevice) {
    return null;
  }

  return (
    <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h3 className="font-medium text-blue-800">
        Have an existing wallet?
      </h3>
      <p className="text-sm text-blue-600 mt-1">
        If you created a passkey wallet on another device, you can access it here.
        Your passkey syncs automatically through iCloud, Google, or Windows.
      </p>
      <button
        onClick={connect}
        disabled={isConnecting}
        className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-lg"
      >
        {isConnecting ? "Connecting..." : "Connect Existing Wallet"}
      </button>
    </div>
  );
}
```

---

### Step 2: Handle Passkey Selection

```tsx
// components/PasskeySelector.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useState } from "react";

export function PasskeySelector() {
  const { connect, isConnecting } = useWallet();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    try {
      await connect();
    } catch (err) {
      const error = err as Error;

      // Handle common cross-device scenarios
      if (error.name === "NotAllowedError") {
        setError("Authentication cancelled. Please try again.");
      } else if (error.message?.includes("No credentials")) {
        setError(
          "No passkey found for this site. " +
          "Make sure your passkeys are syncing via iCloud/Google/Windows."
        );
      } else {
        setError("Failed to connect. Please try again.");
      }
    }
  };

  return (
    <div className="space-y-4">
      <button
        onClick={handleConnect}
        disabled={isConnecting}
        className="bg-purple-600 text-white px-6 py-3 rounded-lg w-full"
      >
        {isConnecting ? "Authenticating..." : "Connect with Passkey"}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <p className="text-xs text-gray-500 text-center">
        Your passkey will appear in your device's native picker.
        Select the passkey you created for this site.
      </p>
    </div>
  );
}
```

---

### Step 3: Device-Aware Connection Status

```tsx
// components/ConnectionInfo.tsx
"use client";

import { useWallet } from "@lazorkit/wallet";
import { useEffect, useState } from "react";

interface SessionMeta {
  createdAt: number;
  lastUsed: number;
  deviceHint: string;
}

export function ConnectionInfo() {
  const { isConnected, smartWalletPubkey } = useWallet();
  const [sessionMeta, setSessionMeta] = useState<SessionMeta | null>(null);

  useEffect(() => {
    if (isConnected) {
      const stored = localStorage.getItem("lazorkit_session_meta");
      const now = Date.now();

      if (stored) {
        const meta = JSON.parse(stored) as SessionMeta;
        meta.lastUsed = now;
        localStorage.setItem("lazorkit_session_meta", JSON.stringify(meta));
        setSessionMeta(meta);
      } else {
        const meta: SessionMeta = {
          createdAt: now,
          lastUsed: now,
          deviceHint: getDeviceHint(),
        };
        localStorage.setItem("lazorkit_session_meta", JSON.stringify(meta));
        setSessionMeta(meta);
      }
    }
  }, [isConnected]);

  if (!isConnected || !smartWalletPubkey) return null;

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="font-medium">Connected Wallet</h3>
      <code className="text-sm bg-gray-100 px-2 py-1 rounded block mt-2">
        {smartWalletPubkey.toString()}
      </code>
      {sessionMeta && (
        <p className="text-xs text-gray-500 mt-2">
          Connected on this {sessionMeta.deviceHint} •{" "}
          First used: {new Date(sessionMeta.createdAt).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}

function getDeviceHint(): string {
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod/.test(ua)) return "iOS device";
  if (/Mac/.test(ua)) return "Mac";
  if (/Android/.test(ua)) return "Android device";
  if (/Windows/.test(ua)) return "Windows PC";
  return "device";
}
```

---

### Step 4: Platform-Specific Sync Guide

```tsx
// components/SyncSetupGuide.tsx
"use client";

import { useState } from "react";

type Platform = "apple" | "google" | "windows" | "unknown";

export function SyncSetupGuide() {
  const [platform] = useState<Platform>(detectPlatform());

  const guides: Record<Platform, { title: string; steps: string[] }> = {
    apple: {
      title: "iCloud Keychain Sync",
      steps: [
        "Open Settings > [Your Name] > iCloud",
        "Enable 'Passwords and Keychain'",
        "Sign in with the same Apple ID on all devices",
        "Passkeys will sync automatically",
      ],
    },
    google: {
      title: "Google Password Manager Sync",
      steps: [
        "Open Chrome Settings > Passwords",
        "Ensure 'Offer to save passwords' is enabled",
        "Sign in to Chrome with your Google account",
        "Passkeys sync across Chrome on all devices",
      ],
    },
    windows: {
      title: "Windows Hello Sync",
      steps: [
        "Open Settings > Accounts > Sign-in options",
        "Set up Windows Hello (face, fingerprint, or PIN)",
        "Sign in with Microsoft account for cross-device sync",
        "Note: Windows passkey sync is limited",
      ],
    },
    unknown: {
      title: "Passkey Sync Setup",
      steps: [
        "Enable your platform's password/credential sync",
        "Sign in with the same account across devices",
        "Passkeys created here will be available on synced devices",
      ],
    },
  };

  const guide = guides[platform];

  return (
    <div className="p-6 border rounded-lg bg-gray-50">
      <h3 className="font-semibold text-lg">{guide.title}</h3>
      <ol className="mt-4 space-y-2">
        {guide.steps.map((step, i) => (
          <li key={i} className="flex gap-2 text-sm">
            <span className="font-medium text-purple-600">{i + 1}.</span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "unknown";
  const ua = navigator.userAgent;
  if (/iPhone|iPad|iPod|Mac/.test(ua)) return "apple";
  if (/Android/.test(ua) || /Chrome/.test(ua)) return "google";
  if (/Windows/.test(ua)) return "windows";
  return "unknown";
}
```

---

## Platform Sync Comparison

<table>
<tr>
<th width="25%">Feature</th>
<th width="25%">Apple</th>
<th width="25%">Google</th>
<th width="25%">Windows</th>
</tr>
<tr>
<td><b>Auto-sync</b></td>
<td>✅ iCloud Keychain</td>
<td>✅ Password Manager</td>
<td>⚠️ Limited</td>
</tr>
<tr>
<td><b>Devices</b></td>
<td>iPhone, iPad, Mac</td>
<td>Android, Chrome (any OS)</td>
<td>Windows 10/11</td>
</tr>
<tr>
<td><b>Cross-browser</b></td>
<td>Safari, Chrome, Firefox</td>
<td>Chrome only</td>
<td>Edge primarily</td>
</tr>
<tr>
<td><b>Setup</b></td>
<td>Enable iCloud Keychain</td>
<td>Sign into Chrome</td>
<td>Windows Hello + MS account</td>
</tr>
<tr>
<td><b>Recovery</b></td>
<td>iCloud recovery</td>
<td>Google recovery</td>
<td>Microsoft recovery</td>
</tr>
<tr>
<td><b>Experience</b></td>
<td>⭐⭐⭐ Best</td>
<td>⭐⭐ Good</td>
<td>⭐ Limited</td>
</tr>
</table>

---

## Common Issues

<details>
<summary><b>🔴 Passkey not appearing on new device</b></summary>

**Causes:**
- Not signed into same account (Apple ID, Google, Microsoft)
- Passkey sync disabled in settings
- Sync hasn't completed yet
- Different ecosystem (Apple passkey on Android)

**Solutions:**
1. Verify account sign-in on both devices
2. Check sync settings (iCloud Keychain, Google Password Manager)
3. Wait 5-10 minutes for sync
4. Force sync by opening password settings
5. For cross-ecosystem, use Chrome with Google account

</details>

<details>
<summary><b>🔴 "No passkeys found" error</b></summary>

**Causes:**
- Passkey was created on different origin/domain
- Passkey deleted from credential manager
- Sync corrupted

**Solutions:**
1. Ensure you're on the exact same domain (including www vs non-www)
2. Check credential manager for the passkey
3. Create a new passkey on this device (will create new wallet)

</details>

<details>
<summary><b>🟡 Biometric prompt not appearing</b></summary>

**Causes:**
- Browser doesn't have permission to use biometrics
- Device lacks biometric hardware
- Private browsing mode

**Solutions:**
1. Check browser permissions for the site
2. Use PIN/password fallback if available
3. Exit private/incognito mode

</details>

---

## Security Considerations

### Why Cross-Device Passkeys Are Secure

| Feature | Benefit |
|---------|---------|
| 🔒 **End-to-end encryption** | Passkeys encrypted before leaving device |
| 👆 **Biometric gating** | Each use requires fresh biometric verification |
| 🌐 **Origin binding** | Passkeys only work on the domain that created them |
| 🚫 **No shared secrets** | Nothing useful if cloud account is compromised |

### Passkey vs Seed Phrase

| Aspect | Seed Phrase | Passkey |
|--------|:-----------:|:-------:|
| **Cross-device** | ❌ Manual copy (risky) | ✅ Auto-sync (secure) |
| **Phishing risk** | ❌ High (typeable) | ✅ None (origin-bound) |
| **Lost device** | ❌ Funds at risk | ✅ Safe (biometric required) |
| **Account recovery** | ❌ Phrase = full access | ✅ Biometric + account |
| **User experience** | ❌ Error-prone | ✅ Seamless |

---

## Best Practices

### For Developers

| # | Practice | Why |
|---|----------|-----|
| 1 | **Show clear guidance** | Help users understand passkey sync |
| 2 | **Detect platform** | Customize instructions per ecosystem |
| 3 | **Handle missing passkeys** | Offer to create new wallet gracefully |
| 4 | **Don't assume sync** | Always provide explicit "Connect" button |
| 5 | **Track sessions per device** | Help users understand connection status |

### For Users

| # | Practice | Why |
|---|----------|-----|
| 1 | **Enable sync first** | Before creating passkey wallet |
| 2 | **Use one ecosystem** | Stick to Apple OR Google for best experience |
| 3 | **Keep devices updated** | Passkey support improves with updates |
| 4 | **Have backup device** | At least two synced devices recommended |
| 5 | **Understand new wallet = new address** | Different ecosystem = different wallet |

---

## FAQ

<details>
<summary><b>What if my passkey doesn't appear on another device?</b></summary>

Check these common issues:
- Ensure you're signed into the same Apple/Google/Microsoft account
- Verify passkey/password sync is enabled in settings
- Wait a few minutes for sync to complete
- Check your internet connection on both devices

</details>

<details>
<summary><b>Can I use my wallet on a device with a different ecosystem?</b></summary>

Cross-ecosystem sync (e.g., Apple to Android) is limited. Options:
- Use Chrome with Google account on both platforms
- Use a hardware security key (YubiKey) as a portable passkey
- Use QR code authentication (scan from your phone)

</details>

<details>
<summary><b>Is my wallet safe if I lose a device?</b></summary>

Yes! Your wallet remains secure:
- Passkeys require biometric auth - can't be used without your face/fingerprint
- Lost device can be remotely wiped via iCloud/Google/Microsoft
- Your wallet is accessible from any other synced device
- No seed phrase means nothing to steal from device storage

</details>

<details>
<summary><b>Why do I need to click "Connect" on each new device?</b></summary>

While passkeys sync automatically, session data (localStorage) does not sync between browsers. Each device needs to:
- Verify you have access to the passkey (biometric check)
- Create a local session for faster subsequent access
- This is a security feature, not a limitation

</details>

---

## Next Steps

<table>
<tr>
<td width="70%">

Now that you understand cross-device session persistence:

1. **Implement the components** - Add CrossDeviceConnect and SyncSetupGuide
2. **Test across devices** - Verify sync works for your target platforms
3. **Add recovery options** - Consider hardware key support for power users
4. **Monitor support requests** - Common issues reveal UX opportunities

</td>
<td width="30%" align="center">

**Congratulations!**

You've completed all 4 tutorials!

</td>
</tr>
</table>

---

## Technical Reference

### Session Storage Keys

```typescript
const SESSION_KEYS = {
  session: "lazorkit_session",        // Main session token
  pubkey: "lazorkit_pubkey",          // Cached public key
  meta: "lazorkit_session_meta",      // Device-specific metadata
};
```

### Platform Detection

```typescript
function getPasskeyPlatform(): string {
  const ua = navigator.userAgent;

  if (/iPhone|iPad|iPod/.test(ua)) return "apple-mobile";
  if (/Mac/.test(ua) && /Safari/.test(ua)) return "apple-desktop";
  if (/Android/.test(ua)) return "google-android";
  if (/Chrome/.test(ua)) return "google-chrome";
  if (/Windows/.test(ua) && /Edg/.test(ua)) return "windows-edge";
  if (/Windows/.test(ua)) return "windows";

  return "unknown";
}
```

---

## Resources

| Resource | Link |
|----------|------|
| WebAuthn Guide | [webauthn.guide](https://webauthn.guide/) |
| Apple Passkeys | [developer.apple.com/passkeys](https://developer.apple.com/passkeys/) |
| Google Passkeys | [developers.google.com/identity/passkeys](https://developers.google.com/identity/passkeys) |
| FIDO Alliance | [fidoalliance.org/passkeys](https://fidoalliance.org/passkeys/) |
| Can I Use WebAuthn | [caniuse.com/webauthn](https://caniuse.com/webauthn) |

---

<div align="center">

**[← Tutorial 3: Payment Widget](./03-payment-widget.md)** | **[Back to Tutorials](../README.md#-tutorials)**

</div>
