"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useFormBuilderStore } from "@/store/form-builder-store";

// Lazy Loading Wrapper agar UI Header selalu tampil, sisanya disusul
const FormBuilderHeader = dynamic(
  () => import("@/components/form-builder/form-builder-header"),
  { ssr: false },
);
const BuilderWorkspace = dynamic(
  () => import("@/components/form-builder/builder-workspace"),
  { ssr: false },
);
const FormPreview = dynamic(
  () => import("@/components/form-builder/form-preview"),
  {
    ssr: false,
    loading: () => (
      <div className="p-12 text-center animate-pulse">Loading Preview...</div>
    ),
  },
);

export default function CreateFormPage() {
  // Hanya ambil viewMode dari store
  const { viewMode } = useFormBuilderStore();

  return (
    <div className="flex flex-col h-full bg-background font-sans">
      {/* 1. Static Header */}
      <FormBuilderHeader />

      {/* 2. Dynamic Workspace Area */}
      <div className="relative flex-1 flex overflow-hidden h-full">
        {viewMode === "builder" ? (
          <BuilderWorkspace />
        ) : (
          <div className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-12">
            <div className="max-w-2xl mx-auto">
              <FormPreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
