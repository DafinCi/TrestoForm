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
  const device = useBuilderUIStore((s) => s.device);
  const zoom = useBuilderUIStore((s) => s.zoom);

  const setTitle = useBuilderSchemaStore((s) => s.setTitle);
  const setDescription = useBuilderSchemaStore((s) => s.setDescription);

  // 🌟 FIX POINT 1: Ambil title & description dari Store
  const title = useBuilderSchemaStore((s) => s.title);
  const description = useBuilderSchemaStore((s) => s.description);

  // Schema State
  const fieldIds = useBuilderSchemaStore(
    useShallow((s) => s.fields.map((f) => f.id)),
  );

  // 🌟 FIX POINT 3 (Solusi A): Tambahkan min-w-[600px] agar tidak terjepit!
  const deviceWidths = {
    desktop: "max-w-3xl min-w-[600px]",
    tablet: "max-w-[768px] min-w-[500px]",
    mobile: "max-w-[375px] min-w-[320px]",
  };

  return (
    <div className="flex w-full flex-col h-full bg-muted/20 overflow-hidden relative">
      <CanvasToolbar />

      {/* Area yang bisa di-scroll (Vertical & Horizontal) */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex flex-col custom-scrollbar pb-32">
        {/* Wrapper Responsive */}
        <div
          style={{
            transform: `scale(${zoom / 100})`,
            transformOrigin: "top center",
          }}
          className={`mx-auto w-full ${deviceWidths[device]} transition-all duration-500 ease-out`}
        >
          {/* Base Form Card */}
          <div className="bg-card shadow-sm border border-border/60 rounded-xl md:rounded-2xl overflow-hidden min-h-[400px] flex flex-col transition-all">
            {/* 🌟 FORM HEADER: Selalu tampil di atas */}
            <div className="p-6 md:p-8 border-b border-border/40 bg-card flex flex-col gap-2">
              <input
                type="text"
                value={title || ""}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Untitled Form"
                className="text-2xl md:text-3xl font-bold font-heading text-foreground bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 w-full p-0 m-0"
              />
              <textarea
                value={description || ""}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Click to edit description..."
                rows={2} // Sesuaikan jumlah baris default
                className="text-sm text-muted-foreground bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/60 w-full resize-none p-0 m-0 custom-scrollbar"
              />
            </div>

            {/* 🌟 FORM BODY: Dropzone & Field List */}
            <div className="flex-1 flex flex-col p-2 md:p-4 bg-muted/5">
              {fieldIds.length === 0 ? (
                <CanvasEmpty />
              ) : (
                <SortableContext
                  items={fieldIds}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="flex flex-col w-full gap-1">
                    {fieldIds.map((id) => (
                      <CanvasField key={id} id={id} />
                    ))}
                    <CanvasDropzone />
                  </div>
                </SortableContext>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
