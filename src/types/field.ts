export type FieldType =
  | "text"
  | "textarea"
  | "select"
  | "checkbox"
  | "rating"
  | "file"
  | "url";

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required?: boolean;

  options?: string[];

  isSensitive?: boolean;

  publicVisible?: boolean;
}
