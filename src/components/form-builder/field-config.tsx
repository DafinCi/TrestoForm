"use client";

import React from "react";
import { useFormBuilderStore } from "@/store/form-builder-store";
import { Settings2 } from "lucide-react";
import ConfigBasicSettings from "./config-basic-settings";
import ConfigOptionsEditor from "./config-options-editor";
import ConfigRulesPrivacy from "./config-rules-privacy";

export default function FieldConfig() {
  const { fields, activeFieldId, updateField } = useFormBuilderStore();

  // Cari data field yang lagi aktif
  const activeField = fields.find((f) => f.id === activeFieldId);

  // FAIL-SAFE: Empty State yang elegan
  if (!activeField) {
    return (
      <aside className="w-full h-full flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mb-2">
          <Settings2 size={24} className="text-muted-foreground/50" />
        </div>
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">No Field Selected</h3>
          <p className="text-sm text-muted-foreground max-w-[200px] mx-auto">
            Click on any puzzle block in the canvas to configure its properties
            here.
          </p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col h-full bg-card">
      {/* Header Panel */}
      <div className="px-5 py-4 border-b border-border/50 flex items-center gap-3 bg-muted/10 sticky top-0 z-10">
        <div className="p-1.5 bg-primary/10 text-primary rounded-md">
          <Settings2 size={16} />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-wide text-foreground uppercase">
            {activeField.type} Settings
          </h2>
        </div>
      </div>

      {/* Scrollable Configuration Area */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-5 space-y-6">
        <ConfigBasicSettings field={activeField} updateField={updateField} />
        <ConfigOptionsEditor field={activeField} updateField={updateField} />
        <ConfigRulesPrivacy field={activeField} updateField={updateField} />
      </div>
    </aside>
  );
}
