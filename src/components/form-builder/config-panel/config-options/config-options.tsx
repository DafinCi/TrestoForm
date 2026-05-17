"use client";

import React, { useCallback, useState } from "react";
import {
  useBuilderSchemaStore,
  useBuilderUIStore,
} from "@/store/builder-store";
import { Label } from "@/components/ui/label";
import { FieldOption } from "@/types/field";

import OptionList from "./option-list";
import OptionActions from "./option-action";

export default function ConfigOptions() {
  const activeFieldId = useBuilderUIStore((s) => s.activeFieldId);
  const field = useBuilderSchemaStore((s) =>
    s.fields.find((f) => f.id === activeFieldId),
  );
  const updateField = useBuilderSchemaStore((s) => s.updateField);

  const [autoFocusIndex, setAutoFocusIndex] = useState<number | null>(null);

  // Guard: Cuma render kalau field valid dan bertipe pilihan
  const isOptionField =
    field && ["select", "radio", "checkbox"].includes(field.type);
  if (!field || !isOptionField) return null;

  const options = field.options || [];

  // --- Handlers (Di-useCallback biar gak memicu re-render anak) ---

  const handleUpdateOption = useCallback(
    (id: string, newLabel: string, newValue: string) => {
      updateField(field.id, {
        options: options.map((opt) =>
          opt.id === id ? { ...opt, label: newLabel, value: newValue } : opt,
        ),
      });
    },
    [options, field.id, updateField],
  );

  const handleDeleteOption = useCallback(
    (id: string) => {
      updateField(field.id, {
        options: options.filter((opt) => opt.id !== id),
      });
    },
    [options, field.id, updateField],
  );

  const handleAddOption = useCallback(
    (insertIndex?: number) => {
      const newOption: FieldOption = {
        id: crypto.randomUUID(),
        label: "",
        value: "",
      };
      const newOptions = [...options];

      if (insertIndex !== undefined) {
        newOptions.splice(insertIndex + 1, 0, newOption);
        setAutoFocusIndex(insertIndex + 1);
      } else {
        newOptions.push(newOption);
        setAutoFocusIndex(newOptions.length - 1);
      }
      updateField(field.id, { options: newOptions });
    },
    [options, field.id, updateField],
  );

  const handleBulkInsert = useCallback(
    (text: string) => {
      const lines = text
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l.length > 0);
      if (lines.length === 0) return;

      const newOptions = lines.map((line) => ({
        id: crypto.randomUUID(),
        label: line,
        value: line
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)+/g, ""),
      }));

      updateField(field.id, { options: [...options, ...newOptions] });
      setAutoFocusIndex(null);
    },
    [options, field.id, updateField],
  );

  return (
    <div className="space-y-6 pb-6">
      <div className="flex items-center justify-between">
        <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Options Editor
        </Label>
        <div className="text-[10px] bg-muted px-2 py-0.5 rounded-full text-muted-foreground">
          {options.length} item{options.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div className="space-y-4">
        <OptionList
          options={options}
          autoFocusIndex={autoFocusIndex}
          onUpdate={handleUpdateOption}
          onDelete={handleDeleteOption}
          onAddNext={handleAddOption}
        />

        <OptionActions
          onAddOption={() => handleAddOption()}
          onBulkInsert={handleBulkInsert}
        />
      </div>
    </div>
  );
}
