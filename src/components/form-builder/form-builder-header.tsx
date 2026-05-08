"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft, PenTool, Eye, Save } from "lucide-react";
import { useFormBuilderStore } from "@/store/form-builder-store";

export default function FormBuilderHeader() {
  const { title, setTitle, viewMode, setViewMode } = useFormBuilderStore();

  const handleSave = () => {
    alert("Form Schema Saved to Walrus & Sui!");
  };

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Link
          href="/dashboard/forms"
          className="p-2 hover:bg-accent rounded-full transition-colors"
        >
          <ChevronLeft size={20} />
        </Link>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="font-heading text-lg md:text-xl bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 w-full sm:w-64 font-bold"
          placeholder="Untitled Form"
        />
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
        {/* View Toggle */}
        <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
          <button
            onClick={() => setViewMode("builder")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
              viewMode === "builder"
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <PenTool size={14} />{" "}
            <span className="hidden xs:inline">Builder</span>
          </button>
          <button
            onClick={() => setViewMode("preview")}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
              viewMode === "preview"
                ? "bg-card shadow-sm text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Eye size={14} /> <span className="hidden xs:inline">Preview</span>
          </button>
        </div>

        <button
          onClick={handleSave}
          className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
        >
          <Save size={16} /> <span>Save</span>
        </button>
      </div>
    </div>
  );
}
