import { create } from "zustand";
import { FormField } from "@/types/field";

interface FormBuilderStore {
  // Form Metadata
  title: string;
  description: string;

  // Fields State
  fields: FormField[];
  activeFieldId: string | null; // Untuk ngelacak field mana yang lagi di-edit di Sidebar

  // Actions
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;

  addField: (field: FormField) => void;
  updateField: (id: string, updates: Partial<FormField>) => void; // Wajib buat edit label/options
  removeField: (id: string) => void;
  reorderFields: (startIndex: number, endIndex: number) => void; // Wajib buat dnd-kit

  setActiveField: (id: string | null) => void;
}

export const useFormBuilderStore = create<FormBuilderStore>((set) => ({
  title: "Untitled Form",
  description: "",
  fields: [],
  activeFieldId: null,

  setTitle: (title) => set({ title }),
  setDescription: (description) => set({ description }),

  addField: (field) =>
    set((state) => ({
      fields: [...state.fields, field],
      activeFieldId: field.id, // Otomatis fokus ke field yang baru ditambah
    })),

  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((field) =>
        field.id === id ? { ...field, ...updates } : field,
      ),
    })),

  removeField: (id) =>
    set((state) => ({
      fields: state.fields.filter((field) => field.id !== id),
      activeFieldId: state.activeFieldId === id ? null : state.activeFieldId,
    })),

  // Ini fungsi sakti buat dnd-kit nanti
  reorderFields: (startIndex, endIndex) =>
    set((state) => {
      const newFields = [...state.fields];
      const [removed] = newFields.splice(startIndex, 1);
      newFields.splice(endIndex, 0, removed);
      return { fields: newFields };
    }),

  setActiveField: (id) => set({ activeFieldId: id }),
}));
