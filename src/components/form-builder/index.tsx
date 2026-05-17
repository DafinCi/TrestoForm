"use client";

import React, { useEffect, useState } from "react";
import BuilderDndProvider from "./builder-context";
import { WorkspaceShell } from "./workspace";
import { useBuilderSchemaStore } from "@/store/builder-store";
import { FormField } from "@/types/field";

interface FormBuilderProps {
  initialData?: {
    title?: string;
    description?: string;
    fields?: FormField[];
  };
}

export default function FormBuilder({ initialData }: FormBuilderProps) {
  const setFields = useBuilderSchemaStore((s) => s.setFields);
  const setTitle = useBuilderSchemaStore((s) => s.setTitle);
  const setDescription = useBuilderSchemaStore((s) => s.setDescription);

  // 🌟 FIX HYDRATION: Bikin state penanda bahwa komponen sudah mount di browser
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Tandai bahwa ini udah di sisi Client (Browser)
    setIsMounted(true);

    // 📝 MODE EDIT: Suntikkan data HANYA jika initialData dari DB tersedia.
    // Kita hapus blok `else` supaya data LocalStorage hasil persist nggak ke-reset otomatis.
    if (initialData) {
      if (initialData.fields) setFields(initialData.fields);
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);
    }
  }, [initialData, setFields, setTitle, setDescription]);

  // Selama belum mounted (masih dirender Next.js server), jangan render isinya
  // Ini buat mencegah Hydration Mismatch error.
  if (!isMounted) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <span className="text-sm text-muted-foreground animate-pulse">
          Loading workspace...
        </span>
      </div>
    );
  }

  return (
    // Membungkus shell dengan context drag-and-drop
    <BuilderDndProvider>
      <WorkspaceShell />
    </BuilderDndProvider>
  );
}
