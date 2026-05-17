"use client";

import React, { memo } from "react";

const PaletteFooter = memo(function PaletteFooter({
  isCompact,
}: {
  isCompact: boolean;
}) {
  if (isCompact) return null;

  return (
    <div className="p-3 border-t border-border/50 text-[10px] text-muted-foreground flex justify-between items-center bg-muted/10 flex-shrink-0">
      <span>Drag or click to add</span>
      <span className="font-mono bg-muted px-1.5 py-0.5 rounded border border-border">
        v1.0
      </span>
    </div>
  );
});

export default PaletteFooter;
