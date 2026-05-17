"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

import { useBuilderSchemaStore } from "@/store/builder-store";
import { DebouncedInput } from "../../shared/debounced-input";

import ViewToggle from "./view-toggle";
import PublishButton from "./publish-button";

export default function WorkspaceHeader() {
  // Hanya subscribe ke title.
  const title = useBuilderSchemaStore((s) => s.title);
  const setTitle = useBuilderSchemaStore((s) => s.setTitle);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
      {/* AREA KIRI: Navigasi & Judul */}
      <div className="flex items-center gap-3 w-full sm:w-auto">
        <Link
          href="/dashboard/forms"
          className="p-2 hover:bg-accent rounded-full transition-colors shrink-0"
        >
          <ChevronLeft size={20} />
        </Link>
        <DebouncedInput
          value={title || ""} // 🌟 FIX: Pastikan tidak pernah undefined/null
          onChangeValue={(val) => setTitle(val ?? "")} // 🌟 FIX: Kalau dihapus habis, set jadi string kosong, jangan null
          className="font-heading text-lg md:text-xl bg-transparent border-none focus-visible:outline-none focus-visible:ring-0 shadow-none placeholder:text-muted-foreground/40 w-full sm:w-64 font-bold px-0"
          placeholder="Untitled Form"
        />
      </div>

      {/* AREA KANAN: Tools & Actions */}
      <div className="flex items-center justify-between sm:justify-end gap-3 w-full sm:w-auto">
        <ViewToggle />
        <PublishButton />
      </div>
    </div>
  );
}
