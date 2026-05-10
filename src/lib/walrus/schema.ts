// =============================================================================
// src/lib/walrus/schema.ts
// Walrus SDK — Type Definitions & Schemas
// =============================================================================

// -----------------------------------------------------------------------------
// Upload
// -----------------------------------------------------------------------------

/** Result returned after a successful blob upload to Walrus. */
export interface WalrusUploadResult {
  /** Unique identifier of the stored blob on Walrus. */
  blobId: string;
  /** Sui object ID of the on-chain blob registration (available after certify). */
  objectId?: string;
  /** Unix timestamp (ms) when the upload was performed. */
  uploadedAt: number;
}

/** Options passed to upload helpers. */
export interface WalrusUploadOptions {
  /**
   * Number of Walrus epochs to store the blob.
   * Defaults to WALRUS_DEFAULT_EPOCHS env var, or 3.
   */
  epochs?: number;
  /**
   * Whether the blob can be deleted by the owner later.
   * Defaults to false (permanent storage).
   */
  deletable?: boolean;
}

// -----------------------------------------------------------------------------
// Fetch
// -----------------------------------------------------------------------------

/** Typed wrapper around a raw blob fetch result. */
export interface WalrusFetchResult<T = unknown> {
  blobId: string;
  data: T;
  fetchedAt: number;
}

// -----------------------------------------------------------------------------
// Submission Payload
// -----------------------------------------------------------------------------

/**
 * The canonical payload stored on Walrus for each form submission.
 * Generic `T` maps to the dynamic field values from your form schema.
 */
export interface WalrusSubmissionPayload<T = Record<string, unknown>> {
  /** Schema version for forward-compatibility. */
  version: "1.0";
  /** The form that was submitted. */
  formId: string;
  /** ISO-8601 timestamp of submission. */
  submittedAt: string;
  /** Actual field values. */
  data: T;
  /** Optional extra metadata (e.g. browser UA, source). */
  meta?: Record<string, unknown>;
}

// -----------------------------------------------------------------------------
// Blob Metadata
// -----------------------------------------------------------------------------

/**
 * Lightweight metadata record you can persist in your DB alongside the blobId.
 * Store this in your DB — do NOT store the full payload there.
 */
export interface WalrusBlobMetadata {
  blobId: string;
  /** MIME type of the stored content. */
  contentType: "application/json" | "image/png" | "image/jpeg" | (string & {});
  /** Size of the original payload in bytes before encoding. */
  sizeBytes: number;
  uploadedAt: number;
  epochs: number;
}

// -----------------------------------------------------------------------------
// Error
// -----------------------------------------------------------------------------

/** Structured error thrown by Walrus helpers. */
export class WalrusError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    public readonly code?: WalrusErrorCode,
  ) {
    super(message);
    this.name = "WalrusError";
  }
}

export type WalrusErrorCode =
  | "UPLOAD_FAILED"
  | "FETCH_FAILED"
  | "PARSE_FAILED"
  | "CLIENT_INIT_FAILED"
  | "SIGNER_MISSING"
  | "RETRYABLE";
