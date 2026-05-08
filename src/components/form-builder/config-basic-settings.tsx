"use client";

import React from "react";
import { Asterisk } from "lucide-react";
import { FormField } from "@/types/field";

interface Props {
  field: FormField;
  updateField: (id: string, updates: Partial<FormField>) => void;
}

export default function ConfigBasicSettings({ field, updateField }: Props) {
  return (
    <div className="space-y-4">
      {/* Label Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold flex items-center gap-1 text-muted-foreground uppercase tracking-wider">
          Field Label <Asterisk size={10} className="text-destructive" />
        </label>
        <input
          type="text"
          value={field.label}
          onChange={(e) => updateField(field.id, { label: e.target.value })}
          className="w-full bg-muted/30 hover:bg-muted/50 border border-transparent focus:border-primary focus:bg-transparent rounded-lg px-3 py-2 text-sm transition-all outline-none text-foreground font-medium"
        />
      </div>

      {/* Description Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Description (Optional)
        </label>
        <textarea
          value={field.description || ""}
          onChange={(e) =>
            updateField(field.id, { description: e.target.value })
          }
          placeholder="Help text for the user..."
          className="w-full min-h-[70px] bg-muted/30 hover:bg-muted/50 border border-transparent focus:border-primary focus:bg-transparent rounded-lg px-3 py-2 text-sm transition-all outline-none resize-none text-foreground"
        />
      </div>

      {/* Placeholder (Hide for checkbox/radio/file) */}
      {!["checkbox", "radio", "file"].includes(field.type) && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Placeholder
          </label>
          <input
            type="text"
            value={field.placeholder || ""}
            onChange={(e) =>
              updateField(field.id, { placeholder: e.target.value })
            }
            placeholder="Enter placeholder..."
            className="w-full bg-muted/30 hover:bg-muted/50 border border-transparent focus:border-primary focus:bg-transparent rounded-lg px-3 py-2 text-sm transition-all outline-none text-foreground"
          />
        </div>
      )}
    </div>
  );
}
