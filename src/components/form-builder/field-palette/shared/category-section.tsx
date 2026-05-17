"use client";

import React, { memo } from "react";
import PaletteItem from "./palette-item";
import { FieldDefinition } from "@/constants/field-definitions";

interface CategorySectionProps {
  category: string;
  fields: FieldDefinition[];
  isCompact: boolean;
  onAdd: (template: FieldDefinition) => void;
}

const CategorySection = memo(function CategorySection({
  category,
  fields,
  isCompact,
  onAdd,
}: CategorySectionProps) {
  return (
    <div className="space-y-2 mb-6">
      {!isCompact && (
        <h3 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground px-1">
          {category}
        </h3>
      )}
      <div
        className={`grid gap-2 ${isCompact ? "grid-cols-1" : "grid-cols-1"}`}
      >
        {fields.map((field) => (
          <PaletteItem
            key={field.type}
            id={`palette-${field.type}`}
            type={field.type}
            label={field.label}
            description={isCompact ? undefined : field.description}
            icon={field.icon}
            // Kirim objek field UTUH ke onAdd
            onAdd={() => onAdd(field)}
          />
        ))}
      </div>
    </div>
  );
});

export default CategorySection;
