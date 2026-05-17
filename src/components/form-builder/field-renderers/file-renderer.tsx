import React from "react";
import { FormField } from "@/types/field";
import { UploadCloud } from "lucide-react";

export default function FileRenderer({ field }: { field: FormField }) {
  return (
    <div className="w-full h-20 rounded-lg border border-dashed border-input bg-muted/20 flex flex-col items-center justify-center gap-1">
      <UploadCloud size={20} className="text-muted-foreground/50" />
      <span className="text-xs text-muted-foreground">
        Click to upload file
      </span>
    </div>
  );
}
