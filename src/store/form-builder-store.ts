import { create } from "zustand";
import { FormField } from "@/types/field"; // Pastikan path ini sesuai dengan project lu

interface FormBuilderState {
  // === CORE DATA STATE ===
  title: string;
  setTitle: (title: string) => void;

  fields: FormField[];
  addField: (field: FormField) => void;
  removeField: (id: string) => void;
  reorderFields: (oldIndex: number, newIndex: number) => void;

  updateField: (id: string, updates: Partial<FormField>) => void;

  activeFieldId: string | null;
  setActiveField: (id: string | null) => void;

  // === UI LAYOUT STATE ===
  viewMode: "builder" | "preview";
  setViewMode: (mode: "builder" | "preview") => void;

  showLeftSidebar: boolean;
  setShowLeftSidebar: (show: boolean) => void;

  showRightSidebar: boolean;
  setShowRightSidebar: (show: boolean) => void;
}

export const useFormBuilderStore = create<FormBuilderState>((set) => ({
  // --- Core Init ---
  title: "",
  setTitle: (title) => set({ title }),

  fields: [], // Inisialisasi sebagai array kosong, BUKAN undefined
  addField: (field) => set((state) => ({ fields: [...state.fields, field] })),
  removeField: (id) =>
    set((state) => ({ fields: state.fields.filter((f) => f.id !== id) })),
  reorderFields: (oldIndex, newIndex) =>
    set((state) => {
      const newFields = [...state.fields];
      const [movedField] = newFields.splice(oldIndex, 1);
      newFields.splice(newIndex, 0, movedField);
      return { fields: newFields };
    }),

  updateField: (id, updates) =>
    set((state) => ({
      fields: state.fields.map((f) => (f.id === id ? { ...f, ...updates } : f)),
    })),

  activeFieldId: null,
  setActiveField: (id) => set({ activeFieldId: id }),

  // --- UI Init ---
  viewMode: "builder",
  setViewMode: (mode) => set({ viewMode: mode }),

  showLeftSidebar: false,
  setShowLeftSidebar: (show) => set({ showLeftSidebar: show }),

  showRightSidebar: false,
  setShowRightSidebar: (show) => set({ showRightSidebar: show }),
}));
