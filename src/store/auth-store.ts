// =============================================================================
// src/store/auth-store.ts
// Consumer State untuk Auth - Menggunakan Finite State Machine
// =============================================================================

import { create } from "zustand";

export type AuthStatus =
  | "idle" // Initial state (belum ngapa-ngapain)
  | "checking" // Sedang mengecek session cookie ke server saat page load
  | "unauthenticated" // Session tidak ada / tidak valid
  | "authenticating" // Sedang proses kirim signature ke server
  | "authenticated"; // Session valid dan aktif

interface AuthState {
  authStatus: AuthStatus;
  userAddress: string | null;

  // Actions
  verifySignature: (signature: string, bytes: string) => Promise<boolean>;
  checkSession: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  authStatus: "idle",
  userAddress: null,

  /**
   * 1. Mengirim hasil Sign Message (dari wallet) ke backend satpam kita.
   */
  verifySignature: async (signature: string, bytes: string) => {
    set({ authStatus: "authenticating" });

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ signature, bytes }),
      });

      if (response.ok) {
        const data = await response.json();
        set({ authStatus: "authenticated", userAddress: data.address });
        return true;
      } else {
        // Jika server menolak (signature invalid/tampered)
        set({ authStatus: "unauthenticated", userAddress: null });
        return false;
      }
    } catch (error) {
      console.error("[AuthStore] Error verifying signature:", error);
      set({ authStatus: "unauthenticated", userAddress: null });
      return false;
    }
  },

  /**
   * 2. Mengecek apakah browser masih punya HTTP-Only Cookie yang valid.
   * Biasanya dipanggil di useEffect saat aplikasi pertama load (hydration).
   */
  checkSession: async () => {
    set({ authStatus: "checking" });

    try {
      // Kita akan butuh endpoint kecil ini nanti buat baca verifySession()
      const response = await fetch("/api/auth/session", {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        set({ authStatus: "authenticated", userAddress: data.address });
      } else {
        set({ authStatus: "unauthenticated", userAddress: null });
      }
    } catch (error) {
      console.error("[AuthStore] Error checking session:", error);
      set({ authStatus: "unauthenticated", userAddress: null });
    }
  },

  /**
   * 3. Menghapus session di server (buang cookie) dan mereset state lokal.
   */
  logout: async () => {
    // Ubah ke checking agar UI bisa kasih loading spinner saat proses logout
    set({ authStatus: "checking" });

    try {
      // Kita akan butuh endpoint kecil ini nanti buat panggil deleteSession()
      await fetch("/api/auth/logout", {
        method: "POST",
      });
    } catch (error) {
      console.error("[AuthStore] Error during logout:", error);
    } finally {
      // Apapun yang terjadi di jaringan, frontend harus maksa logout
      set({ authStatus: "unauthenticated", userAddress: null });
    }
  },
}));
