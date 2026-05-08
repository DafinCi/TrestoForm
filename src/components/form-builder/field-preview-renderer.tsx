"use client";

import React from "react";
import { FormField } from "@/types/field"; // Sesuaikan path ini dengan tipe lu

interface Props {
  field: FormField;
}

// Dibungkus React.memo agar tidak re-render saat field lain digeser
export const FieldPreviewRenderer = React.memo(({ field }: Props) => {
  return (
    <div className="flex flex-col gap-1.5 pointer-events-none">
      {/* Label & Indicators */}
      <div className="flex items-center gap-2">
        <label className="font-semibold text-sm text-foreground">
          {field.label || "Untitled Field"}
        </label>
        {field.required && (
          <span className="text-destructive font-bold text-sm">*</span>
        )}
      </div>

      {/* Description */}
      {field.description && (
        <p className="text-[13px] text-muted-foreground leading-snug">
          {field.description}
        </p>
      )}

      {/* Visual Input Mockup based on type */}
      <div className="mt-2">
        {field.type === "textarea" ? (
          <div className="w-full h-24 rounded-lg border border-input bg-background/50" />
        ) : field.type === "checkbox" ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-input bg-background/50" />
            <div className="w-24 h-3 rounded bg-muted" />
          </div>
        ) : field.type === "radio" ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full border border-input bg-background/50" />
            <div className="w-24 h-3 rounded bg-muted" />
          </div>
        ) : (
          // Default to generic Text input
          <div className="w-full h-10 rounded-lg border border-input bg-background/50" />
        )}
      </div>
    </div>
  );
});

FieldPreviewRenderer.displayName = "FieldPreviewRenderer";
export default FieldPreviewRenderer;
