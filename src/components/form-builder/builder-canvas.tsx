"use client";

import React, { useMemo, useState } from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragStartEvent,
  DragOverlay,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableFieldItem from "./sortable-field-item";
import { FileText } from "lucide-react";

export default function BuilderCanvas() {
  const { fields, reorderFields } = useFormBuilderStore();
  const [activeDragId, setActiveDragId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragId(null);
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = fields.findIndex((f) => f.id === active.id);
      const newIndex = fields.findIndex((f) => f.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderFields(oldIndex, newIndex);
      }
    }
  };

  const fieldIds = useMemo(() => fields.map((f) => f.id), [fields]);

  // Mencari data field yang sedang di-drag untuk ditampilkan di Overlay
  const activeDragField = useMemo(
    () => fields.find((f) => f.id === activeDragId),
    [activeDragId, fields],
  );

  return (
    <div className="pb-32 pt-4">
      {fields.length === 0 ? (
        // === EMPTY STATE ===
        <div className="max-w-xl mx-auto mt-12 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/60 rounded-3xl bg-card/50">
          <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <FileText size={32} />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-2">
            Start building your form
          </h3>
          <p className="text-sm text-muted-foreground max-w-[250px]">
            Click on any field from the palette on the left to add it to your
            canvas.
          </p>
        </div>
      ) : (
        // === THE "PAPER" CANVAS ===
        <div className="max-w-2xl mx-auto bg-card shadow-sm border border-border/60 rounded-xl md:rounded-2xl overflow-hidden transition-all duration-300 min-h-[400px]">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={fieldIds}
              strategy={verticalListSortingStrategy}
            >
              {/* List Field */}
              <div className="flex flex-col w-full">
                {fields.map((field) => (
                  <SortableFieldItem key={field.id} field={field} />
                ))}
              </div>
            </SortableContext>

            {/* Efek melayang (Overlay) saat drag */}
            <DragOverlay
              dropAnimation={{
                duration: 250,
                easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)",
              }}
            >
              {activeDragField ? (
                <SortableFieldItem field={activeDragField} isOverlay={true} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      )}
    </div>
  );
}
