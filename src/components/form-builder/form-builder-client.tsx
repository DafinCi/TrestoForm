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
      <div className="p-12 text-center animate-pulse text-muted-foreground font-medium">
        Loading Preview Canvas...
      </div>
    ),
  },
);

export default function FormBuilderClient() {
  const { viewMode } = useFormBuilderStore();

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.16))] min-h-screen bg-background font-sans">
      <FormBuilderHeader />

      <div className="relative flex-1 flex overflow-hidden h-full">
        {viewMode === "builder" ? (
          <BuilderWorkspace />
        ) : (
          <div className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-12">
            <div className="max-w-3xl mx-auto">
              <FormPreview />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
