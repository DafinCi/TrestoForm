"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { FormField } from "@/types/field";

interface Props {
  field: FormField;
  updateField: (id: string, updates: Partial<FormField>) => void;
}

export default function ConfigOptionsEditor({ field, updateField }: Props) {
  // Hanya render jika tipe butuh options
  if (!["select", "checkbox", "radio"].includes(field.type)) return null;

  const options = field.options || [];

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    updateField(field.id, { options: newOptions });
  };

  const handleAddOption = () => {
    updateField(field.id, {
      options: [...options, `Option ${options.length + 1}`],
    });
  };

  const handleRemoveOption = (index: number) => {
    const newOptions = options.filter((_, i) => i !== index);
    updateField(field.id, { options: newOptions });
  };

  return (
    <div className="space-y-3 pt-4 border-t border-border/40">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Options List
      </label>
      <div className="space-y-2">
        {options.map((opt, idx) => (
          <div key={idx} className="flex items-center gap-2 group">
            <input
              type="text"
              value={opt}
              onChange={(e) => handleOptionChange(idx, e.target.value)}
              className="flex-1 bg-muted/30 border border-transparent focus:border-primary focus:bg-transparent rounded-md px-3 py-1.5 text-sm transition-all outline-none"
            />
            <button
              onClick={() => handleRemoveOption(idx)}
              disabled={options.length <= 1}
              className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-30 disabled:hover:bg-transparent transition-all"
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>
      <button
        onClick={handleAddOption}
        className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 font-bold mt-2 py-1.5 px-2 hover:bg-primary/10 rounded-md transition-all"
      >
        <Plus size={14} /> Add Option
      </button>
    </div>
  );
}
