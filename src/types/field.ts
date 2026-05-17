export type FieldType =
  | "text"
  | "number"
  | "textarea"
  | "richtext"
  | "select"
  | "radio"
  | "checkbox"
  | "rating"
  | "date"
  | "url"
  | "email"
  | "phone"
  | "file"
  | "video"
  | "image";

export interface FieldOption {
  id: string;
  label: string;
  value: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  description?: string;
  required: boolean;
  isSensitive: boolean;
  publicVisible: boolean;
  options?: FieldOption[];
  // Tambahan: Default value untuk field statis
  defaultValue?: any;

  validation?: {
    required?: boolean;
    customErrorMessage?: string;

    // Text based
    minLength?: number;
    maxLength?: number;
    format?: "none" | "email" | "url" | "phone";

    // Number / Rating
    min?: number;
    max?: number;

    // File & Media (Walrus Ready)
    maxFileSize?: number; // MB
    allowedFileTypes?: string[];
    maxDuration?: number; // Khusus video (detik)
    allowMultiple?: boolean;
  };

  // State khusus untuk integrasi 3rd party
  metadata?: {
    walrusEpochs?: number; // Berapa lama file disimpan di Walrus
    encryptionType?: "none" | "seal-aes" | "homomorphic";
  };
}
