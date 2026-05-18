// =============================================================================
// src/services/analytics.service.ts
// Analytics & Aggregator Service — Dashboard Data Orchestration
// =============================================================================

import { submissionRepo } from "./submission.service";
import { getFormSchema } from "./form.service";
import type { FormSchemaPayload } from "./form.service";

// Interface untuk menyamakan output ke UI Card Dashboard
export interface DashboardFormMeta {
  id: string; // formId / blobId
  title: string;
  status: "Active" | "Encrypted" | "Draft";
  responses: number;
  lastModified: string;
  blobId?: string;
}

// -----------------------------------------------------------------------------
// Form Metadata Database Registry Stub (Ganti dengan Prisma/Drizzle lu)
// -----------------------------------------------------------------------------
export interface FormRegistryRecord {
  formId: string;
  creatorAddress: string;
  status: "Active" | "Encrypted" | "Draft";
  createdAt: number;
}

const inMemoryFormDb = new Map<string, FormRegistryRecord>();

// Isikan beberapa dummy record di level DB jika ingin test-run di lokal awal-awal
// Ketika admin melakukan `saveFormSchema`, pastikan data di-push juga ke repo ini.
export const formRegistryRepo = {
  async save(record: FormRegistryRecord) {
    inMemoryFormDb.set(record.formId, record);
  },
  async findByCreator(address: string): Promise<FormRegistryRecord[]> {
    return [...inMemoryFormDb.values()].filter(
      (r) => r.creatorAddress === address,
    );
  },
  async findAll(): Promise<FormRegistryRecord[]> {
    return [...inMemoryFormDb.values()];
  },
};

// -----------------------------------------------------------------------------
// Core Aggregator Functions
// -----------------------------------------------------------------------------

/**
 * Mengambil semua form milik satu user spesifik (Admin Wallet)
 */
export async function getUserForms(
  address: string,
): Promise<DashboardFormMeta[]> {
  const records = await formRegistryRepo.findByCreator(address);

  // Ambil detail konten secara paralel dari Walrus & hitung submission dari DB lokal
  const sortedRecords = records.sort((a, b) => b.createdAt - a.createdAt);

  const formsData = await Promise.all(
    sortedRecords.map(async (record) => {
      try {
        const schema = await getFormSchema(record.formId);
        const subRecords = await submissionRepo.findByFormId(record.formId);

        return {
          id: record.formId,
          title: schema.title,
          status: record.status,
          responses: subRecords.length,
          lastModified: new Date(record.createdAt).toLocaleDateString("id-ID"),
          blobId: record.formId,
        };
      } catch (e) {
        // Fallback jika node Walrus timeout/gagal dimuat, UI tidak crash
        return {
          id: record.formId,
          title: "Failed to load title from Walrus",
          status: record.status,
          responses: 0,
          lastModified: "Unknown",
          blobId: record.formId,
        };
      }
    }),
  );

  return formsData;
}

/**
 * Mengambil ringkasan statistik (Overview) Dashboard
 */
export async function getDashboardOverview(address: string) {
  const userForms = await getUserForms(address);

  // Hitung agregasi total submission dari seluruh form milik admin ini
  let totalSubmissions = 0;
  userForms.forEach((f) => (totalSubmissions += f.responses));

  // Ambil 3 form terbaru untuk dipasang di Recent Forms Table
  const recentForms = userForms.slice(0, 3);

  return {
    stats: [
      {
        label: "Total Forms",
        value: String(userForms.length),
        change: "+1",
      },
      {
        label: "Total Submissions",
        value: String(totalSubmissions),
        change: `+${totalSubmissions}`,
      },
      {
        label: "Active Blobs",
        value: String(userForms.filter((f) => f.status === "Active").length),
        change: "Stable",
      },
      {
        label: "Security Level",
        value: "Encrypted",
        change: "Max",
      },
    ],
    recentForms,
  };
}
