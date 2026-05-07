import { create } from "zustand";
import { FormField } from "@/types/field";

interface FormBuilderStore {
  fields: FormField[];

  addField: (field: FormField) => void;

  removeField: (id: string) => void;
}

export const useFormBuilderStore = create<FormBuilderStore>((set) => ({
  fields: [],

  addField: (field) =>
    set((state) => ({
      fields: [...state.fields, field],
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
    })),
}));
