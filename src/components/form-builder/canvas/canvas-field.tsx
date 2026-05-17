"use client";

import React, { memo } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Lock } from "lucide-react";

import {
  useBuilderSchemaStore,
  useBuilderUIStore,
} from "@/store/builder-store";
import FieldPreviewRenderer from "../field-renderers/renderer-map";
import CanvasInsertIndicator from "./canvas-insert-indicator";

// 🔥 IMPORT MOBILE CONTROLS
import MobileReorderControls from "../mobile/mobile-reorder-controls";

interface Props {
  id: string;
  isOverlay?: boolean;
}

const CanvasField = memo(function CanvasField({
  id,
  isOverlay = false,
}: Props) {
  const field = useBuilderSchemaStore((s) => s.fields.find((f) => f.id === id));
  const removeField = useBuilderSchemaStore((s) => s.removeField);

  // Ambil state UI
  const isActive = useBuilderUIStore((s) => s.activeFieldId === id);
  const setActiveField = useBuilderUIStore((s) => s.setActiveField);
  const device = useBuilderUIStore((s) => s.device); // 🔥 Ambil mode device saat ini
  const isMobile = device === "mobile";

  // Ekstrak data tambahan dari useSortable
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
    isOver,
    activeIndex,
    overIndex,
  } = useSortable({ id });

  if (!field) return null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // State transparan pas elemen ini yang lagi ditarik
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[100px] bg-primary/5 border border-primary/20 border-dashed rounded-xl opacity-60"
      />
    );
  }

  const showIndicator = isOver && !isDragging;
  const indicatorPosition = activeIndex < overIndex ? "bottom" : "top";

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      onClick={() => setActiveField(field.id)}
      className={`
        relative group flex items-start p-6 transition-all duration-200 cursor-pointer border-b border-border/40 last:border-b-0
        ${isActive ? "bg-primary/5" : "hover:bg-muted/30 bg-card"}
        ${isOverlay ? "shadow-2xl ring-2 ring-primary/50 scale-[1.02] bg-card rounded-xl border-none z-50 cursor-grabbing" : ""}
      `}
    >
      {/* Render Indikator */}
      {showIndicator && <CanvasInsertIndicator position={indicatorPosition} />}

      {/* 🔥 INJEKSI MOBILE REORDER CONTROLS */}
      {isActive && isMobile && !isOverlay && (
        <div className="absolute -top-5 right-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <MobileReorderControls
            fieldId={field.id}
            dragListeners={listeners}
            dragAttributes={attributes}
          />
        </div>
      )}

      {/* Drag Handle Desktop (Disembunyikan di Mobile) */}
      {!isMobile && (
        <div
          {...attributes}
          {...listeners}
          className={`
            absolute left-2 top-1/2 -translate-y-1/2 p-1.5 text-muted-foreground/40 hover:text-foreground cursor-grab active:cursor-grabbing rounded-md hover:bg-accent transition-all
            ${isActive || isOverlay ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
          `}
        >
          <GripVertical size={18} />
        </div>
      )}

      {/* Area Konten Preview */}
      <div className="flex-1 pl-6 pr-10">
        {field.isSensitive && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Lock size={12} /> Sensitive
          </div>
        )}
        <FieldPreviewRenderer field={field} />
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
        className={`
          absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all z-10
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
        title="Delete Field"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
});

export default CanvasField;
