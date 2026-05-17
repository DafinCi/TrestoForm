import React from "react";
import { FormField } from "@/types/field";
import { CalendarIcon } from "lucide-react";

export default function DateRenderer({ field }: { field: FormField }) {
  return (
    <div className="w-full h-10 rounded-lg border border-input bg-background/50 hover:bg-muted/50 transition-colors flex items-center px-3 gap-2 cursor-pointer">
      <CalendarIcon className="w-4 h-4 text-muted-foreground/70" />
      <span className="text-muted-foreground/60 text-sm">
        {field.placeholder || "Pick a date"}
      </span>
    </div>
  );
}
