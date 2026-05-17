import { create } from "zustand";

export type UploadStatus = "idle" | "uploading" | "success" | "error";

export interface UploadTask {
  id: string; // Unik untuk setiap file
  fieldId: string; // Field mana di form yang punya file ini
  file: File;
  progress: number;
  status: UploadStatus;
  blobId?: string; // Hasil dari Walrus
  previewUrl?: string; // ObjectURL untuk UI (wajib di-revoke nanti)
  errorMessage?: string;
}

interface UploadStore {
  tasks: Record<string, UploadTask>;

  // Actions
  addUpload: (task: Omit<UploadTask, "progress" | "status">) => void;
  updateProgress: (id: string, progress: number) => void;
  setSuccess: (id: string, blobId: string) => void;
  setError: (id: string, error: string) => void;
  removeUpload: (id: string) => void;
  clearAll: () => void;
}

export const useUploadStore = create<UploadStore>((set) => ({
  tasks: {},

  addUpload: (task) =>
    set((state) => ({
      tasks: {
        ...state.tasks,
        [task.id]: {
          ...task,
          progress: 0,
          status: "uploading",
        },
      },
    })),

  updateProgress: (id, progress) =>
    set((state) => {
      const task = state.tasks[id];
      if (!task) return state;
      return {
        tasks: {
          ...state.tasks,
          [id]: { ...task, progress },
        },
      };
    }),

  setSuccess: (id, blobId) =>
    set((state) => {
      const task = state.tasks[id];
      if (!task) return state;
      return {
        tasks: {
          ...state.tasks,
          [id]: { ...task, status: "success", progress: 100, blobId },
        },
      };
    }),

  setError: (id, errorMessage) =>
    set((state) => {
      const task = state.tasks[id];
      if (!task) return state;
      return {
        tasks: {
          ...state.tasks,
          [id]: { ...task, status: "error", errorMessage },
        },
      };
    }),

  removeUpload: (id) =>
    set((state) => {
      const newTasks = { ...state.tasks };

      // MENCEGAH MEMORY LEAK! Revoke object URL sebelum dihapus dari memori
      if (newTasks[id]?.previewUrl) {
        URL.revokeObjectURL(newTasks[id].previewUrl!);
      }

      delete newTasks[id];
      return { tasks: newTasks };
    }),

  clearAll: () => set({ tasks: {} }),
}));
