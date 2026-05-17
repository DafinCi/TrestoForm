"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useBuilderSchemaStore } from "@/store/builder-store";
import { FieldDefinition } from "@/constants/field-definitions";
import MobileSheet from "./mobile-sheet";
import MobileTrigger from "./mobile-trigger";
import MobileCategoryTabs from "./mobile-category-tabs";
import MobileSearch from "./mobile-search";
import MobileFieldGrid from "./mobile-field-grid";
import MobileRecent, { saveRecentField } from "./mobile-recent";

export default function MobilePalette() {
  const addField = useBuilderSchemaStore((s) => s.addField);

  // -- UI States --
  const [isOpen, setIsOpen] = useState(false);
  const [hasMounted, setHasMounted] = useState(false); // Untuk Lazy Loading

  // -- Palette States --
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  // Lazy Mount Logic: Catat bahwa sheet sudah pernah dibuka
  useEffect(() => {
    if (isOpen && !hasMounted) {
      setHasMounted(true);
    }
  }, [isOpen, hasMounted]);

  // Handler Utama: Eksekusi penambahan field & UX Feedback
  const handleAddField = useCallback(
    (template: FieldDefinition) => {
      // 1. Masukkan ke Canvas
      addField(template);

      saveRecentField(template.type);

      // 2. Haptic Feedback (Vibrasi Native)
      if (typeof window !== "undefined" && navigator.vibrate) {
        navigator.vibrate(50);
      }

      // 3. Auto-close Sheet (Sesuai strategi: Ephemeral UI)
      setIsOpen(false);

      // Opsional: Reset search agar saat dibuka lagi kondisinya bersih
      // setSearchQuery("");
    },
    [addField],
  );

  return (
    <>
      {/* Bagian ini biasanya lu pindahin ke mobile-bottom-toolbar.tsx 
        kalau lu punya file terpisah, tapi gw taruh sini sebagai ilustrasi "Entry Point".
      */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <MobileTrigger onClick={() => setIsOpen(true)} isOpen={isOpen} />
      </div>

      {/* Physics Engine (Bottom Sheet) */}
      <MobileSheet isOpen={isOpen} onOpenChange={setIsOpen}>
        {/* LAZY MOUNTING: Render isinya HANYA jika sudah pernah dibuka minimal sekali */}
        {hasMounted && (
          <div className="flex flex-col h-full overflow-hidden animate-in fade-in duration-300">
            {/* 1. Area Header: Search (Local State) */}
            <div className="shrink-0 pb-3">
              <MobileSearch
                query={searchQuery}
                onQueryChange={setSearchQuery}
              />
            </div>

            {/* 2. Area Navigasi: Horizontal Category Chips */}
            <div className="shrink-0 pb-4 border-b border-border/50">
              <MobileCategoryTabs
                active={activeCategory}
                onChange={setActiveCategory}
              />
            </div>

            {/* 3. Area Konten Utama (Scrollable) */}
            <div className="flex-1 overflow-y-auto scrollbar-hide pt-4 pb-12 space-y-8">
              {/* Tampilkan Recently Used HANYA jika tidak sedang searching */}
              {!searchQuery && activeCategory === "All" && (
                <MobileRecent onAdd={handleAddField} />
              )}

              {/* Grid 2-Kolom dengan Tap Target Besar */}
              <MobileFieldGrid
                searchQuery={searchQuery}
                activeCategory={activeCategory}
                onAdd={handleAddField}
              />
            </div>
          </div>
        )}
      </MobileSheet>
    </>
  );
}
