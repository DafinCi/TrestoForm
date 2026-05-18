// =============================================================================
// src/types/submissions.ts
// =============================================================================

/**
 * Tipe data spesifik untuk file/attachment yang disimpan di Walrus
 * Menyimpan metadata penting agar dashboard bisa merender tanpa harus nge-fetch blob dulu
 */
export interface FileReference {
  blobId: string;
  filename: string;
  mimeType: string;
  size: number; // dalam bytes
}

/**
 * Union type ketat untuk mematikan penggunaan `any`.
 * Menampung semua kemungkinan output dari form controls kita.
 */
export type SubmissionValue =
  | string
  | number
  | boolean
  | string[]
  | FileReference
  | FileReference[]
  | null;

/**
 * STRUKTUR PAYLOAD WALRUS (IMMUTABLE)
 * Ini adalah bentuk asli dari file JSON yang akan diunggah ke jaringan Walrus.
 */
export interface WalrusSubmissionPayload {
  version: "1.0"; // Krusial untuk migrasi skema masa depan
  formId: string;
  respondentAddress: string | null;
  answers: Record<string, SubmissionValue>; // Object map O(1) untuk efisiensi
  clientSubmittedAt?: number; // Opsional, hanya untuk analitik UI
}

/**
 * STRUKTUR DATABASE / SMART CONTRACT (METADATA)
 * Ini adalah "Resi" yang kita simpan di DB lokal atau indexer Smart Contract.
 * Sangat ringan karena beban data beratnya ada di Walrus.
 */
export interface SubmissionRecord {
  // blobId bertindak sebagai ID submission SEKALIGUS pointer ke Walrus
  blobId: string;
  formId: string;
  respondentAddress: string | null;
  serverSubmittedAt: number; // Trusted timestamp dari backend/indexer
}
