"use client";

import React from "react";
import { PenTool, Eye } from "lucide-react";
import { useBuilderUIStore } from "@/store/builder-store";
import { cn } from "@/lib/utils";

export default function ViewToggle() {
  const viewMode = useBuilderUIStore((s) => s.viewMode);
  const setViewMode = useBuilderUIStore((s) => s.setViewMode);

  return (
    <div className="flex items-center bg-muted p-1 rounded-xl border border-border shrink-0">
      <button
        onClick={() => setViewMode("builder")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all",
          viewMode === "builder"
            ? "bg-card shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <PenTool size={14} />{" "}
        <span className="hidden xs:inline md:inline">Builder</span>
      </button>
      <button
        onClick={() => setViewMode("preview")}
        className={cn(
          "flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all",
          viewMode === "preview"
            ? "bg-card shadow-sm text-primary"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        <Eye size={14} />{" "}
        <span className="hidden xs:inline md:inline">Preview</span>
      </button>
    </div>
  );
}
