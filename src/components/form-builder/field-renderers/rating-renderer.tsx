import React from "react";
import { FormField } from "@/types/field";
import { Star } from "lucide-react";

export default function RatingRenderer({ field }: { field: FormField }) {
  // Mockup visual di Canvas: Kita buat default 5 bintang abu-abu
  // Ingat: Ini tidak bisa di-klik karena dibungkus pointer-events-none oleh parent (renderer-map)
  return (
    <div className="flex items-center gap-1.5 py-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={24}
          // Di mockup canvas, kita bikin warnanya muted
          className="text-muted-foreground/30 stroke-1"
          fill="currentColor"
        />
      ))}
    </div>
  );
}
