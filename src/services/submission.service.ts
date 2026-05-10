// =============================================================================
// src/services/submission.service.ts
// Submission Service — with Walrus Storage Integration
//
// Flow:
//   createSubmission()
//     → validate input (Zod)
//     → build WalrusSubmissionPayload
//     → uploadJSON() → blobId
//     → persist { submissionId, blobId, formId } in your DB
//     → return SubmissionResult
//
// getSubmission()
//     → lookup blobId in DB by submissionId
//     → fetchSubmission(blobId) from Walrus
//     → return typed payload
// =============================================================================

import { z } from "zod";
import { uploadJSON, uploadFile } from "@/lib/walrus/upload";
import { fetchSubmission } from "@/lib/walrus/fetch";
import type {
  WalrusSubmissionPayload,
  WalrusUploadResult,
  WalrusBlobMetadata,
} from "@/lib/walrus/schema";
import { WalrusError } from "@/lib/walrus/schema";

// -----------------------------------------------------------------------------
// Input validation schemas
// -----------------------------------------------------------------------------

/**
 * Zod schema for incoming form submission.
 * Extend / replace `fieldData` shape to match your actual form field types.
 */
const SubmissionInputSchema = z.object({
  formId: z.string().min(1, "formId is required"),
  data: z.record(z.unknown()),
  meta: z
    .object({
      userAgent: z.string().optional(),
      ipAddress: z.string().optional(),
      source: z.string().optional(),
    })
    .optional(),
});

export type SubmissionInput = z.infer<typeof SubmissionInputSchema>;

// -----------------------------------------------------------------------------
// Result types
// -----------------------------------------------------------------------------

export interface SubmissionResult {
  /** Your application-level submission ID (UUID). */
  submissionId: string;
  /** Walrus blob ID — store this in your DB. */
  blobId: string;
  uploadedAt: number;
}

export interface SubmissionRecord {
  submissionId: string;
  formId: string;
  blobId: string;
  uploadedAt: number;
}

// -----------------------------------------------------------------------------
// Lightweight ID generator (replace with your preferred lib, e.g. nanoid/uuid)
// -----------------------------------------------------------------------------

function generateId(): string {
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 9)
  ).toUpperCase();
}

// -----------------------------------------------------------------------------
// DB adapter interface
//
// Replace the in-memory implementation below with your real DB adapter.
// The service depends only on this interface — swap freely.
// -----------------------------------------------------------------------------

interface SubmissionRepository {
  save(record: SubmissionRecord): Promise<void>;
  findById(submissionId: string): Promise<SubmissionRecord | null>;
  findByFormId(formId: string): Promise<SubmissionRecord[]>;
}

/**
 * ⚠️  In-memory stub — replace with Prisma / Drizzle / Supabase / etc.
 * Only the `blobId` and `submissionId` mapping needs to be persisted.
 */
const inMemoryRepo: SubmissionRepository = (() => {
  const store = new Map<string, SubmissionRecord>();
  return {
    async save(record) {
      store.set(record.submissionId, record);
    },
    async findById(id) {
      return store.get(id) ?? null;
    },
    async findByFormId(formId) {
      return [...store.values()].filter((r) => r.formId === formId);
    },
  };
})();

// Export so callers can inject a real repo (e.g. in tests or DI)
export let submissionRepo: SubmissionRepository = inMemoryRepo;
export function setSubmissionRepo(repo: SubmissionRepository) {
  submissionRepo = repo;
}

// -----------------------------------------------------------------------------
// Service: createSubmission
// -----------------------------------------------------------------------------

/**
 * Validates a form submission, uploads it to Walrus, and persists the record.
 *
 * @example
 * const result = await createSubmission({
 *   formId: "form_abc",
 *   data: { name: "Alice", message: "Great product!" },
 * });
 * // → { submissionId: "…", blobId: "…", uploadedAt: … }
 */
export async function createSubmission(
  input: SubmissionInput,
): Promise<SubmissionResult> {
  // 1. Validate input
  const parsed = SubmissionInputSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(
      `Invalid submission: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ")}`,
    );
  }

  const { formId, data, meta } = parsed.data;

  // 2. Build canonical payload
  const payload: WalrusSubmissionPayload = {
    version: "1.0",
    formId,
    submittedAt: new Date().toISOString(),
    data,
    meta,
  };

  // 3. Upload to Walrus
  let uploadResult: WalrusUploadResult;
  try {
    uploadResult = await uploadJSON(payload);
  } catch (err) {
    if (err instanceof WalrusError) {
      throw err; // propagate typed error
    }
    throw new WalrusError(
      "Unexpected error during Walrus upload.",
      err,
      "UPLOAD_FAILED",
    );
  }

  // 4. Persist the record (submissionId ↔ blobId mapping)
  const submissionId = generateId();
  await submissionRepo.save({
    submissionId,
    formId,
    blobId: uploadResult.blobId,
    uploadedAt: uploadResult.uploadedAt,
  });

  // 5. Return
  return {
    submissionId,
    blobId: uploadResult.blobId,
    uploadedAt: uploadResult.uploadedAt,
  };
}

// -----------------------------------------------------------------------------
// Service: getSubmission
// -----------------------------------------------------------------------------

/**
 * Retrieves the full submission payload from Walrus by submissionId.
 *
 * @example
 * const { data } = await getSubmission("ABCD1234");
 * console.log(data.formId, data.data);
 */
export async function getSubmission<T = Record<string, unknown>>(
  submissionId: string,
): Promise<WalrusSubmissionPayload<T>> {
  const record = await submissionRepo.findById(submissionId);
  if (!record) {
    throw new Error(`Submission "${submissionId}" not found.`);
  }

  const { data } = await fetchSubmission<T>(record.blobId);
  return data;
}

// -----------------------------------------------------------------------------
// Service: getSubmissionsByForm
// -----------------------------------------------------------------------------

/**
 * Retrieves all submission payloads for a given form.
 * Fetches in parallel from Walrus — suitable for admin review dashboards.
 *
 * @example
 * const submissions = await getSubmissionsByForm("form_abc");
 */
export async function getSubmissionsByForm<T = Record<string, unknown>>(
  formId: string,
): Promise<Array<WalrusSubmissionPayload<T> & { submissionId: string }>> {
  const records = await submissionRepo.findByFormId(formId);

  const settled = await Promise.allSettled(
    records.map(async (r) => {
      const { data } = await fetchSubmission<T>(r.blobId);
      return { ...data, submissionId: r.submissionId };
    }),
  );

  const results: Array<WalrusSubmissionPayload<T> & { submissionId: string }> =
    [];
  for (const outcome of settled) {
    if (outcome.status === "fulfilled") {
      results.push(outcome.value);
    } else {
      // Log but don't throw — partial results are better than a full failure
      console.error(
        "[submission.service] Failed to fetch submission:",
        outcome.reason,
      );
    }
  }

  return results;
}

// -----------------------------------------------------------------------------
// Service: uploadAttachment
// -----------------------------------------------------------------------------

/**
 * Uploads a media/file attachment to Walrus and returns its blobId.
 * Store the blobId alongside your form submission data.
 *
 * @example
 * const { blobId } = await uploadAttachment(buffer);
 * // Include blobId in your submission data field
 */
export async function uploadAttachment(
  data: Uint8Array | Buffer | ArrayBuffer,
  options?: { epochs?: number; deletable?: boolean },
): Promise<WalrusUploadResult & Pick<WalrusBlobMetadata, "sizeBytes">> {
  const bytes =
    data instanceof Uint8Array
      ? data
      : new Uint8Array(data instanceof Buffer ? data : data);

  const uploadResult = await uploadFile(bytes, options);

  return {
    ...uploadResult,
    sizeBytes: bytes.byteLength,
  };
}
