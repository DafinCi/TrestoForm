"use client";

import React from "react";
import { Plus, Settings2, Eye, PenTool } from "lucide-react";
import { useBuilderUIStore } from "@/store/builder-store";
import { cn } from "@/lib/utils";

export default function MobileBottomToolbar() {
  const { openPalette, openConfig, activeFieldId, viewMode, setViewMode } =
    useBuilderUIStore();

  return (
    <div className="flex items-center justify-around bg-card/95 backdrop-blur-md border-t border-border p-3 shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-2xl">
      {/* 1. TOMBOL TOGGLE VIEW (KIRI) */}
      <button
        onClick={() =>
          setViewMode(viewMode === "builder" ? "preview" : "builder")
        }
        className="flex flex-col items-center justify-center gap-1 p-2 w-16 text-muted-foreground hover:text-foreground transition-colors"
      >
        {viewMode === "builder" ? (
          <>
            <Eye size={20} />
            <span className="text-[10px] font-medium">Preview</span>
          </>
        ) : (
          <>
            <PenTool size={20} />
            <span className="text-[10px] font-medium">Builder</span>
          </>
        )}
      </button>

      {/* 2. TOMBOL UTAMA: ADD FIELD (TENGAH) */}
      <div className="relative -top-6">
        <button
          onClick={openPalette}
          className="flex items-center justify-center w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:scale-105 active:scale-95 transition-transform"
          aria-label="Add new field"
        >
          <Plus size={28} />
        </button>
      </div>

      {/* 3. TOMBOL CONFIG (KANAN) */}
      <button
        onClick={openConfig}
        className={cn(
          "relative flex flex-col items-center justify-center gap-1 p-2 w-16 transition-colors",
          activeFieldId
            ? "text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Settings2 size={20} />
        <span className="text-[10px] font-medium">Settings</span>

        {/* Indikator Merah/Primary kalau ada field yang sedang dipilih */}
        {activeFieldId && (
          <span className="absolute top-1 right-3 w-2 h-2 bg-red-500 rounded-full border border-card" />
        )}
      </button>
    </div>
  );
}
