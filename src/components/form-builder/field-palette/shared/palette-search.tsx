"use client";

import React from "react";
import { Search } from "lucide-react";

interface PaletteSearchProps {
  isCompact?: boolean;
  onSearch: (query: string) => void;
}

export default function PaletteSearch({
  isCompact,
  onSearch,
}: PaletteSearchProps) {
  if (isCompact) return null; // Sembunyikan search kalau desktop lagi di-collapse

  return (
    <div className="p-3 border-b border-border/50 bg-background/50 sticky top-0 z-10 backdrop-blur-sm">
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search fields..."
          onChange={(e) => onSearch(e.target.value)}
          className="w-full h-9 pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
        />
      </div>
    </div>
  );
}
