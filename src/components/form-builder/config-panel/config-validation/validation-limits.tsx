"use client";

import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface DebouncedNumberInputProps {
  label: string;
  value?: number;
  placeholder: string;
  onChangeValue: (val: number | undefined) => void;
}

export function ValidationNumberInput({
  label,
  value,
  placeholder,
  onChangeValue,
}: DebouncedNumberInputProps) {
  const [localValue, setLocalValue] = useState<string>(
    value !== undefined ? String(value) : "",
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const parsed = parseInt(localValue, 10);
      if (!isNaN(parsed)) {
        onChangeValue(parsed);
      } else if (localValue === "") {
        onChangeValue(undefined);
      }
    }, 400); // 400ms debounce
    return () => clearTimeout(timer);
  }, [localValue, onChangeValue]);

  return (
    <div className="space-y-1.5 flex-1">
      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>
      <Input
        type="number"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-primary/50 transition-none"
      />
    </div>
  );
}

// Untuk format seperti Email / URL
export function ValidationFormatSelect({
  value,
  onChangeValue,
}: {
  value?: string;
  onChangeValue: (val: string | undefined) => void;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        Data Format
      </Label>
      <select
        value={value || "none"}
        onChange={(e) =>
          onChangeValue(e.target.value === "none" ? undefined : e.target.value)
        }
        className="w-full h-8 px-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-primary/50"
      >
        <option value="none">Any Text</option>
        <option value="email">Email Address</option>
        <option value="url">Website URL</option>
        <option value="phone">Phone Number</option>
      </select>
    </div>
  );
}
