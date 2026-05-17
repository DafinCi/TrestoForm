import React from "react";
import { FormField } from "@/types/field";
import { Mail, Phone, Link, Hash, Type } from "lucide-react";

export default function TextRenderer({ field }: { field: FormField }) {
  // Tentukan Icon dan Placeholder fallback berdasarkan tipe
  const getIcon = () => {
    switch (field.type) {
      case "email":
        return <Mail className="w-4 h-4 text-muted-foreground/50" />;
      case "phone":
        return <Phone className="w-4 h-4 text-muted-foreground/50" />;
      case "url":
        return <Link className="w-4 h-4 text-muted-foreground/50" />;
      case "number":
        return <Hash className="w-4 h-4 text-muted-foreground/50" />;
      default:
        return null; // Text biasa tidak pakai icon, atau bisa pakai <Type />
    }
  };

  const getPlaceholder = () => {
    if (field.placeholder) return field.placeholder;
    switch (field.type) {
      case "email":
        return "hello@example.com";
      case "phone":
        return "+1 (555) 000-0000";
      case "url":
        return "https://example.com";
      case "number":
        return "12345";
      default:
        return "Short text answer...";
    }
  };

  return (
    <div className="w-full h-10 rounded-lg border border-input bg-background/50 flex items-center px-3 gap-2">
      {getIcon()}
      <span className="text-muted-foreground/40 text-sm">
        {getPlaceholder()}
      </span>
    </div>
  );
}
