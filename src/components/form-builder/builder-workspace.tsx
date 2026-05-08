"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { Plus, Settings2, ChevronLeft } from "lucide-react";
import { useFormBuilderStore } from "@/store/form-builder-store";

// Lazy Load komponen berat (0% Hydration Error, Fast Loading)
const FieldPalette = dynamic(() => import("./field-palette"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-muted-foreground animate-pulse">
      Loading Palette...
    </div>
  ),
});
const BuilderCanvas = dynamic(() => import("./builder-canvas"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full bg-muted/20 animate-pulse rounded-2xl" />
  ),
});
const FieldConfig = dynamic(() => import("./field-config"), {
  ssr: false,
  loading: () => (
    <div className="p-8 text-center text-muted-foreground animate-pulse">
      Loading Config...
    </div>
  ),
});

export default function BuilderWorkspace() {
  const {
    showLeftSidebar,
    showRightSidebar,
    setShowLeftSidebar,
    setShowRightSidebar,
  } = useFormBuilderStore();

  // Scroll Lock saat drawer terbuka di Mobile
  useEffect(() => {
    if (showLeftSidebar || showRightSidebar) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showLeftSidebar, showRightSidebar]);

  return (
    <>
      {/* 1. Left Sidebar (Palette) */}
      <div
        className={`absolute lg:relative z-30 h-full w-72 bg-card border-r border-border transition-transform duration-300 ${
          showLeftSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <FieldPalette />
        <button
          onClick={() => setShowLeftSidebar(false)}
          className="lg:hidden absolute top-4 right-4 p-2 bg-accent rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* 2. Main Canvas */}
      <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 custom-scrollbar">
        <div className="max-w-3xl mx-auto min-h-full">
          <BuilderCanvas />
        </div>
      </div>

      {/* 3. Right Sidebar (Config) */}
      <div
        className={`absolute lg:relative right-0 z-30 h-full w-80 bg-card border-l border-border transition-transform duration-300 ${
          showRightSidebar
            ? "translate-x-0"
            : "translate-x-full lg:translate-x-0"
        }`}
      >
        <FieldConfig />
        <button
          onClick={() => setShowRightSidebar(false)}
          className="lg:hidden absolute top-4 left-4 p-2 bg-accent rounded-full"
        >
          <ChevronLeft size={20} />
        </button>
      </div>

      {/* === MOBILE FLOATING CONTROLS === */}
      <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-40">
        <button
          onClick={() => {
            setShowLeftSidebar(true);
            setShowRightSidebar(false);
          }}
          className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl active:scale-90 transition-transform"
        >
          <Plus size={24} />
        </button>
        <button
          onClick={() => {
            setShowRightSidebar(true);
            setShowLeftSidebar(false);
          }}
          className="bg-secondary text-secondary-foreground p-4 rounded-full shadow-2xl active:scale-90 transition-transform border border-border"
        >
          <Settings2 size={24} />
        </button>
      </div>

      {/* Backdrop for mobile drawers */}
      {(showLeftSidebar || showRightSidebar) && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-sm z-20 animate-in fade-in"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
        />
      )}
    </>
  );
}
