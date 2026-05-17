"use client";

import React, { memo } from "react";
import { ChevronLeft, LayoutGrid } from "lucide-react";

interface HeaderProps {
  isCompact: boolean;
  onToggle: () => void;
}

const PaletteHeader = memo(function PaletteHeader({
  isCompact,
  onToggle,
}: HeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b border-border/50 h-[60px] flex-shrink-0">
      <div
        className={`transition-opacity duration-200 ${isCompact ? "opacity-0 hidden" : "opacity-100"}`}
      >
        <h2 className="text-sm font-bold tracking-tight text-foreground">
          Form Elements
        </h2>
      </div>
      <button
        onClick={onToggle}
        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-colors mx-auto outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
        title={isCompact ? "Expand Palette" : "Collapse Palette"}
      >
        {isCompact ? <LayoutGrid size={16} /> : <ChevronLeft size={16} />}
      </button>
    </div>
  );
});

export default PaletteHeader;
