"use client";

import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Lock } from "lucide-react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { FormField } from "@/types/field";
import FieldPreviewRenderer from "./field-preview-renderer";

interface Props {
  field: FormField;
  isOverlay?: boolean; // Props khusus saat item sedang melayang (di-drag)
}

export default function SortableFieldItem({ field, isOverlay = false }: Props) {
  const { setActiveField, removeField, activeFieldId } = useFormBuilderStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  // Animasi standard dnd-kit
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const isActive = activeFieldId === field.id;

  // Jika sedang di-drag (yang nempel di kertas), kita jadikan transparan sebagai placeholder
  if (isDragging && !isOverlay) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="h-[120px] bg-muted/30 border-b border-border/50 opacity-50"
      />
    );
  }

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
      {/* Kiri: Drag Handle (Menyatu secara elegan, muncul saat hover atau aktif) */}
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

      {/* Tengah: Area Konten (Preview Input) */}
      <div className="flex-1 pl-6 pr-10">
        {/* Sensitive Data Indicator */}
        {field.isSensitive && (
          <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-amber-500/10 text-amber-600 px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider">
            <Lock size={12} /> Sensitive
          </div>
        )}

        <FieldPreviewRenderer field={field} />
      </div>

      {/* Kanan: Quick Actions (Delete) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          removeField(field.id);
        }}
        className={`
          absolute right-4 top-1/2 -translate-y-1/2 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg transition-all
          ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"}
        `}
        title="Delete Field"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
}
