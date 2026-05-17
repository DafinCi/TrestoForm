"use client";

import React from "react";
import { FileText } from "lucide-react";

export default function CanvasEmpty() {
  return (
    <div className="max-w-xl mx-auto mt-12 flex flex-col items-center justify-center p-12 text-center border-2 border-dashed border-border/60 rounded-3xl bg-card/50 transition-all hover:bg-card/80">
      <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl flex items-center justify-center mb-4 shadow-sm">
        <FileText size={32} />
      </div>
      <h3 className="text-xl font-bold text-foreground mb-2">
        Start building your form
      </h3>
      <p className="text-sm text-muted-foreground max-w-[250px]">
        Drag and drop fields from the palette on the left to add them to your
        canvas.
      </p>
    </div>
  );
}
