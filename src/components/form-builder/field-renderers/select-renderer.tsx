import React from "react";
import { FormField } from "@/types/field";
import { ChevronDown } from "lucide-react";

export default function SelectRenderer({ field }: { field: FormField }) {
  return (
    <div className="w-full h-10 rounded-lg border border-input bg-background/50 flex items-center justify-between px-3">
      <span className="text-muted-foreground text-sm">Select an option...</span>
      <ChevronDown size={16} className="text-muted-foreground/50" />
    </div>
  );
}
