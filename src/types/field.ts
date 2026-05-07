export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "rating"
  | "file"
  | "url";

export interface FormField {
  id: string; // Pastikan nanti pakai UUID/crypto.randomUUID()
  type: FieldType;
  label: string;
  description?: string; // Tambahan: Biar UI-nya bisa kasih teks bantuan kecil
  placeholder?: string;
  required: boolean; // Bikin required non-opsional dengan default false aja, biar Zod gampang

  options?: string[]; // Khusus buat select/checkbox

  // Privacy & Walrus/Seal Specific
  isSensitive: boolean; // Default false
  publicVisible: boolean; // Default true

  // Tambahan: Buat bekal Zod Validation nanti
  validation?: {
    min?: number;
    max?: number;
    maxFileSize?: number; // Khusus file upload ke Walrus
  };
}
