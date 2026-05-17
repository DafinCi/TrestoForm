"use client";

import React from "react";
import { FieldOption } from "@/types/field";
import OptionItem from "./option-item";
import OptionEmpty from "./option-empty";

interface OptionListProps {
  options: FieldOption[];
  autoFocusIndex: number | null;
  onUpdate: (id: string, newLabel: string, newValue: string) => void;
  onDelete: (id: string) => void;
  onAddNext: (currentIndex: number) => void;
}

export default function OptionList({
  options,
  autoFocusIndex,
  onUpdate,
  onDelete,
  onAddNext,
}: OptionListProps) {
  if (options.length === 0) return <OptionEmpty />;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 px-6">
        <div className="flex-1 grid grid-cols-2 gap-2">
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Label
          </span>
          <span className="text-[10px] font-bold uppercase text-muted-foreground">
            Value (ID)
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {options.map((opt, idx) => (
          <OptionItem
            key={opt.id}
            option={opt}
            index={idx}
            autoFocus={autoFocusIndex === idx}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onAddNext={onAddNext}
          />
        ))}
      </div>
    </div>
  );
}
