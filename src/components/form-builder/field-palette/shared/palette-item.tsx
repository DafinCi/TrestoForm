"use client";

import React, { memo } from "react";
import { useDraggable } from "@dnd-kit/core";
import { GripVertical, Plus } from "lucide-react";

export interface PaletteItemProps {
  id: string;
  type: string;
  label: string;
  description?: string;
  icon: React.ElementType;
  onAdd: () => void; // 🔴 UBAH INI: Biar terima objek utuh dari parent (CategorySection)
}

const PaletteItem = memo(function PaletteItem({
  id,
  type,
  label,
  description,
  icon: Icon,
  onAdd,
}: PaletteItemProps) {
  // 1. Setup dnd-kit draggable node
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: id,
    data: {
      type: "palette-item",
      fieldType: type, // Ini penting banget buat nge-generate di Canvas pas di-drop
    },
  });

  return (
    // 🌟 WADAH UTAMA: Hanya untuk KLIK (Tidak ada ...listeners di sini)
    <div
      onClick={onAdd} // Jalan mulus karena nggak dibajak dnd-kit
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          onAdd();
        }
      }}
      className={`
        group relative flex items-center gap-3 p-3 min-h-[44px]
        bg-card border rounded-lg text-left select-none outline-none
        transition-all duration-200 ease-in-out cursor-pointer
        hover:-translate-y-[1px] hover:shadow-sm hover:border-primary/40 focus-visible:ring-2 focus-visible:ring-primary/50
        ${
          isDragging
            ? "opacity-40 border-primary ring-1 ring-primary"
            : "opacity-100 border-border"
        }
      `}
      role="button"
      tabIndex={0}
      title={`Click to add, or drag ${label} field`}
    >
      {/* Wrapper Icon */}
      <div className="flex-shrink-0 p-1.5 bg-muted/50 rounded-md text-muted-foreground group-hover:text-primary group-hover:bg-primary/10 transition-colors pointer-events-none">
        <Icon size={16} aria-hidden="true" />
      </div>

      {/* Wrapper Konten Teks */}
      <div className="flex-1 flex flex-col justify-center overflow-hidden pointer-events-none">
        <span className="text-sm font-medium text-foreground leading-tight truncate">
          {label}
        </span>
        {description && (
          <span className="text-[10px] text-muted-foreground truncate mt-0.5">
            {description}
          </span>
        )}
      </div>

      {/* 🌟 DRAG HANDLE (GRIP): Taruh ...listeners HANYA di sini */}
      <div
        ref={setNodeRef}
        {...listeners}
        {...attributes}
        onClick={(e) => e.stopPropagation()} // Cegah event klik tembus ke bawah pas nge-drag
        className="flex-shrink-0 p-1.5 text-muted-foreground/30 hover:text-foreground cursor-grab active:cursor-grabbing hover:bg-accent rounded-md opacity-0 group-hover:opacity-100 transition-all"
      >
        <GripVertical size={16} aria-hidden="true" />
      </div>

      {/* Indikator Hover Tambahan (Opsional buat ngasih tau user bisa diklik) */}
      <div className="absolute right-10 flex-shrink-0 text-primary opacity-0 group-hover:opacity-100 transition-opacity md:hidden">
        <Plus size={14} />
      </div>
    </div>
  );
});

export default PaletteItem;
