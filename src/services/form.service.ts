// =============================================================================
// src/services/form.service.ts
// Mengelola penyimpanan dan pengambilan Schema Form ke/dari Walrus Protocol
// =============================================================================

import { uploadJSON } from "@/lib/walrus/upload";
import { fetchSubmission } from "@/lib/walrus/fetch";
import type { FormField } from "@/types/field";
import { WalrusError } from "@/lib/walrus/schema";

export interface FormSchemaPayload {
  version: string;
  title: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  creatorAddress?: string; // Opsional: kalau lu mau catat dompet creator-nya
}

/**
 * Menyimpan struktur form baru ke Walrus.
 * Mengembalikan blobId yang akan digunakan sebagai formId (URL link).
 */
export async function saveFormSchema(
  title: string,
  fields: FormField[],
  description?: string,
): Promise<{ formId: string; uploadedAt: number }> {
  if (!fields || fields.length === 0) {
    throw new Error("Form must have at least one field.");
  }

  const payload: FormSchemaPayload = {
    version: "1.0",
    title,
    description,
    fields,
    createdAt: new Date().toISOString(),
  };

  try {
    // Kita manfaatkan uploadJSON yang udah lu bikin di upload.ts!
    const uploadResult = await uploadJSON(payload);

    return {
      formId: uploadResult.blobId, // blobId ini bakal jadi URL /f/[blobId]
      uploadedAt: uploadResult.uploadedAt,
    };
  } catch (err) {
    throw new WalrusError(
      "Failed to save form schema to Walrus.",
      err,
      "UPLOAD_FAILED",
    );
  }
}

/**
 * Mengambil struktur form dari Walrus berdasarkan blobId (formId).
 */
export async function getFormSchema(
  formId: string,
): Promise<FormSchemaPayload> {
  try {
    const { data } = await fetchSubmission<FormSchemaPayload>(formId);

    // Validasi basic untuk memastikan ini benar-benar file schema form kita
    if (!data || data.version !== "1.0" || !Array.isArray(data.fields)) {
      throw new Error("Invalid form schema structure retrieved from Walrus.");
    }

    return data;
  } catch (err) {
    console.error("[form.service] Failed to fetch schema:", err);
    throw new Error("Form not found or Walrus network is busy.");
  }
}
