"use client";

import React from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { FieldType, FormField } from "@/types/field";

// --- Icons (Lucide React) ---
import {
  Type,
  AlignLeft,
  ListOrdered,
  CheckSquare,
  Star,
  UploadCloud,
  Link as LinkIcon,
} from "lucide-react";

// --- Tipe data internal buat mapping UI ---
type PaletteGroup = "Basic" | "Choice" | "Media & Web3";

interface PaletteItem {
  type: FieldType;
  label: string;
  icon: React.ElementType;
  group: PaletteGroup;
}

const FIELD_PALETTE: PaletteItem[] = [
  { type: "text", label: "Short Text", icon: Type, group: "Basic" },
  { type: "textarea", label: "Long Text", icon: AlignLeft, group: "Basic" },
  { type: "url", label: "Website / URL", icon: LinkIcon, group: "Basic" },
  { type: "select", label: "Dropdown", icon: ListOrdered, group: "Choice" },
  { type: "checkbox", label: "Checkbox", icon: CheckSquare, group: "Choice" },
  { type: "rating", label: "Rating", icon: Star, group: "Choice" },
  {
    type: "file",
    label: "File / Media",
    icon: UploadCloud,
    group: "Media & Web3",
  },
];

export default function FieldPalette() {
  const { addField } = useFormBuilderStore();

  const handleAddField = (type: FieldType, defaultLabel: string) => {
    // Siapkan default values berdasarkan tipe field untuk mencegah undefined error nanti
    const baseField: FormField = {
      id: crypto.randomUUID(),
      type,
      label: defaultLabel,
      required: false,
      isSensitive: false, // Default Web3 Privacy settings
      publicVisible: true,
    };

    // Injeksi properti khusus sesuai tipe
    if (type === "select" || type === "checkbox") {
      baseField.options = ["Option 1", "Option 2"];
    }

    if (type === "file") {
      baseField.description = "File will be stored securely on Walrus";
    }

    addField(baseField);
  };

  // Grouping logic untuk render UI
  const groupedFields = FIELD_PALETTE.reduce(
    (acc, item) => {
      if (!acc[item.group]) acc[item.group] = [];
      acc[item.group].push(item);
      return acc;
    },
    {} as Record<PaletteGroup, PaletteItem[]>,
  );

  return (
    <aside className="w-64 border-r border-border/50 bg-slate-50/30 dark:bg-slate-900/10 flex flex-col h-full">
      <div className="p-4 border-b border-border/50">
        <h2 className="font-righteous text-lg font-semibold tracking-wide">
          Fields
        </h2>
        <p className="text-xs text-muted-foreground mt-1 font-inter">
          Click to add to canvas
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {(Object.keys(groupedFields) as PaletteGroup[]).map((group) => (
          <div key={group} className="space-y-2">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
              {group}
            </h3>
            <div className="grid grid-cols-1 gap-2">
              {groupedFields[group].map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    onClick={() => handleAddField(item.type, item.label)}
                    className="flex items-center gap-3 w-full p-2.5 rounded-lg border border-transparent hover:border-border hover:bg-white dark:hover:bg-slate-800 transition-all text-left group"
                  >
                    <div className="p-1.5 rounded-md bg-slate-200/50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 group-hover:text-primary group-hover:bg-primary/10 transition-colors">
                      <Icon size={16} />
                    </div>
                    <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </aside>
  );
}
