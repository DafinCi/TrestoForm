import React from "react";
import { FormField } from "@/types/field";

export default function TextareaRenderer({ field }: { field: FormField }) {
  return (
    <div className="w-full h-24 rounded-lg border border-input bg-background/50 p-3">
      <span className="text-muted-foreground/40 text-sm">
        {field.placeholder || "Long text answer..."}
      </span>
    </div>
  );
}
