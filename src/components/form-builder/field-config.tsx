"use client";

import React from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import {
  Settings2,
  Plus,
  Trash2,
  ShieldAlert,
  Eye,
  Asterisk,
} from "lucide-react";

export default function FieldConfig() {
  const { fields, activeFieldId, updateField } = useFormBuilderStore();

  // Cari data field yang lagi aktif
  const activeField = fields.find((f) => f.id === activeFieldId);

  // FAIL-SAFE: Kalau gak ada yang di-klik, kasih empty state
  if (!activeField) {
    return (
      <aside className="w-80 border-l border-border/50 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col h-full">
        <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-6 text-center space-y-4">
          <Settings2 size={40} className="opacity-20" />
          <div className="space-y-1">
            <h3 className="font-medium text-foreground">No Field Selected</h3>
            <p className="text-sm">
              Click on any field in the canvas to configure its properties.
            </p>
          </div>
        </div>
      </aside>
    );
  }

  // Helper buat update options khusus tipe "select" / "checkbox"
  const handleOptionChange = (index: number, value: string) => {
    if (!activeField.options) return;
    const newOptions = [...activeField.options];
    newOptions[index] = value;
    updateField(activeField.id, { options: newOptions });
  };

  const handleAddOption = () => {
    const currentOptions = activeField.options || [];
    updateField(activeField.id, {
      options: [...currentOptions, `Option ${currentOptions.length + 1}`],
    });
  };

  const handleRemoveOption = (index: number) => {
    if (!activeField.options) return;
    const newOptions = activeField.options.filter((_, i) => i !== index);
    updateField(activeField.id, { options: newOptions });
  };

  return (
    <aside className="w-80 border-l border-border/50 bg-white dark:bg-slate-950 flex flex-col h-full">
      <div className="p-4 border-b border-border/50 flex items-center gap-2">
        <Settings2 size={18} className="text-primary" />
        <h2 className="font-righteous text-lg font-semibold tracking-wide">
          Configuration
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-6">
        {/* === 1. BASIC SETTINGS === */}
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-semibold flex items-center gap-1">
              Field Label <Asterisk size={12} className="text-destructive" />
            </label>
            <input
              type="text"
              value={activeField.label}
              onChange={(e) =>
                updateField(activeField.id, { label: e.target.value })
              }
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold">
              Description (Optional)
            </label>
            <textarea
              value={activeField.description || ""}
              onChange={(e) =>
                updateField(activeField.id, { description: e.target.value })
              }
              placeholder="Help text for the user..."
              className="flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary resize-none"
            />
          </div>

          {/* Placeholder: Cuma muncul kalau bukan checkbox/rating/file */}
          {!["checkbox", "rating", "file"].includes(activeField.type) && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold">Placeholder</label>
              <input
                type="text"
                value={activeField.placeholder || ""}
                onChange={(e) =>
                  updateField(activeField.id, { placeholder: e.target.value })
                }
                placeholder="Enter placeholder..."
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
              />
            </div>
          )}
        </div>

        <hr className="border-border/50" />

        {/* === 2. OPTIONS EDITOR (HANYA BUAT SELECT/CHECKBOX) === */}
        {(activeField.type === "select" || activeField.type === "checkbox") && (
          <>
            <div className="space-y-3">
              <label className="text-sm font-semibold">Options</label>
              <div className="space-y-2">
                {activeField.options?.map((opt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(idx, e.target.value)}
                      className="flex h-8 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                    />
                    <button
                      onClick={() => handleRemoveOption(idx)}
                      disabled={(activeField.options?.length || 0) <= 1} // Gak boleh hapus kalau tinggal 1
                      className="p-1.5 text-muted-foreground hover:text-destructive disabled:opacity-50 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddOption}
                className="flex items-center gap-1.5 text-sm text-primary hover:text-primary/80 font-medium mt-2"
              >
                <Plus size={16} /> Add Option
              </button>
            </div>
            <hr className="border-border/50" />
          </>
        )}

        {/* === 3. VALIDATION & PRIVACY (WEB3 SPECIFIC) === */}
        <div className="space-y-4">
          <label className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            Rules & Privacy
          </label>

          {/* Required Toggle */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="space-y-0.5">
              <span className="text-sm font-medium flex items-center gap-2">
                <Asterisk
                  size={14}
                  className="text-muted-foreground group-hover:text-foreground"
                />
                Required Field
              </span>
            </div>
            <input
              type="checkbox"
              checked={activeField.required}
              onChange={(e) =>
                updateField(activeField.id, { required: e.target.checked })
              }
              className="w-4 h-4 accent-primary"
            />
          </label>

          {/* Walrus/Seal Encryption Toggle */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="space-y-0.5">
              <span className="text-sm font-medium flex items-center gap-2">
                <ShieldAlert size={14} className="text-amber-500" />
                Encrypt Data (Seal)
              </span>
              <p className="text-[10px] text-muted-foreground">
                Encrypt submission on Walrus
              </p>
            </div>
            <input
              type="checkbox"
              checked={activeField.isSensitive}
              onChange={(e) =>
                updateField(activeField.id, { isSensitive: e.target.checked })
              }
              className="w-4 h-4 accent-amber-500"
            />
          </label>

          {/* Public Visibility Toggle */}
          <label className="flex items-center justify-between cursor-pointer group">
            <div className="space-y-0.5">
              <span className="text-sm font-medium flex items-center gap-2">
                <Eye size={14} className="text-blue-500" />
                Publicly Visible
              </span>
              <p className="text-[10px] text-muted-foreground">
                Show in public dashboard
              </p>
            </div>
            <input
              type="checkbox"
              checked={activeField.publicVisible}
              onChange={(e) =>
                updateField(activeField.id, { publicVisible: e.target.checked })
              }
              className="w-4 h-4 accent-blue-500"
            />
          </label>
        </div>
      </div>
    </aside>
  );
}
