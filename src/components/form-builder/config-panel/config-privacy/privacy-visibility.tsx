"use client";

import React from "react";
import { Globe, Lock, ShieldAlert } from "lucide-react";

interface PrivacyVisibilityProps {
  value: "public" | "private" | "admin_only";
  onChange: (val: "public" | "private" | "admin_only") => void;
}

export default function PrivacyVisibility({
  value,
  onChange,
}: PrivacyVisibilityProps) {
  const options = [
    {
      id: "public",
      title: "Publicly Visible",
      desc: "Anyone can see this field on the form.",
      icon: Globe,
    },
    {
      id: "private",
      title: "Hidden (Internal)",
      desc: "Used for tracking. Not visible to submitters.",
      icon: Lock,
    },
    {
      id: "admin_only",
      title: "Admin Only",
      desc: "Requires admin signature to view or edit.",
      icon: ShieldAlert,
    },
  ] as const;

  return (
    <div className="space-y-3">
      <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Form Visibility
      </h4>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt) => {
          const isSelected = value === opt.id;
          const Icon = opt.icon;
          return (
            <button
              key={opt.id}
              onClick={() => onChange(opt.id)}
              className={`flex items-start gap-3 p-3 text-left rounded-lg border transition-all ${
                isSelected
                  ? "border-primary bg-primary/5 ring-1 ring-primary/20"
                  : "border-border bg-card hover:bg-muted/50"
              }`}
            >
              <div
                className={`p-1.5 rounded-md ${isSelected ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"}`}
              >
                <Icon size={16} />
              </div>
              <div className="space-y-0.5">
                <p
                  className={`text-sm font-medium ${isSelected ? "text-primary" : "text-foreground"}`}
                >
                  {opt.title}
                </p>
                <p className="text-[10px] text-muted-foreground leading-tight">
                  {opt.desc}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
