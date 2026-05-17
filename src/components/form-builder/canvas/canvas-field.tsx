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
  const device = useBuilderUIStore((s) => s.device);
  const viewMode = useBuilderUIStore((s) => s.viewMode); // 🌟 AMBIL VIEW MODE

  const isMobile = device === "mobile";
  const isPreview = viewMode === "preview"; // 🌟 FLAG PREVIEW

  // Ekstrak data dnd-kit (Disable dnd saat preview)
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
  } = useSortable({
    id,
    disabled: isPreview, // 🌟 MATIKAN DRAG SAAT PREVIEW
  });

  if (!field) return null;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[100px] bg-primary/5 border border-primary/20 border-dashed rounded-xl opacity-60"
      />
    );
  }

  const showIndicator = isOver && !isDragging && !isPreview;
  const indicatorPosition = activeIndex < overIndex ? "bottom" : "top";

  return (
    <div
      ref={isOverlay ? undefined : setNodeRef}
      style={isOverlay ? undefined : style}
      // 🌟 MATIKAN KLIK SAAT PREVIEW
      onClick={isPreview ? undefined : () => setActiveField(field.id)}
      className={`
        relative group flex items-start transition-all duration-200
        ${isPreview ? "py-4" : "p-6 border-b border-border/40 last:border-b-0 cursor-pointer"}
        ${!isPreview && isActive ? "bg-primary/5" : ""}
        ${!isPreview && !isActive ? "hover:bg-muted/30 bg-card" : ""}
        ${isOverlay ? "shadow-2xl ring-2 ring-primary/50 scale-[1.02] bg-card rounded-xl border-none z-50 cursor-grabbing" : ""}
      `}
    >
      {showIndicator && <CanvasInsertIndicator position={indicatorPosition} />}

      {/* 🌟 SEMBUNYIKAN KONTROL MOBILE SAAT PREVIEW */}
      {!isPreview && isActive && isMobile && !isOverlay && (
        <div className="absolute -top-5 right-2 z-30 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <MobileReorderControls
            fieldId={field.id}
            dragListeners={listeners}
            dragAttributes={attributes}
          />
        </div>
      )}

      {/* 🌟 SEMBUNYIKAN DRAG HANDLE SAAT PREVIEW */}
      {!isPreview && !isMobile && (
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
      <div className={`flex-1 ${isPreview ? "px-0" : "pl-6 pr-10"}`}>
        {!isPreview && field.isSensitive && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Lock size={12} /> Sensitive
          </div>
        )}
        <FieldPreviewRenderer field={field} />
      </div>

      {/* 🌟 SEMBUNYIKAN DELETE BUTTON SAAT PREVIEW */}
      {!isPreview && (
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
      )}
    </div>
  );
});

export default CanvasField;
