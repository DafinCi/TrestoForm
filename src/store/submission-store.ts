import { create } from "zustand";
import { SubmissionValue } from "@/types/submissions";

interface SubmissionState {
  // State
  formId: string | null;
  answers: Record<string, SubmissionValue>;
  isSubmitting: boolean;
  errors: Record<string, string>; // Untuk menampung validation error per field di UI

  // Actions
  initializeForm: (formId: string) => void;
  setAnswer: (fieldId: string, value: SubmissionValue) => void;
  clearAnswer: (fieldId: string) => void;
  setFieldError: (fieldId: string, errorMessage: string | null) => void;
  setSubmitting: (status: boolean) => void;
  resetStore: () => void;
}

export const useSubmissionStore = create<SubmissionState>((set) => ({
  // Initial State
  formId: null,
  answers: {},
  isSubmitting: false,
  errors: {},

  // Menginisialisasi store saat responden membuka form baru
  initializeForm: (formId) =>
    set({
      formId,
      answers: {},
      errors: {},
      isSubmitting: false,
    }),

  // Mengubah atau menambah jawaban dengan performa O(1)
  setAnswer: (fieldId, value) =>
    set((state) => ({
      answers: {
        ...state.answers,
        [fieldId]: value,
      },
      // Bersihkan error field jika user mulai mengisi/memperbaiki isinya
      errors: {
        ...state.errors,
        [fieldId]: "",
      },
    })),

  // Menghapus jawaban spesifik (misal jika unchecked atau file di-remove)
  clearAnswer: (fieldId) =>
    set((state) => {
      const newAnswers = { ...state.answers };
      delete newAnswers[fieldId];
      return { answers: newAnswers };
    }),

  // Mencatat error validasi per field agar bisa dirender di bawah input control
  setFieldError: (fieldId, errorMessage) =>
    set((state) => ({
      errors: {
        ...state.errors,
        [fieldId]: errorMessage || "",
      },
    })),

  // Mengatur loading state saat proses pengiriman ke Walrus/Backend sedang berjalan
  setSubmitting: (status) => set({ isSubmitting: status }),

  // Reset total
  resetStore: () =>
    set({
      formId: null,
      answers: {},
      errors: {},
      isSubmitting: false,
    }),
}));
