"use client";

import React, { useRef, useEffect } from "react";
import { Search, X } from "lucide-react";

interface MobileSearchProps {
  query: string;
  onQueryChange: (query: string) => void;
}

export default function MobileSearch({
  query,
  onQueryChange,
}: MobileSearchProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input saat palette/sheet ini terbuka biar user bisa langsung mengetik
  useEffect(() => {
    // Beri sedikit delay tipis agar animasi transisi Vaul Sheet selesai dulu,
    // mencegah gangguan keyboard native di iOS/Android.
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 150);

    return () => clearTimeout(timer);
  }, []);

  const handleClear = () => {
    onQueryChange("");
    inputRef.current?.focus();
  };

  return (
    <div className="relative w-full">
      {/* Search Icon di Kiri */}
      <div className="absolute left-3.5 top-1/2 -translate-y-1/2 flex items-center pointer-events-none text-muted-foreground/60">
        <Search className="w-4 h-4" />
      </div>

      {/* Input Field dengan Tap Target Tinggi (h-11) */}
      <input
        ref={inputRef}
        type="text"
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Cari komponen..."
        inputMode="search" // Mengubah tombol "Enter" di keyboard HP jadi tombol "Search"
        autoComplete="off"
        autoCorrect="off"
        className={`
          w-full h-11 pl-10 pr-10 text-sm rounded-xl
          bg-muted/40 border border-border/40 text-foreground
          placeholder:text-muted-foreground/50
          focus:outline-none focus:ring-1 focus:ring-primary focus:bg-background
          transition-all duration-200
        `}
      />

      {/* Tombol Clear (X) - Ephemeral: Hanya muncul kalau ada teks */}
      {query && (
        <button
          onClick={handleClear}
          aria-label="Clear search"
          className={`
            absolute right-2 top-1/2 -translate-y-1/2 
            w-8 h-8 flex items-center justify-center rounded-lg
            text-muted-foreground/60 hover:text-foreground
            active:bg-muted/80 transition-colors
          `}
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
