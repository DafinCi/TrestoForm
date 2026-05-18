// =============================================================================
// src/lib/walrus/upload.ts
// Walrus SDK — Upload Helpers
//
// Exports:
//   uploadJSON(payload, options?)  → WalrusUploadResult
//   uploadFile(data, options?)     → WalrusUploadResult
// =============================================================================

import { RetryableWalrusClientError } from "@mysten/walrus";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { getWalrusClient, resetWalrusClient } from "./client";
import { WalrusError, WalrusUploadOptions, WalrusUploadResult } from "./schema";
import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";

// -----------------------------------------------------------------------------
// Signer
// -----------------------------------------------------------------------------

/**
 * Builds the server-side Ed25519 signer from the environment.
 *
 * Set in .env.local:
 *   WALRUS_SIGNER_PRIVATE_KEY=<base64 or hex 32-byte private key>
 *
 * To generate a test keypair:
 *   npx ts-node -e "import {Ed25519Keypair} from '@mysten/sui/keypairs/ed25519'; const kp=new Ed25519Keypair(); console.log(kp.getSecretKey());"
 */
function getSigner(): Ed25519Keypair {
  const key = process.env.WALRUS_SIGNER_PRIVATE_KEY;
  if (!key) {
    throw new WalrusError(
      "WALRUS_SIGNER_PRIVATE_KEY is not set.",
      undefined,
      "SIGNER_MISSING",
    );
  }

  try {
    // 1. Cek apakah formatnya dari wallet (diawali suiprivkey)
    if (key.startsWith("suiprivkey")) {
      const { secretKey } = decodeSuiPrivateKey(key);
      return Ed25519Keypair.fromSecretKey(secretKey);
    }

    // 2. Kalau format lama (base64/hex)
    return Ed25519Keypair.fromSecretKey(key);
  } catch (err) {
    throw new WalrusError(
      "Invalid WALRUS_SIGNER_PRIVATE_KEY format.",
      err,
      "SIGNER_MISSING",
    );
  }
}

// -----------------------------------------------------------------------------
// Default options
// -----------------------------------------------------------------------------

function resolveOptions(
  opts?: WalrusUploadOptions,
): Required<WalrusUploadOptions> {
  return {
    epochs: opts?.epochs ?? Number(process.env.WALRUS_DEFAULT_EPOCHS ?? "3"),
    deletable: opts?.deletable ?? false,
  };
}

// -----------------------------------------------------------------------------
// Core upload with retry
// -----------------------------------------------------------------------------

async function uploadBlob(
  blob: Uint8Array,
  options: Required<WalrusUploadOptions>,
): Promise<WalrusUploadResult> {
  const signer = getSigner();
  const client = getWalrusClient();

  try {
    const result = await client.walrus.writeBlob({
      blob,
      epochs: options.epochs,
      deletable: options.deletable,
      signer,
    });

    return {
      blobId: result.blobId,
      uploadedAt: Date.now(),
    };
  } catch (err) {
    // Walrus epoch-change errors are retryable — reset client and try once more
    if (err instanceof RetryableWalrusClientError) {
      console.warn(
        "[walrus:upload] Retryable error, resetting client and retrying…",
      );
      resetWalrusClient();

      const freshClient = getWalrusClient();
      const result = await freshClient.walrus.writeBlob({
        blob,
        epochs: options.epochs,
        deletable: options.deletable,
        signer,
      });

      return {
        blobId: result.blobId,
        uploadedAt: Date.now(),
      };
    }

    throw new WalrusError(
      "Failed to upload blob to Walrus.",
      err,
      "UPLOAD_FAILED",
    );
  }
}

// -----------------------------------------------------------------------------
// Public API
// -----------------------------------------------------------------------------

/**
 * Serialises any JSON-compatible value and uploads it to Walrus.
 *
 * @example
 * const { blobId } = await uploadJSON({ formId: "abc", data: { name: "Alice" } });
 */
export async function uploadJSON(
  payload: unknown,
  options?: WalrusUploadOptions,
): Promise<WalrusUploadResult> {
  const opts = resolveOptions(options);

  let encoded: Uint8Array;
  try {
    const json = JSON.stringify(payload);
    encoded = new TextEncoder().encode(json);
  } catch (err) {
    throw new WalrusError(
      "Payload is not JSON-serialisable.",
      err,
      "UPLOAD_FAILED",
    );
  }

  return uploadBlob(encoded, opts);
}

/**
 * Uploads raw binary data (Buffer, Uint8Array, or browser File/Blob) to Walrus.
 * Use this for media attachments in form submissions.
 *
 * @example
 * const buffer = await fs.promises.readFile(filePath);
 * const { blobId } = await uploadFile(buffer);
 */
export async function uploadFile(
  data: Uint8Array | Buffer | ArrayBuffer,
  options?: WalrusUploadOptions,
): Promise<WalrusUploadResult> {
  const opts = resolveOptions(options);

  const blob =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(data instanceof Buffer ? data : data);

  return uploadBlob(blob, opts);
}
