"use client";

import React, { useEffect } from "react";
import BuilderDndProvider from "./builder-context";
import { WorkspaceShell } from "./workspace";
import { useBuilderSchemaStore } from "@/store/builder-store";
import { FormField } from "@/types/field";

interface FormBuilderProps {
  /**
   * Jika ada initialData, berarti kita ada di rute [formId] (Mode Edit).
   * Jika undefined, berarti kita ada di rute /create (Mode Baru).
   */
  initialData?: {
    title?: string;
    description?: string;
    fields?: FormField[];
  };
}

export default function FormBuilder({ initialData }: FormBuilderProps) {
  // Ambil action dari store untuk menyuntikkan data (Data Injection)
  const setFields = useBuilderSchemaStore((s) => s.setFields);
  const setTitle = useBuilderSchemaStore((s) => s.setTitle);
  const setDescription = useBuilderSchemaStore((s) => s.setDescription);

  // Jalankan efek ini hanya saat pertama kali komponen dirender / data berubah
  useEffect(() => {
    if (initialData) {
      // 📝 MODE EDIT: Suntikkan data dari Database/Walrus ke dalam Store
      if (initialData.fields) setFields(initialData.fields);
      if (initialData.title) setTitle(initialData.title);
      if (initialData.description) setDescription(initialData.description);
    } else {
      // ✨ MODE CREATE: Pastikan kanvas bersih dari sisa memory sebelumnya
      setFields([]);
      setTitle("Untitled Form");
      setDescription("Click to edit description");
    }
  }, [initialData, setFields, setTitle, setDescription]);

  return (
    // Membungkus shell dengan context drag-and-drop
    <BuilderDndProvider>
      <WorkspaceShell />
    </BuilderDndProvider>
  );
}
