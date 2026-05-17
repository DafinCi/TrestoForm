"use client";

import React, { useMemo } from "react";
import { FIELD_DEFINITIONS } from "@/constants/field-definitions";

interface MobileCategoryTabsProps {
  active: string;
  onChange: (category: string) => void;
}

export default function MobileCategoryTabs({
  active,
  onChange,
}: MobileCategoryTabsProps) {
  // Ambil daftar kategori unik dari konstanta field kita, tambahkan "All" di depan
  const categories = useMemo(() => {
    const unique = Array.from(
      new Set(FIELD_DEFINITIONS.map((f) => f.category)),
    );
    return ["All", ...unique];
  }, []);

  return (
    <div className="w-full relative">
      {/* Container Scroll Horizontal:
        - overflow-x-auto: Bisa discroll ke samping
        - snap-x snap-mandatory: Mengunci pergerakan agar pas berhenti di awal chip
        - scrollbar-hide / gaya CSS none: Menyembunyikan scrollbar native yang jelek
      */}
      <div
        className="flex items-center gap-2 overflow-x-auto snap-x snap-mandatory px-1 pb-1"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }} // Fallback browser
      >
        {/* Hack untuk sembunyikan scrollbar di Webkit/Chrome */}
        <style
          dangerouslySetInnerHTML={{
            __html: `
          .overflow-x-auto::-webkit-scrollbar { display: none; }
        `,
          }}
        />

        {categories.map((cat) => {
          const isActive = active === cat;

          return (
            <button
              key={cat}
              onClick={() => onChange(cat)}
              className={`
                snap-start shrink-0 h-[34px] px-4 rounded-full text-[13px] font-semibold
                transition-colors duration-200 ease-out whitespace-nowrap outline-none
                /* Tap target yang nyaman untuk jari (h-[34px] + padding) */
                ${
                  isActive
                    ? "bg-foreground text-background shadow-md" // Style high-contrast untuk chip aktif
                    : "bg-muted/70 text-muted-foreground hover:bg-muted active:bg-muted-foreground/20"
                }
              `}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* UX Polish: Fade Gradient di ujung kanan.
        Ini ngasih isyarat visual ke user kalau "Masih ada menu lain lho di sebelah kanan"
        tanpa perlu pakai panah (yang makan tempat).
      */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  );
}
