// =============================================================================
// src/lib/walrus/fetch.ts
// Walrus SDK — Fetch / Retrieval Helpers
//
// Exports:
//   fetchBlob(blobId)        → Uint8Array  (raw bytes)
//   fetchJSON<T>(blobId)     → T           (parsed JSON)
//   fetchSubmission(blobId)  → WalrusSubmissionPayload<T>
// =============================================================================

import { RetryableWalrusClientError } from "@mysten/walrus";
import { getWalrusClient, resetWalrusClient } from "./client";
import {
  WalrusError,
  WalrusFetchResult,
  WalrusSubmissionPayload,
} from "./schema";

// -----------------------------------------------------------------------------
// Core fetch with retry
// -----------------------------------------------------------------------------

/**
 * Retrieves the raw bytes of a blob from Walrus storage nodes.
 *
 * @param blobId - The Walrus blob ID returned by uploadJSON / uploadFile.
 */
export async function fetchBlob(blobId: string): Promise<Uint8Array> {
  const client = getWalrusClient();

  try {
    const blob = await client.walrus.readBlob({ blobId });
    return blob;
  } catch (err) {
    // Retryable on epoch change
    if (err instanceof RetryableWalrusClientError) {
      console.warn(
        "[walrus:fetch] Retryable error, resetting client and retrying…",
      );
      resetWalrusClient();

      const fresh = getWalrusClient();
      try {
        return await fresh.walrus.readBlob({ blobId });
      } catch (retryErr) {
        throw new WalrusError(
          `Failed to fetch blob "${blobId}" after retry.`,
          retryErr,
          "FETCH_FAILED",
        );
      }
    }

    throw new WalrusError(
      `Failed to fetch blob "${blobId}" from Walrus.`,
      err,
      "FETCH_FAILED",
    );
  }
}

// -----------------------------------------------------------------------------
// JSON fetch
// -----------------------------------------------------------------------------

/**
 * Fetches a blob and parses it as JSON.
 *
 * @example
 * const data = await fetchJSON<MyType>(blobId);
 */
export async function fetchJSON<T = unknown>(
  blobId: string,
): Promise<WalrusFetchResult<T>> {
  const bytes = await fetchBlob(blobId);

  let data: T;
  try {
    const text = new TextDecoder("utf-8").decode(bytes);
    data = JSON.parse(text) as T;
  } catch (err) {
    throw new WalrusError(
      `Blob "${blobId}" is not valid JSON.`,
      err,
      "PARSE_FAILED",
    );
  }

  return {
    blobId,
    data,
    fetchedAt: Date.now(),
  };
}

// -----------------------------------------------------------------------------
// Typed submission fetch
// -----------------------------------------------------------------------------

/**
 * Fetches and validates a stored form submission payload.
 * Performs a basic version check for forward-compat.
 *
 * @example
 * const { data: submission } = await fetchSubmission(blobId);
 * console.log(submission.formId, submission.data);
 */
export async function fetchSubmission<T = Record<string, unknown>>(
  blobId: string,
): Promise<WalrusFetchResult<WalrusSubmissionPayload<T>>> {
  const result = await fetchJSON<WalrusSubmissionPayload<T>>(blobId);

  // Lightweight runtime validation
  const payload = result.data;
  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof payload.formId !== "string" ||
    typeof payload.submittedAt !== "string" ||
    !("data" in payload)
  ) {
    throw new WalrusError(
      `Blob "${blobId}" does not match WalrusSubmissionPayload schema.`,
      undefined,
      "PARSE_FAILED",
    );
  }

  return result;
}
