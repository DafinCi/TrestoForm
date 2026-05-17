"use client";

import React, { useMemo } from "react";
import {
  FIELD_DEFINITIONS,
  FieldDefinition,
} from "@/constants/field-definitions";
import { SearchX } from "lucide-react";

interface MobileFieldGridProps {
  searchQuery: string;
  activeCategory: string;
  onAdd: (field: FieldDefinition) => void;
}

export default function MobileFieldGrid({
  searchQuery,
  activeCategory,
  onAdd,
}: MobileFieldGridProps) {
  // Logic Filtering Cerdas & Terisolasi
  const filteredFields = useMemo(() => {
    return FIELD_DEFINITIONS.filter((field) => {
      // 1. Filter Kategori
      const matchCategory =
        activeCategory === "All" || field.category === activeCategory;

      // 2. Filter Pencarian (Cari di label atau tipe)
      const matchSearch =
        !searchQuery ||
        field.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        field.type.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCategory && matchSearch;
    });
  }, [searchQuery, activeCategory]);

  // Empty State: Kalau yang dicari nggak ada
  if (filteredFields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-in fade-in zoom-in-95 duration-300">
        <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
          <SearchX className="w-6 h-6 text-muted-foreground/50" />
        </div>
        <p className="text-sm font-semibold text-foreground">No fields found</p>
        <p className="text-xs text-muted-foreground mt-1 max-w-[200px]">
          We couldn't find any match for "{searchQuery}" in {activeCategory}.
        </p>
      </div>
    );
  }

  return (
    <div className="px-1">
      <div className="grid grid-cols-2 gap-3">
        {filteredFields.map((field) => {
          const Icon = field.icon;

          return (
            <button
              key={field.type}
              onClick={() => onAdd(field)}
              className={`
                relative flex flex-col items-start p-4 w-full text-left outline-none
                bg-card border border-border/60 rounded-2xl shadow-sm
                transition-all duration-200 ease-out select-none
                /* Mobile Touch Feedback: Kartu mengecil ringan saat ditekan */
                active:scale-[0.96] active:bg-muted/50
              `}
            >
              {/* Bagian Icon */}
              <div className="p-2.5 rounded-xl bg-primary/10 text-primary mb-3 pointer-events-none">
                <Icon className="w-5 h-5" />
              </div>

              {/* Bagian Teks */}
              <div className="w-full flex flex-col pointer-events-none">
                <span className="text-[13px] font-bold text-foreground leading-tight mb-0.5 truncate">
                  {field.label}
                </span>

                {/* Deskripsi sengaja disembunyikan jika layar terlalu sempit (opsional), 
                    tapi line-clamp-1 bikin rapi */}
                <span className="text-[10px] text-muted-foreground line-clamp-1 leading-snug">
                  {field.description ||
                    `Add ${field.label.toLowerCase()} input`}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
