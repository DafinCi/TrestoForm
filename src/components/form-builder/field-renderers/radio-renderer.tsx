import React from "react";
import { FormField } from "@/types/field";

export default function RadioRenderer({ field }: { field: FormField }) {
  const options = field.options?.length
    ? field.options.map((o) => o.label || o)
    : ["Option 1", "Option 2"];

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt, idx) => (
        <div key={idx} className="flex items-center gap-3">
          {/* Perbedaan utama: rounded-full untuk radio */}
          <div className="w-4 h-4 rounded-full border border-input bg-background/50 shrink-0" />
          <span className="text-sm text-muted-foreground">{opt as string}</span>
        </div>
      ))}
    </div>
  );
}
