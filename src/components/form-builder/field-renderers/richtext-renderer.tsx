import React from "react";
import { FormField } from "@/types/field";
import { Bold, Italic, List, Link } from "lucide-react";

export default function RichTextRenderer({ field }: { field: FormField }) {
  return (
    <div className="w-full rounded-lg border border-input bg-background/50 flex flex-col overflow-hidden">
      {/* Mock Toolbar */}
      <div className="h-9 border-b border-input/50 bg-muted/20 flex items-center px-2 gap-1">
        <div className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/40">
          <Bold size={14} />
        </div>
        <div className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/40">
          <Italic size={14} />
        </div>
        <div className="w-[1px] h-4 bg-border/50 mx-1" />
        <div className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/40">
          <List size={14} />
        </div>
        <div className="w-6 h-6 rounded flex items-center justify-center text-muted-foreground/40">
          <Link size={14} />
        </div>
      </div>

      {/* Mock Content Area */}
      <div className="p-3 min-h-[100px]">
        <span className="text-muted-foreground/40 text-sm">
          {field.placeholder || "Type formatting text here..."}
        </span>
      </div>
    </div>
  );
}
