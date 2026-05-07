import { FormField } from "./field";

export interface FormSettings {
  allowAnonymous: boolean; // Harus connect wallet (Sui) atau nggak?
  globalVisibility: "public" | "private" | "hybrid";
}

export interface FormSchema {
  id: string;
  title: string;
  description?: string;
  fields: FormField[];
  settings: FormSettings; // Tambahan: Biar ada control global buat form ini
}
