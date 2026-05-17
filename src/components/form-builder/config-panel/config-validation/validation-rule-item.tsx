"use client";

import React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface ValidationRuleItemProps {
  title: string;
  description: string;
  isActive: boolean;
  onToggle: (active: boolean) => void;
  children?: React.ReactNode;
}

export default function ValidationRuleItem({
  title,
  description,
  isActive,
  onToggle,
  children,
}: ValidationRuleItemProps) {
  return (
    <div
      className={`p-4 rounded-lg border transition-colors ${isActive ? "border-primary/50 bg-primary/5" : "border-border bg-card"}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <Label className="text-sm font-semibold">{title}</Label>
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
        <Switch checked={isActive} onCheckedChange={onToggle} />
      </div>

      {/* Area untuk input detail (seperti angka Min/Max) */}
      {isActive && children && (
        <div className="mt-4 pt-4 border-t border-border/50 animate-in fade-in slide-in-from-top-2">
          {children}
        </div>
      )}
    </div>
  );
}
