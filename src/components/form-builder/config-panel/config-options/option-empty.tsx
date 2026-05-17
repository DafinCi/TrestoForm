"use client";

import React from "react";
import { ListMinus } from "lucide-react";

export default function OptionEmpty() {
  return (
    <div className="flex flex-col items-center justify-center p-6 border border-dashed border-border/60 rounded-lg bg-muted/10 text-center">
      <div className="w-8 h-8 bg-muted rounded-full flex items-center justify-center mb-2 text-muted-foreground">
        <ListMinus size={16} />
      </div>
      <p className="text-xs font-medium text-foreground">No options left</p>
      <p className="text-[10px] text-muted-foreground mt-1">
        Add an option manually or use bulk add.
      </p>
    </div>
  );
}
