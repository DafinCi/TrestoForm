"use client";

import React, { useState, useEffect, memo } from "react";
import { X, GripVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { FieldOption } from "@/types/field";

const generateSlug = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
};

interface OptionItemProps {
  option: FieldOption;
  index: number;
  autoFocus?: boolean;
  onUpdate: (id: string, newLabel: string, newValue: string) => void;
  onDelete: (id: string) => void;
  onAddNext: (currentIndex: number) => void;
}

const OptionItem = memo(function OptionItem({
  option,
  index,
  autoFocus,
  onUpdate,
  onDelete,
  onAddNext,
}: OptionItemProps) {
  const [localLabel, setLocalLabel] = useState(option.label);
  const [localValue, setLocalValue] = useState(option.value);
  const [isCustomValue, setIsCustomValue] = useState(
    option.value !== "" && option.value !== generateSlug(option.label),
  );

  // Debounce sinkronisasi ke global store
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localLabel !== option.label || localValue !== option.value) {
        onUpdate(option.id, localLabel, localValue);
      }
    }, 400);
    return () => clearTimeout(timer);
  }, [localLabel, localValue, option.id, option.label, option.value, onUpdate]);

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setLocalLabel(val);
    if (!isCustomValue) setLocalValue(generateSlug(val));
  };

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocalValue(e.target.value);
    setIsCustomValue(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      onAddNext(index);
    } else if (e.key === "Backspace" && localLabel === "") {
      e.preventDefault();
      onDelete(option.id);
    }
  };

  return (
    <div className="flex items-center gap-2 group">
      {/* Nanti ini buat target DnD Sortable */}
      <div className="cursor-grab text-muted-foreground/30 hover:text-foreground transition-colors">
        <GripVertical size={16} />
      </div>

      <div className="flex-1 grid grid-cols-2 gap-2">
        <Input
          value={localLabel}
          onChange={handleLabelChange}
          onKeyDown={handleKeyDown}
          placeholder={`Option ${index + 1}`}
          autoFocus={autoFocus}
          className="h-8 text-sm focus-visible:ring-1 focus-visible:ring-primary/50 transition-none"
        />
        <Input
          value={localValue}
          onChange={handleValueChange}
          onKeyDown={handleKeyDown}
          placeholder="value"
          className="h-8 text-sm text-muted-foreground bg-muted/20 font-mono focus-visible:ring-1 focus-visible:ring-primary/50 transition-none"
        />
      </div>

      <button
        onClick={() => onDelete(option.id)}
        className="p-1.5 text-muted-foreground/50 hover:text-destructive hover:bg-destructive/10 rounded-md transition-all opacity-0 group-hover:opacity-100"
      >
        <X size={16} />
      </button>
    </div>
  );
});

export default OptionItem;
