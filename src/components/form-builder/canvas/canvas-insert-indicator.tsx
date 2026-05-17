"use client";

import React from "react";

interface CanvasInsertIndicatorProps {
  position: "top" | "bottom";
}

export default function CanvasInsertIndicator({
  position,
}: CanvasInsertIndicatorProps) {
  return (
    <div
      className={`
        absolute left-0 right-0 z-50 flex items-center pointer-events-none
        ${position === "top" ? "-top-[1px]" : "-bottom-[1px]"}
      `}
    >
      {/* Bulatan ujung kiri */}
      <div className="w-2 h-2 rounded-full bg-primary absolute -left-1 shadow-[0_0_8px_hsl(var(--primary)_/_0.6)]" />

      {/* Garis utama */}
      <div className="h-[2px] w-full bg-primary shadow-[0_0_8px_hsl(var(--primary)_/_0.6)]" />
    </div>
  );
}
