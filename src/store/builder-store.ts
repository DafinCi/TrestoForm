import { create } from "zustand";
import { persist } from "zustand/middleware";
import { FormField, FieldType } from "@/types/field";

// ============================================================================
// 1. UI STORE
// Mengatur state visual, panel, zoom, dan device preview.
// ============================================================================

interface BuilderUIState {
  viewMode: "builder" | "preview";
  device: "desktop" | "tablet" | "mobile";
  zoom: number;
  activeFieldId: string | null;
  isSaving: boolean;

  // Config Panel State
  isConfigOpen: boolean;
  configWidth: number;
  activeConfigTab: "basic" | "validation" | "logic" | "advanced";

  // 🌟 NEW: Mobile Palette Drawer State
  isPaletteOpen: boolean;

  // Actions
  setViewMode: (mode: "builder" | "preview") => void;
  setDevice: (device: "desktop" | "tablet" | "mobile") => void;
  setZoom: (zoom: number) => void;
  setActiveField: (id: string | null) => void;
  setIsSaving: (status: boolean) => void;

  toggleConfig: () => void;
  openConfig: () => void;
  closeConfig: () => void;
  setConfigWidth: (width: number) => void;
  setActiveConfigTab: (
    tab: "basic" | "validation" | "logic" | "advanced",
  ) => void;

  // 🌟 NEW: Mobile Palette Actions
  openPalette: () => void;
  closePalette: () => void;
  togglePalette: () => void;
}

export const useBuilderUIStore = create<BuilderUIState>()(
  persist(
    (set) => ({
      // Default States
      viewMode: "builder",
      device: "desktop",
      zoom: 100,
      activeFieldId: null,
      isSaving: false,

      // Config Panel States
      isConfigOpen: false,
      configWidth: 350,
      activeConfigTab: "basic",

      // 🌟 NEW: Default Mobile Palette State
      isPaletteOpen: false,

      // Actions
      setViewMode: (mode) => set({ viewMode: mode }),
      setDevice: (device) => set({ device }),
      setZoom: (zoom) => set({ zoom }),

      // Logic: Saat field dipilih, otomatis buka panel config
      setActiveField: (id) =>
        set({
          activeFieldId: id,
          isConfigOpen: id ? true : false,
        }),

      toggleConfig: () =>
        set((state) => ({ isConfigOpen: !state.isConfigOpen })),
      openConfig: () => set({ isConfigOpen: true }),
      closeConfig: () => set({ isConfigOpen: false }),
      setConfigWidth: (width) => set({ configWidth: width }),
      setActiveConfigTab: (tab) => set({ activeConfigTab: tab }),
      setIsSaving: (status) => set({ isSaving: status }),

      // 🌟 NEW: Mobile Palette Handlers
      openPalette: () => set({ isPaletteOpen: true }),
      closePalette: () => set({ isPaletteOpen: false }),
      togglePalette: () =>
        set((state) => ({ isPaletteOpen: !state.isPaletteOpen })),
    }),
    {
      name: "builder-ui-storage",
      // Hanya simpan state tertentu yang krusial bagi kenyamanan user
      partialize: (state) => ({
        configWidth: state.configWidth,
        device: state.device,
      }),
    },
  ),
);

// ============================================================================
// 2. SCHEMA STORE
// Mengatur struktur data form (Field, Title, Logic).
// ============================================================================

interface BuilderSchemaState {
  title: string;
  description: string;
  fields: FormField[];

  // Actions
  setTitle: (title: string) => void;
  setDescription: (desc: string) => void;

  addField: (template: Partial<FormField> & { type: FieldType }) => void;
  removeField: (id: string) => void;
  updateField: (id: string, updates: Partial<FormField>) => void;

  // DnD Action
  reorderFields: (activeId: string, overId: string) => void;

  // 🌟 NEW: Hybrid Accessibility Reorder (Mobile Arrow Buttons)
  moveFieldUp: (id: string) => void;
  moveFieldDown: (id: string) => void;

  // Bulk Actions
  setFields: (fields: FormField[]) => void;
}

export const useBuilderSchemaStore = create<BuilderSchemaState>()(
  persist(
    (set) => ({
      title: "Untitled Form",
      description: "Click to edit description",
      fields: [],

      setTitle: (title) => set({ title }),
      setDescription: (description) => set({ description }),

      addField: (template) =>
        set((state) => {
          const newField: FormField = {
            ...template,
            id: crypto.randomUUID(),
            label: template.label || `New ${template.type}`,
            description: template.description || "",
            required: template.required ?? false,
            isSensitive: template.isSensitive ?? false,
            publicVisible: template.publicVisible ?? true,

            // Sesuai dengan schema field.ts lu yang baru
            validation: template.validation || {},
            metadata: template.metadata || {
              walrusEpochs: 1,
              encryptionType: "none",
            },

            ...template,
          } as FormField;

          // 🌟 FIX ISSUE #5: Otomatis set field ini jadi aktif biar config panel kebuka
          // Kita pakai setTimeout 0 supaya state render React gak tabrakan sama proses drag-and-drop dnd-kit
          setTimeout(() => {
            useBuilderUIStore.getState().setActiveField(newField.id);
          }, 0);

          return {
            fields: [...state.fields, newField],
          };
        }),

      removeField: (id) =>
        set((state) => {
          // 🌟 REFILLING GC: Jika field yang dihapus sedang aktif di config panel, hilangkan seleksinya
          const currentActiveId = useBuilderUIStore.getState().activeFieldId;
          if (currentActiveId === id) {
            useBuilderUIStore.getState().setActiveField(null);
          }

          return {
            fields: state.fields.filter((f) => f.id !== id),
          };
        }),

      updateField: (id, updates) =>
        set((state) => ({
          fields: state.fields.map((f) =>
            f.id === id ? { ...f, ...updates } : f,
          ),
        })),

      reorderFields: (activeId, overId) =>
        set((state) => {
          const oldIndex = state.fields.findIndex((f) => f.id === activeId);
          const newIndex = state.fields.findIndex((f) => f.id === overId);

          if (oldIndex !== -1 && newIndex !== -1) {
            const newFields = [...state.fields];
            const [movedItem] = newFields.splice(oldIndex, 1);
            newFields.splice(newIndex, 0, movedItem);
            return { fields: newFields };
          }

          return state;
        }),

      // 🌟 NEW: Geser field ke atas lewat array swapping
      moveFieldUp: (id) =>
        set((state) => {
          const index = state.fields.findIndex((f) => f.id === id);
          if (index <= 0) return state; // Sudah paling atas atau tidak ditemukan

          const newFields = [...state.fields];
          // Tukar posisi dengan elemen sebelumnya
          [newFields[index - 1], newFields[index]] = [
            newFields[index],
            newFields[index - 1],
          ];

          return { fields: newFields };
        }),

      // 🌟 NEW: Geser field ke bawah lewat array swapping
      moveFieldDown: (id) =>
        set((state) => {
          const index = state.fields.findIndex((f) => f.id === id);
          if (index === -1 || index >= state.fields.length - 1) return state; // Sudah paling bawah

          const newFields = [...state.fields];
          // Tukar posisi dengan elemen setelahnya
          [newFields[index + 1], newFields[index]] = [
            newFields[index],
            newFields[index + 1],
          ];

          return { fields: newFields };
        }),

      setFields: (fields) => set({ fields }),
    }),
    {
      // 🌟 FIX ISSUE #3: Persist state ke localStorage supaya aman pas refresh
      name: "builder-schema-storage",
    },
  ),
);

// Shortcut alias
export const useBuilderSelectionStore = useBuilderUIStore;
