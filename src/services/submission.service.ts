// =============================================================================
// src/services/submission.service.ts
// Submission Service — with Walrus Storage Integration
//
// Flow:
//   createSubmission()
//     → validate input (matching our new WalrusSubmissionPayload)
//     → uploadJSON() → blobId
//     → persist { blobId, formId, respondentAddress, serverSubmittedAt }
//     → return SubmissionResult
// =============================================================================

import { z } from "zod";
import { uploadJSON, uploadFile } from "@/lib/walrus/upload";
import { fetchSubmission } from "@/lib/walrus/fetch";
import type {
  WalrusUploadResult,
  WalrusBlobMetadata,
} from "@/lib/walrus/schema";
import { WalrusError } from "@/lib/walrus/schema";
import type {
  WalrusSubmissionPayload,
  SubmissionRecord,
  SubmissionValue,
  FileReference,
} from "@/types/submissions";

// -----------------------------------------------------------------------------
// Input validation schemas (Aligned with src/types/submissions.ts)
// -----------------------------------------------------------------------------

// Schema to validate FileReference object
const FileReferenceSchema = z.object({
  blobId: z.string(),
  filename: z.string(),
  mimeType: z.string(),
  size: z.number(),
});

// Replicating the SubmissionValue union type in Zod
const SubmissionValueSchema: z.ZodType<SubmissionValue> = z.union([
  z.string(),
  z.number(),
  z.boolean(),
  z.array(z.string()),
  FileReferenceSchema,
  z.array(FileReferenceSchema),
  z.null(),
]);

/**
 * Zod schema for incoming form submission payload from the frontend hook.
 */
const SubmissionPayloadSchema = z.object({
  version: z.literal("1.0"),
  formId: z.string().min(1, "formId is required"),
  respondentAddress: z.string().nullable(),
  answers: z.record(z.string(), SubmissionValueSchema),
  clientSubmittedAt: z.number().optional(),
});

// -----------------------------------------------------------------------------
// Result types
// -----------------------------------------------------------------------------

export interface SubmissionResult {
  blobId: string; // The primary ID
  serverSubmittedAt: number;
}

// -----------------------------------------------------------------------------
// DB adapter interface
// -----------------------------------------------------------------------------

interface SubmissionRepository {
  save(record: SubmissionRecord): Promise<void>;
  findById(blobId: string): Promise<SubmissionRecord | null>;
  findByFormId(formId: string): Promise<SubmissionRecord[]>;
}

/**
 * ⚠️  In-memory stub — replace with Prisma / Drizzle / Supabase / etc.
 */
const inMemoryRepo: SubmissionRepository = (() => {
  const store = new Map<string, SubmissionRecord>();
  return {
    async save(record) {
      // Using blobId as the primary key
      store.set(record.blobId, record);
    },
    async findById(blobId) {
      return store.get(blobId) ?? null;
    },
    async findByFormId(formId) {
      return [...store.values()].filter((r) => r.formId === formId);
    },
  };
})();

export let submissionRepo: SubmissionRepository = inMemoryRepo;
export function setSubmissionRepo(repo: SubmissionRepository) {
  submissionRepo = repo;
}

// -----------------------------------------------------------------------------
// Service Methods
// -----------------------------------------------------------------------------

/**
 * Validates a form submission, uploads it to Walrus, and persists the record.
 */
export async function createSubmission(
  input: unknown,
): Promise<SubmissionResult> {
  // 1. Validate input against our strict Zod schema
  const parsed = SubmissionPayloadSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(
      `Invalid submission payload: ${parsed.error.issues
        .map((i) => `${i.path.join(".")}: ${i.message}`)
        .join(", ")}`,
    );
  }

  const payload = parsed.data;

  // 2. Upload immutable JSON payload to Walrus
  let uploadResult: WalrusUploadResult;
  try {
    uploadResult = await uploadJSON(payload);
  } catch (err) {
    if (err instanceof WalrusError) throw err;
    throw new WalrusError(
      "Unexpected error during Walrus upload.",
      err,
      "UPLOAD_FAILED",
    );
  }

  const serverSubmittedAt = Date.now();

  // 3. Persist the record (blobId is the PK)
  await submissionRepo.save({
    blobId: uploadResult.blobId,
    formId: payload.formId,
    respondentAddress: payload.respondentAddress,
    serverSubmittedAt: serverSubmittedAt,
  });

  // 4. Return the result
  return {
    blobId: uploadResult.blobId,
    serverSubmittedAt,
  };
}

/**
 * Retrieves the full submission payload from Walrus by its blobId.
 */
export async function getSubmission(
  blobId: string,
): Promise<WalrusSubmissionPayload> {
  const record = await submissionRepo.findById(blobId);
  if (!record) {
    throw new Error(
      `Submission record for blob "${blobId}" not found in database.`,
    );
  }

  const { data } = await fetchSubmission<WalrusSubmissionPayload>(blobId);
  return data;
}

/**
 * Retrieves all submission payloads for a given form.
 */
export async function getSubmissionsByForm(
  formId: string,
): Promise<Array<WalrusSubmissionPayload>> {
  const records = await submissionRepo.findByFormId(formId);

  const settled = await Promise.allSettled(
    records.map(async (r) => {
      const { data } = await fetchSubmission<WalrusSubmissionPayload>(r.blobId);
      return data;
    }),
  );

  const results: Array<WalrusSubmissionPayload> = [];
  for (const outcome of settled) {
    if (outcome.status === "fulfilled") {
      results.push(outcome.value);
    } else {
      console.error(
        "[submission.service] Failed to fetch submission from Walrus:",
        outcome.reason,
      );
    }
  }

  return results;
}

/**
 * Uploads a media/file attachment to Walrus and returns its metadata.
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
