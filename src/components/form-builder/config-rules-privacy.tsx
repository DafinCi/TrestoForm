"use client";

import React from "react";
import { ShieldAlert, Eye, Asterisk } from "lucide-react";
import { FormField } from "@/types/field";

interface Props {
  field: FormField;
  updateField: (id: string, updates: Partial<FormField>) => void;
}

// Custom UI Toggle Switch ala iOS
const ToggleSwitch = ({
  checked,
  onChange,
  colorClass,
}: {
  checked: boolean;
  onChange: (val: boolean) => void;
  colorClass: string;
}) => (
  <button
    type="button"
    onClick={() => onChange(!checked)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-background ${checked ? colorClass : "bg-muted border border-border"}`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${checked ? "translate-x-4.5" : "translate-x-0.5"}`}
    />
  </button>
);

export default function ConfigRulesPrivacy({ field, updateField }: Props) {
  return (
    <div className="space-y-4 pt-4 border-t border-border/40">
      <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
        Rules & Privacy
      </label>

      {/* Required Toggle */}
      <div className="flex items-center justify-between group">
        <div className="space-y-0.5">
          <span className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Asterisk size={14} className="text-muted-foreground" /> Required
            Field
          </span>
        </div>
        <ToggleSwitch
          checked={!!field.required}
          onChange={(val) => updateField(field.id, { required: val })}
          colorClass="bg-primary"
        />
      </div>

      {/* Walrus Encryption Toggle */}
      <div className="flex items-center justify-between group">
        <div className="space-y-0.5">
          <span className="text-sm font-medium flex items-center gap-2 text-foreground">
            <ShieldAlert size={14} className="text-amber-500" /> Encrypt Data
            (Seal)
          </span>
          <p className="text-[10px] text-muted-foreground pl-6">
            Secured via Walrus Protocol
          </p>
        </div>
        <ToggleSwitch
          checked={!!field.isSensitive}
          onChange={(val) => updateField(field.id, { isSensitive: val })}
          colorClass="bg-amber-500"
        />
      </div>

      {/* Public Visibility Toggle */}
      <div className="flex items-center justify-between group">
        <div className="space-y-0.5">
          <span className="text-sm font-medium flex items-center gap-2 text-foreground">
            <Eye size={14} className="text-blue-500" /> Publicly Visible
          </span>
          <p className="text-[10px] text-muted-foreground pl-6">
            Show in public dashboard
          </p>
        </div>
        <ToggleSwitch
          checked={!!field.publicVisible}
          onChange={(val) => updateField(field.id, { publicVisible: val })}
          colorClass="bg-blue-500"
        />
      </div>
    </div>
  );
}
