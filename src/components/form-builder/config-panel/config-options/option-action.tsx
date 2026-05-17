"use client";

import React, { useState } from "react";
import { Plus, ListPlus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface OptionActionsProps {
  onAddOption: () => void;
  onBulkInsert: (text: string) => void;
}

export default function OptionActions({
  onAddOption,
  onBulkInsert,
}: OptionActionsProps) {
  const [isBulkMode, setIsBulkMode] = useState(false);
  const [bulkText, setBulkText] = useState("");

  const handleExecuteBulk = () => {
    onBulkInsert(bulkText);
    setBulkText("");
    setIsBulkMode(false);
  };

  return (
    <div className="pt-4 border-t border-border/40 space-y-4">
      {isBulkMode ? (
        <div className="space-y-3 bg-muted/20 p-3 rounded-lg border border-border">
          <p className="text-xs text-muted-foreground">
            Paste options (one per line). Values will be auto-generated.
          </p>
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Apple&#10;Banana&#10;Cherry"
            className="w-full min-h-[120px] p-2 text-sm rounded-md border border-input bg-background custom-scrollbar focus:outline-none focus:ring-1 focus:ring-primary/50"
          />
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsBulkMode(false)}
            >
              Cancel
            </Button>
            <Button size="sm" onClick={handleExecuteBulk}>
              Insert Options
            </Button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onAddOption}
            className="flex-1 border-dashed bg-transparent hover:bg-muted/50"
          >
            <Plus size={14} className="mr-2" /> Add Option
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsBulkMode(true)}
            className="px-3"
            title="Bulk Add Options"
          >
            <ListPlus size={14} />
          </Button>
        </div>
      )}
    </div>
  );
}
