import React from "react";
import { FormField } from "@/types/field";

export default function CheckboxRenderer({ field }: { field: FormField }) {
  // Samakan format dummy dengan data asli (Array of Objects)
  const options = field.options?.length
    ? field.options
    : [
        { id: "dummy-1", label: "Option 1", value: "Option 1" },
        { id: "dummy-2", label: "Option 2", value: "Option 2" },
      ];

  return (
    <div className="flex flex-col gap-2.5">
      {options.map((opt, idx) => {
        // Ekstrak label: Jaga-jaga kalau state lama masih ada yang pakai string
        const label = typeof opt === "string" ? opt : opt.label;
        const key = typeof opt === "string" ? idx : opt.id || idx;

        return (
          <div key={key} className="flex items-center gap-3">
            <div className="w-4 h-4 rounded-[4px] border border-input bg-background/50 shrink-0" />
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        );
      })}
    </div>
  );
}
