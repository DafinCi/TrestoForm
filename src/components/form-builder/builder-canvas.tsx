"use client";

import React, { useMemo } from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { FormField } from "@/types/field";

// --- UI Components (Asumsi pakai shadcn/ui & Lucide) ---
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GripVertical, Trash2, Lock } from "lucide-react";

// ==========================================
// 1. Sortable Item Component
// ==========================================
function SortableFieldItem({ field }: { field: FormField }) {
  const { setActiveField, removeField, activeFieldId } = useFormBuilderStore();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: field.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.5 : 1,
  };

  const isActive = activeFieldId === field.id;

  return (
    <div ref={setNodeRef} style={style} className="relative group mb-4">
      <Card
        className={`cursor-pointer transition-all ${
          isActive
            ? "ring-2 ring-primary border-transparent"
            : "hover:border-primary/50"
        }`}
        onClick={() => setActiveField(field.id)}
      >
        <CardContent className="p-4 flex items-center gap-4">
          {/* Drag Handle */}
          <div
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground"
          >
            <GripVertical size={20} />
          </div>

          {/* Field Preview Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">
                {field.label || "Untitled Field"}
              </span>
              {field.required && (
                <span className="text-destructive text-xs">*</span>
              )}
              {field.isSensitive && (
                <Lock size={14} className="text-amber-500" />
              )}
            </div>
            {field.description && (
              <p className="text-xs text-muted-foreground mt-1">
                {field.description}
              </p>
            )}

            {/* Visualisasi tipe field sederhana */}
            <div className="mt-3 p-2 bg-muted/50 rounded-md text-xs text-muted-foreground border border-dashed">
              Mockup for: {field.type.toUpperCase()}
            </div>
          </div>

          {/* Delete Action */}
          <Button
            variant="ghost"
            size="icon"
            className="opacity-0 group-hover:opacity-100 text-destructive hover:bg-destructive/10"
            onClick={(e) => {
              e.stopPropagation(); // Biar gak trigger setActiveField
              removeField(field.id);
            }}
          >
            <Trash2 size={18} />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// ==========================================
// 2. Main Builder Canvas Component
// ==========================================
export default function BuilderCanvas() {
  const { fields, reorderFields } = useFormBuilderStore();

  // Setup Sensors biar dnd-kit gak bentrok sama klik biasa/scroll
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Drag baru aktif kalau kursor geser 5px (mencegah klik gak sengaja jadi drag)
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // Handle saat drag selesai
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
    }
  };

  // Optimasi array ID buat SortableContext
  const fieldIds = useMemo(() => fields.map((f) => f.id), [fields]);

  return (
    <div className="flex-1 bg-slate-50/50 dark:bg-slate-900/20 p-8 overflow-y-auto rounded-lg border border-dashed border-border/50 min-h-[600px]">
      <div className="max-w-2xl mx-auto">
        {fields.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed rounded-xl">
            <p>Canvas is empty.</p>
            <p className="text-sm">Click a field on the left to add it here.</p>
          </div>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fieldIds}
              strategy={verticalListSortingStrategy}
            >
              {fields.map((field) => (
                <SortableFieldItem key={field.id} field={field} />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>
    </div>
  );
}
