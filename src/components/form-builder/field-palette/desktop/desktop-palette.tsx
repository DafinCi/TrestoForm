"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import { useBuilderSchemaStore } from "@/store/builder-store";
import { FIELD_DEFINITIONS } from "@/constants/field-definitions";

// Import Micro-Components
import PaletteHeader from "./header";
import PaletteSearch from "./search";
import PaletteFooter from "./footer";
import CategorySection from "../shared/category-section";

export default function DesktopPalette() {
  const addField = useBuilderSchemaStore((s) => s.addField);

  // Layout States
  const [searchQuery, setSearchQuery] = useState("");
  const [isCompact, setIsCompact] = useState(false);
  const [width, setWidth] = useState(280);
  const [isResizing, setIsResizing] = useState(false);

  const sidebarRef = useRef<HTMLElement>(null);

  // Restore Layout State
  useEffect(() => {
    const savedWidth = localStorage.getItem("palette-width");
    const savedCompact = localStorage.getItem("palette-compact");
    if (savedWidth) setWidth(Number(savedWidth));
    if (savedCompact) setIsCompact(savedCompact === "true");
  }, []);

  const saveLayoutState = useCallback(
    (newWidth: number, compactState: boolean) => {
      localStorage.setItem("palette-width", String(newWidth));
      localStorage.setItem("palette-compact", String(compactState));
    },
    [],
  );

  // Resize Handler
  const startResizing = useCallback((e: React.PointerEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!sidebarRef.current) return;
      let newWidth =
        e.clientX - sidebarRef.current.getBoundingClientRect().left;

      if (newWidth < 120) {
        newWidth = 72;
        if (!isCompact) setIsCompact(true);
      } else {
        if (isCompact) setIsCompact(false);
        if (newWidth > 420) newWidth = 420;
      }
      setWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      saveLayoutState(width, width <= 72);
    };

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing, isCompact, width, saveLayoutState]);

  // Filtering & Grouping (Memoized)
  const groupedFields = useMemo(() => {
    const filtered = FIELD_DEFINITIONS.filter(
      (f) =>
        f.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.type.toLowerCase().includes(searchQuery.toLowerCase()),
    );

    return filtered.reduce(
      (acc, field) => {
        if (!acc[field.category]) acc[field.category] = [];
        acc[field.category].push(field);
        return acc;
      },
      {} as Record<string, typeof FIELD_DEFINITIONS>,
    );
  }, [searchQuery]);

  // Static Callbacks
  const handleToggleCompact = useCallback(() => {
    setIsCompact((prev) => {
      const next = !prev;
      const newWidth = next ? 72 : 280;
      setWidth(newWidth);
      saveLayoutState(newWidth, next);
      return next;
    });
  }, [saveLayoutState]);

  const handleAddField = useCallback(
    (template: FieldDefinition) => {
      // Standardisasi: Cukup kirim { type } agar store yang meracik sisanya
      addField({ type: template.type });
    },
    [addField],
  );

  return (
    <aside
      ref={sidebarRef}
      style={{ width }}
      className={`
        relative flex flex-col bg-card h-full border-r border-border
        ${!isResizing ? "transition-[width] duration-300 ease-in-out" : ""}
      `}
    >
      <PaletteHeader isCompact={isCompact} onToggle={handleToggleCompact} />

      <PaletteSearch isCompact={isCompact} onSearch={setSearchQuery} />

      <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-border p-3 space-y-6">
        {Object.entries(groupedFields).map(([category, fields]) => (
          <CategorySection
            key={category}
            category={category}
            fields={fields}
            isCompact={isCompact}
            onAdd={handleAddField}
          />
        ))}

        {Object.keys(groupedFields).length === 0 && (
          <div className="text-center p-4 text-xs text-muted-foreground">
            No fields found.
          </div>
        )}
      </div>

      <PaletteFooter isCompact={isCompact} />

      {/* Ghost Resize Handle */}
      <div
        onPointerDown={startResizing}
        className={`
          absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-10
          hover:bg-primary/20 transition-colors
          ${isResizing ? "bg-primary/40" : "bg-transparent"}
        `}
        title="Drag to resize"
      />
    </aside>
  );
}
