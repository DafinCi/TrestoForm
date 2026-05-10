"use client";

import React from "react";
import { Asterisk } from "lucide-react";
import { FormField } from "@/types/field";
import { DebouncedInput, DebouncedTextarea } from "./debounced-input";

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
        <DebouncedInput
          value={field.label}
          onChangeValue={(val) => updateField(field.id, { label: val })}
        />
      </div>

      {/* Description Input */}
      <div className="space-y-1.5">
        <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
          Description (Optional)
        </label>
        <DebouncedTextarea
          value={field.description || ""}
          onChangeValue={(val) => updateField(field.id, { description: val })}
          placeholder="Help text for the user..."
          className="min-h-[70px]"
        />
      </div>

      {/* Placeholder (Hide for checkbox/radio/file) */}
      {!["checkbox", "radio", "file"].includes(field.type) && (
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Placeholder
          </label>
          <DebouncedInput
            value={field.placeholder || ""}
            onChangeValue={(val) => updateField(field.id, { placeholder: val })}
            placeholder="Enter placeholder..."
          />
        </div>
      )}
    </div>
  );
}
