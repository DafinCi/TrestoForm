"use client";

import React from "react";
import { useShallow } from "zustand/react/shallow";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

import CanvasDropzone from "./canvas-dropzone";

// Stores
import {
  useBuilderSchemaStore,
  useBuilderUIStore,
} from "@/store/builder-store";

// Canvas Components
import CanvasField from "./canvas-field";
import CanvasToolbar from "./canvas-toolbar";
import CanvasEmpty from "./canvas-empty";

export default function Canvas() {
  // UI State untuk responsivitas & zoom
  const device = useBuilderUIStore((s) => s.device);
  const zoom = useBuilderUIStore((s) => s.zoom);

  // Schema State (Pakai useShallow biar re-render cuma pas urutan ID berubah)
  const fieldIds = useBuilderSchemaStore(
    useShallow((s) => s.fields.map((f) => f.id)),
  );

  // Logic lebar canvas berdasarkan device preview
  const deviceWidths = {
    desktop: "max-w-3xl",
    tablet: "max-w-[768px]",
    mobile: "max-w-[375px]",
  };

  return (
    <div className="flex flex-col h-full bg-muted/20 overflow-hidden relative">
      {/* 1. Toolbar nempel di atas canvas area */}
      <CanvasToolbar />

      {/* 2. Scroll Area untuk Canvas */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col items-center custom-scrollbar pb-32">
        {/* Wrapper Responsive (Zoom & Device Size) */}
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
          className={`w-full ${deviceWidths[device]} transition-all duration-500 ease-out`}
        >
          {fieldIds.length === 0 ? (
            <CanvasEmpty />
          ) : (
            <div className="bg-card shadow-sm border border-border/60 rounded-xl md:rounded-2xl overflow-hidden min-h-[400px] transition-all">
              {/* Context dari DndKit cukup SortableContext saja, otak utamanya ada di builder-context */}
              <SortableContext
                items={fieldIds}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col w-full">
                  {fieldIds.map((id) => (
                    <CanvasField key={id} id={id} />
                  ))}

                  <CanvasDropzone />
                </div>
              </SortableContext>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
