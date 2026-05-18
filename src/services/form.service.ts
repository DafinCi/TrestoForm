// =============================================================================
// src/services/form.service.ts
// Mengelola penyimpanan dan pengambilan Schema Form ke/dari Walrus Protocol
// =============================================================================

import { uploadJSON } from "@/lib/walrus/upload";
import { fetchJSON } from "@/lib/walrus/fetch";
import type { FormField } from "@/types/field";
import type { FormSettings } from "@/types/form"; // IMPORT INI
import { WalrusError } from "@/lib/walrus/schema";

export interface FormSchemaPayload {
  version: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings?: FormSettings; // TAMBAHKAN INI: Jadikan opsional agar backward compatible dengan form lama di Walrus
  createdAt: string;
  creatorAddress?: string;
}

/**
 * Menyimpan struktur form baru ke Walrus.
 * Mengembalikan blobId yang akan digunakan sebagai formId (URL link).
 */
export async function saveFormSchema(
  title: string,
  fields: FormField[],
  description?: string,
  settings?: FormSettings, // Tambahkan ini sebagai parameter opsional
): Promise<{ formId: string; uploadedAt: number }> {
  if (!fields || fields.length === 0) {
    throw new Error("Form must have at least one field.");
  }

  // Jika settings tidak dikirim, kita set default value
  const defaultSettings: FormSettings = {
    allowAnonymous: true,
    globalVisibility: "public", // Default: form bisa diisi oleh siapa saja
    // (tambahkan default lain jika ada di FormSettings)
  };

  const payload: FormSchemaPayload = {
    version: "1.0",
    title,
    description,
    fields,
    settings: settings || defaultSettings, // Masukkan ke payload
    createdAt: new Date().toISOString(),
  };

  try {
    const uploadResult = await uploadJSON(payload);

    return {
      formId: uploadResult.blobId,
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
    // PERBAIKAN 2: Gunakan fetchJSON agar tipe data kembaliannya pas sesuai generic-nya
    const { data } = await fetchJSON<FormSchemaPayload>(formId);

    // Sekarang data.fields dijamin kedeteksi oleh TypeScript karena tipenya adalah FormSchemaPayload murni!
    if (!data || data.version !== "1.0" || !Array.isArray(data.fields)) {
      throw new Error("Invalid form schema structure retrieved from Walrus.");
    }

    return data;
  } catch (err) {
    console.error("[form.service] Failed to fetch schema:", err);
    throw new Error("Form not found or Walrus network is busy.");
  }
}
