"use client";

import React from "react";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";
import { useBuilderSchemaStore } from "@/store/builder-store";
import { cn } from "@/lib/utils";

interface MobileReorderControlsProps {
  fieldId: string;
  /** * Opsional: Jika lu menggunakan dnd-kit (@dnd-kit/sortable),
   * pasang listeners dan attributes dari `useSortable` ke sini.
   */
  dragListeners?: any;
  dragAttributes?: any;
}

export default function MobileReorderControls({
  fieldId,
  dragListeners,
  dragAttributes,
}: MobileReorderControlsProps) {
  // Ambil state dan action atomik yang baru kita buat di store
  const fields = useBuilderSchemaStore((s) => s.fields);
  const moveFieldUp = useBuilderSchemaStore((s) => s.moveFieldUp);
  const moveFieldDown = useBuilderSchemaStore((s) => s.moveFieldDown);

  // Cari posisi index saat ini untuk mengatur status disabled pada panah
  const index = fields.findIndex((f) => f.id === fieldId);
  const isFirst = index === 0;
  const isLast = index === fields.length - 1;

  // Jika field tidak ditemukan (safety guard), jangan render apa-apa
  if (index === -1) return null;

  return (
    <div className="flex items-center bg-background/95 backdrop-blur border border-border shadow-xl rounded-xl p-0.5 select-none pointer-events-auto">
      {/* 1. PANAH ATAS (PRESISI ABSOLUT) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Mencegah re-trigger active state pada card field
          moveFieldUp(fieldId);
        }}
        disabled={isFirst}
        className={cn(
          "p-2.5 text-foreground hover:bg-accent active:bg-accent transition-colors rounded-lg",
          "disabled:opacity-20 disabled:hover:bg-transparent min-w-[40px] min-h-[40px] flex items-center justify-center",
        )}
        aria-label="Move field up"
      >
        <ChevronUp size={18} />
      </button>

      {/* SEPARATOR VERTIKAL */}
      <div className="w-[1px] h-5 bg-border mx-0.5" />

      {/* 2. DRAG HANDLE (CEPAT & GERAK JAUH) */}
      <div
        {...dragAttributes}
        {...dragListeners}
        className={cn(
          "p-2.5 text-muted-foreground hover:text-foreground hover:bg-accent active:bg-accent/80 transition-colors rounded-lg cursor-grab active:cursor-grabbing",
          "min-w-[40px] min-h-[40px] flex items-center justify-center",
          "touch-none", // 🚨 KRUSIAL: Mematikan default scroll browser saat area ini ditekan di HP
        )}
        title="Hold and drag to reorder"
      >
        <GripVertical size={18} />
      </div>

      {/* SEPARATOR VERTIKAL */}
      <div className="w-[1px] h-5 bg-border mx-0.5" />

      {/* 3. PANAH BAWAH (PRESISI ABSOLUT) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation(); // Mencegah re-trigger active state pada card field
          moveFieldDown(fieldId);
        }}
        disabled={isLast}
        className={cn(
          "p-2.5 text-foreground hover:bg-accent active:bg-accent transition-colors rounded-lg",
          "disabled:opacity-20 disabled:hover:bg-transparent min-w-[40px] min-h-[40px] flex items-center justify-center",
        )}
        aria-label="Move field down"
      >
        <ChevronDown size={18} />
      </button>
    </div>
  );
}
