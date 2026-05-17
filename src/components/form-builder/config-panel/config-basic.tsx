"use client";

import React from "react";
import {
  useBuilderSchemaStore,
  useBuilderUIStore,
} from "@/store/builder-store";
import { DebouncedInput, DebouncedTextarea } from "../shared/debounced-input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export default function ConfigBasic() {
  const activeFieldId = useBuilderUIStore((s) => s.activeFieldId);
  const field = useBuilderSchemaStore((s) =>
    s.fields.find((f) => f.id === activeFieldId),
  );
  const updateField = useBuilderSchemaStore((s) => s.updateField);

  if (!field || !activeFieldId) return null;

  // Hanya tampilkan setting placeholder untuk tipe input text-based
  const supportsPlaceholder = ["text", "number", "textarea"].includes(
    field.type,
  );

  return (
    <div className="space-y-6 pb-6">
      {/* 1. Label Field */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Field Label
        </Label>
        <DebouncedInput
          value={field.label}
          onChangeValue={(val) => updateField(activeFieldId, { label: val })}
          placeholder="e.g., What is your name?"
        />
      </div>

      {/* 2. Description / Help Text */}
      <div className="space-y-2">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Description (Help Text)
        </Label>
        <DebouncedTextarea
          value={field.description || ""}
          onChangeValue={(val) =>
            updateField(activeFieldId, { description: val })
          }
          placeholder="Add instructions or details for the user..."
          rows={3}
        />
      </div>

      {/* 3. Placeholder (Conditional) */}
      {supportsPlaceholder && (
        <div className="space-y-2">
          <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Placeholder
          </Label>
          <DebouncedInput
            value={field.placeholder || ""}
            onChangeValue={(val) =>
              updateField(activeFieldId, { placeholder: val })
            }
            placeholder="e.g., John Doe"
          />
        </div>
      )}

      <hr className="border-border/60" />

      {/* 4. Required Toggle */}
      <div className="flex items-center justify-between p-3 rounded-lg border border-border bg-muted/10">
        <div className="space-y-0.5">
          <Label className="text-sm font-medium">Required Field</Label>
          <p className="text-xs text-muted-foreground">
            Users must fill this out to submit
          </p>
        </div>
        <Switch
          checked={field.required}
          onCheckedChange={(checked) =>
            updateField(activeFieldId, { required: checked })
          }
        />
      </div>
    </div>
  );
}
