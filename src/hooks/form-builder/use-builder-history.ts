"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { useBuilderSchemaStore } from "@/store/builder-store";
import { FormField } from "@/types/field";

// Batasan panjang riwayat biar browser nggak nge-lag (bisa disesuaikan)
const HISTORY_LIMIT = 50;

export function useBuilderHistory() {
  // State UI: Untuk mendeteksi apakah tombol Undo/Redo harus aktif atau disable
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  // Gunakan useRef untuk menyimpan data riwayat agar tidak me-trigger re-render berlebih
  const past = useRef<FormField[][]>([]);
  const future = useRef<FormField[][]>([]);

  // Flag pengaman: Mencegah infinite loop saat fungsi undo/redo sedang berjalan
  const isTimeTraveling = useRef(false);

  useEffect(() => {
    // Subscribe memantau setiap kali ada perubahan di state Zustand
    const unsubscribe = useBuilderSchemaStore.subscribe(
      (currentState, prevState) => {
        // 1. Kalau perubahan ini terjadi karena kita pencet tombol Undo/Redo, ABAIKAN!
        if (isTimeTraveling.current) {
          isTimeTraveling.current = false;
          return;
        }

        // 2. Kita cuma peduli kalau array 'fields' (area Canvas) yang berubah
        if (currentState.fields !== prevState.fields) {
          // Simpan state SEBELUMNYA ke dalam array past
          past.current.push(prevState.fields);

          // Hapus jejak paling lama kalau melebihi batas limit
          if (past.current.length > HISTORY_LIMIT) {
            past.current.shift();
          }

          // Tiap ada aksi baru (drag baru, hapus baru), masa depan (redo) harus di-reset
          future.current = [];

          // Update status tombol
          setCanUndo(past.current.length > 0);
          setCanRedo(future.current.length > 0);
        }
      },
    );

    return () => unsubscribe();
  }, []);

  // === FUNGSI UNDO ===
  const undo = useCallback(() => {
    if (past.current.length === 0) return;

    const currentFields = useBuilderSchemaStore.getState().fields;
    const previousFields = past.current.pop()!; // Ambil state terakhir dari past

    future.current.push(currentFields); // Pindahkan state sekarang ke future

    isTimeTraveling.current = true; // Kunci gembok biar subscribe nggak nyatet
    useBuilderSchemaStore.getState().setFields(previousFields); // Mundur 1 langkah

    setCanUndo(past.current.length > 0);
    setCanRedo(future.current.length > 0);
  }, []);

  // === FUNGSI REDO ===
  const redo = useCallback(() => {
    if (future.current.length === 0) return;

    const currentFields = useBuilderSchemaStore.getState().fields;
    const nextFields = future.current.pop()!; // Ambil state dari masa depan

    past.current.push(currentFields); // Pindahkan state sekarang balik ke past

    isTimeTraveling.current = true; // Kunci gembok lagi
    useBuilderSchemaStore.getState().setFields(nextFields); // Maju 1 langkah

    setCanUndo(past.current.length > 0);
    setCanRedo(future.current.length > 0);
  }, []);

  // Shortcut keyboard support (Opsional, tapi bikin form builder lu kerasa premium)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        redo();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo]);

  return { undo, redo, canUndo, canRedo };
}
