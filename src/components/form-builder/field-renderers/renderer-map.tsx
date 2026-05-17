"use client";

import React from "react";
import { FormField, FieldType } from "@/types/field";

// Import semua komponen spesifik
import TextRenderer from "./text-renderer";
import TextareaRenderer from "./textarea-renderer";
import CheckboxRenderer from "./checkbox-renderer";
import SelectRenderer from "./select-renderer";
import FileRenderer from "./file-renderer";
import RatingRenderer from "./rating-renderer"; // Tambahan sesuai tipe di types/field.ts
import WalrusMediaRenderer from "./walrus-media-renderer";
import RadioRenderer from "./radio-renderer";
import DateRenderer from "./date-renderer";
import RichTextRenderer from "./richtext-renderer";

// === REGISTRY MAP ===
// Kalau besok mau nambah tipe "date", cukup tambahin di sini, nggak merusak UI lain!
const componentMap: Record<FieldType, React.FC<{ field: FormField }>> = {
  text: TextRenderer,
  textarea: TextareaRenderer,
  richtext: RichTextRenderer,
  url: TextRenderer,
  email: TextRenderer,
  phone: TextRenderer,
  number: TextRenderer,
  date: DateRenderer,
  checkbox: CheckboxRenderer,
  radio: RadioRenderer,
  select: SelectRenderer,
  rating: RatingRenderer,

  // THE MEDIA HUB (Semuanya pakai Walrus)
  file: WalrusMediaRenderer,
  image: WalrusMediaRenderer,
  video: WalrusMediaRenderer,
};

interface Props {
  field: FormField;
}

export default function FieldPreviewRenderer({ field }: Props) {
  // Ambil komponen yang sesuai, fallback ke TextRenderer kalau nggak ketemu
  const InputComponent = componentMap[field.type] || TextRenderer;

  return (
    <div className="flex flex-col gap-1.5 pointer-events-none">
      {/* 1. BAGIAN BUNGKUS (COMMON UI) */}
      <div className="flex items-center gap-2">
        <label className="font-semibold text-sm text-foreground">
          {field.label || "Untitled Field"}
        </label>
        {field.required && (
          <span className="text-destructive font-bold text-sm">*</span>
        )}
      </div>

      {field.description && (
        <p className="text-[13px] text-muted-foreground leading-snug">
          {field.description}
        </p>
      )}

      {/* 2. BAGIAN ISI (DYNAMIC MOCKUP INPUT) */}
      <div className="mt-2">
        <InputComponent field={field} />
      </div>
    </div>
  );
}
