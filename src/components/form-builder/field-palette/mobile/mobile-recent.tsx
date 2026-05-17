"use client";

import React, { useState, useEffect } from "react";
import {
  FIELD_DEFINITIONS,
  FieldDefinition,
} from "@/constants/field-definitions";
import { Clock } from "lucide-react";

const RECENT_FIELDS_KEY = "builder-recent-fields";

// 🔥 Utility Helper: Export ini agar bisa dipanggil dari mobile-palette.tsx
export const saveRecentField = (type: string) => {
  try {
    const stored = localStorage.getItem(RECENT_FIELDS_KEY);
    let recents: string[] = stored ? JSON.parse(stored) : [];

    // Hapus duplikat kalau field udah pernah ada sebelumnya
    recents = recents.filter((r) => r !== type);

    // Masukkan ke urutan paling depan
    recents.unshift(type);

    // Batasi maksimal 5 history saja biar gak menuh-menuhin RAM
    if (recents.length > 5) recents = recents.slice(0, 5);

    localStorage.setItem(RECENT_FIELDS_KEY, JSON.stringify(recents));

    // Broadcast custom event biar komponen ini otomatis re-render tanpa refresh
    window.dispatchEvent(new Event("recent-fields-changed"));
  } catch (e) {
    console.error("Gagal menyimpan recent field:", e);
  }
};

interface MobileRecentProps {
  onAdd: (field: FieldDefinition) => void;
}

export default function MobileRecent({ onAdd }: MobileRecentProps) {
  const [recentTypes, setRecentTypes] = useState<string[]>([]);

  useEffect(() => {
    const loadRecents = () => {
      try {
        const stored = localStorage.getItem(RECENT_FIELDS_KEY);
        if (stored) setRecentTypes(JSON.parse(stored));
      } catch (e) {
        // Abaikan kalau parse error
      }
    };

    // Load saat pertama kali di-mount
    loadRecents();

    // Listen kalau ada penambahan field baru
    window.addEventListener("recent-fields-changed", loadRecents);
    return () =>
      window.removeEventListener("recent-fields-changed", loadRecents);
  }, []);

  // Kalau belum ada history, jangan render apa-apa (Sembunyikan seutuhnya)
  if (recentTypes.length === 0) return null;

  // Petakan array tipe (string) kembali menjadi object FieldDefinition utuh
  const recentFields = recentTypes
    .map((type) => FIELD_DEFINITIONS.find((f) => f.type === type))
    .filter(Boolean) as FieldDefinition[];

  return (
    <div className="w-full mb-2">
      {/* Header Section */}
      <div className="flex items-center gap-1.5 px-2 mb-3 text-muted-foreground/80">
        <Clock className="w-4 h-4" />
        <h3 className="text-[11px] font-bold uppercase tracking-wider">
          Recently Used
        </h3>
      </div>

      {/* Horizontal Scroll Container (Hemat Vertikal Space) */}
      <div
        className="flex gap-2.5 overflow-x-auto snap-x snap-mandatory px-1 pb-2"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .overflow-x-auto::-webkit-scrollbar { display: none; }
        `,
          }}
        />

        {recentFields.map((field) => {
          const Icon = field.icon;
          return (
            <button
              key={field.type}
              onClick={() => onAdd(field)}
              className={`
                snap-start shrink-0 flex flex-col items-center justify-center
                w-[84px] h-[76px] p-2 rounded-2xl outline-none select-none
                bg-muted/30 border border-border/50 shadow-sm
                transition-all duration-200 ease-out
                active:scale-95 active:bg-muted/60
              `}
            >
              <div className="p-2 rounded-xl bg-background/80 text-foreground mb-1.5 shadow-sm pointer-events-none">
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[10px] font-semibold text-foreground/80 leading-tight text-center truncate w-full pointer-events-none">
                {field.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
