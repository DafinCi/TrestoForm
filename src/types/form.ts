import { FormField } from "./field";

export interface FormSchema {
  id: string;
  title: string;
  description?: string;

  fields: FormField[];
}
