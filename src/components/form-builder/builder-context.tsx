"use client";

import React, { ReactNode, useEffect, useState } from "react";
import {
  DndContext,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  closestCorners,
  DragEndEvent,
  DragStartEvent,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  useBuilderSchemaStore,
  useBuilderUIStore,
} from "@/store/builder-store";
interface BuilderDndContextProps {
  children: ReactNode;
}

export default function BuilderDndProvider({
  children,
}: BuilderDndContextProps) {
  const addField = useBuilderSchemaStore((s) => s.addField);
  const reorderFields = useBuilderSchemaStore((s) => s.reorderFields);
  const setActiveField = useBuilderUIStore((s) => s.setActiveField);

  // 1. Inilah "Otak" di balik toleransi klik vs drag
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // User harus geser kursor 8px baru dianggap DRAG
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragStart = (event: DragStartEvent) => {
    // Opsional: Kasih feedback visual atau tutup panel config saat drag mulai
    console.log("Drag started:", event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    // 🌟 DEBUG LOGGING: Biar lu tau item jatuhnya kebaca di ID mana
    console.log("Drag ended!", {
      draggedItem: active.id,
      droppedOver: over?.id || "Di luar area (null)",
    });

    // LOGIC A: Jika item berasal dari Palette (Blueprint diseret ke Canvas)
    if (active.data.current?.type === "palette-item") {
      // Kalau user lepas mouse di luar area droppable, kita tetep tambahin (asumsi dia niat nambahin ke canvas)
      const fieldType = active.data.current.fieldType;
      addField({ type: fieldType });
      return;
    }

    // LOGIC B: Jika item sudah ada di Canvas (Reordering)
    // Di sini baru kita wajibkan harus ada 'over' biar gak error pas ngerubah urutan
    if (!over) return;

    if (active.id !== over.id) {
      reorderFields(active.id as string, over.id as string);
    }
  };

  // 🌟 TAMBAHKAN INI: Hydration Guard
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Jika belum di-mount di browser, render children kosongan tanpa DndContext
  if (!isMounted) {
    return <>{children}</>;
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners} // Algoritma deteksi tabrakan paling akurat buat grid/list
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {children}
    </DndContext>
  );
}
