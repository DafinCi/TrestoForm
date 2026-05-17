"use client";

import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { Plus } from "lucide-react";

export default function CanvasDropzone() {
  // Ini ID unik penanda bahwa ini adalah "Area Penerima"
  const { isOver, setNodeRef } = useDroppable({
    id: "canvas-bottom-dropzone",
    data: {
      accepts: ["palette-item"], // Cuma nerima item dari palette
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full p-4 mt-2 rounded-xl border-2 flex items-center justify-center transition-all duration-300
        ${
          isOver
            ? "border-primary border-dashed bg-primary/10 text-primary scale-[1.02]"
            : "border-transparent bg-transparent text-transparent hover:border-border/30 hover:bg-muted/10"
        }
      `}
    >
      <div
        className={`flex items-center gap-2 transition-opacity duration-300 ${isOver ? "opacity-100" : "opacity-0"}`}
      >
        <Plus size={20} className="animate-bounce" />
        <span className="font-bold text-sm tracking-wide">
          Drop field here to append
        </span>
      </div>
    </div>
  );
}
