// =============================================================================
// src/lib/walrus/client.ts
// Walrus SDK — Reusable Server-Side Client (Singleton)
//
// ⚠️  SERVER ONLY — never import this in a Client Component.
//     Use inside: API Routes, Server Actions, Server Components.
// =============================================================================

import { SuiGrpcClient } from "@mysten/sui/grpc";
import { walrus } from "@mysten/walrus";
import { WalrusError } from "./schema";

// -----------------------------------------------------------------------------
// Config helpers
// -----------------------------------------------------------------------------

function getEnv(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new WalrusError(
      `Missing required environment variable: ${key}`,
      undefined,
      "CLIENT_INIT_FAILED",
    );
  }
  return value;
}

function getEnvOptional(key: string): string | undefined {
  return process.env[key];
}

// -----------------------------------------------------------------------------
// Client factory
// -----------------------------------------------------------------------------

/**
 * Creates a Walrus-extended SuiGrpcClient.
 *
 * Reads config from environment variables:
 *   WALRUS_NETWORK          — "testnet" | "mainnet"  (default: "testnet")
 *   WALRUS_RPC_URL          — override gRPC endpoint (optional)
 *   WALRUS_UPLOAD_RELAY_URL — upload relay URL (optional, recommended for prod)
 *   WALRUS_REQUEST_TIMEOUT  — per-request timeout in ms (default: 60000)
 */
function createWalrusClient() {
  const network = (getEnvOptional("WALRUS_NETWORK") ?? "testnet") as
    | "testnet"
    | "mainnet";

  const rpcUrl =
    getEnvOptional("WALRUS_RPC_URL") ??
    (network === "mainnet"
      ? "https://fullnode.mainnet.sui.io:443"
      : "https://fullnode.testnet.sui.io:443");

  const timeout = Number(getEnvOptional("WALRUS_REQUEST_TIMEOUT") ?? "60000");

  const uploadRelayUrl = getEnvOptional("WALRUS_UPLOAD_RELAY_URL");

  try {
    const suiClient = new SuiGrpcClient({
      network,
      baseUrl: rpcUrl,
    });

    const client = suiClient.$extend(
      walrus({
        // Surface per-node errors to server logs during development
        storageNodeClientOptions: {
          timeout,
          ...(process.env.NODE_ENV !== "production" && {
            onError: (err) => console.warn("[walrus:node-error]", err),
          }),
        },

        // Use upload relay if configured — reduces ~2200 storage node requests to 1
        ...(uploadRelayUrl && {
          uploadRelay: {
            host: uploadRelayUrl,
            sendTip: {
              // Let the SDK auto-detect required tip (up to 10_000 MIST)
              max: Number(
                getEnvOptional("WALRUS_UPLOAD_RELAY_MAX_TIP") ?? "10000",
              ),
            },
          },
        }),
      }),
    );

    return client;
  } catch (err) {
    throw new WalrusError(
      "Failed to initialise Walrus client",
      err,
      "CLIENT_INIT_FAILED",
    );
  }
}

// -----------------------------------------------------------------------------
// Singleton — one client per server process
// -----------------------------------------------------------------------------

let _client: ReturnType<typeof createWalrusClient> | null = null;

/**
 * Returns the singleton Walrus client.
 * Safe to call multiple times — always returns the same instance.
 */
export function getWalrusClient(): ReturnType<typeof createWalrusClient> {
  if (!_client) {
    _client = createWalrusClient();
  }
  return _client;
}

/**
 * Resets the singleton — call this after catching a `RetryableWalrusClientError`
 * before retrying your operation.
 */
export function resetWalrusClient(): void {
  if (_client) {
    _client.walrus.reset();
    _client = null;
  }
}
