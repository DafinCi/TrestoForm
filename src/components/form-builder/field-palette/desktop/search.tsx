"use client";

import React, { memo, useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchProps {
  isCompact: boolean;
  onSearch: (query: string) => void;
}

const PaletteSearch = memo(function PaletteSearch({
  isCompact,
  onSearch,
}: SearchProps) {
  const [localQuery, setLocalQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => onSearch(localQuery), 200);
    return () => clearTimeout(timer);
  }, [localQuery, onSearch]);

  if (isCompact) return null;

  return (
    <div className="p-3 border-b border-border/50 flex-shrink-0 bg-background/50 backdrop-blur-sm">
      <div className="relative group">
        <Search
          className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors"
          size={14}
        />
        <input
          type="text"
          placeholder="Search fields (Ctrl + /)"
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          className="w-full h-8 pl-8 pr-3 text-xs bg-muted/30 border border-border/50 rounded-md focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50"
        />
      </div>
    </div>
  );
});

export default PaletteSearch;
