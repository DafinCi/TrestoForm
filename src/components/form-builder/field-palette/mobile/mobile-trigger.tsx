"use client";

import React, { useCallback } from "react";
import { Plus } from "lucide-react";

interface MobileTriggerProps {
  onClick: () => void;
  isOpen?: boolean; // Opsional: untuk styling state aktif jika diperlukan
}

export default function MobileTrigger({ onClick, isOpen }: MobileTriggerProps) {
  const handleTap = useCallback(() => {
    // 🔥 Haptic Feedback ringan ala Native App (Support di Android Chrome/Edge)
    if (typeof window !== "undefined" && navigator.vibrate) {
      navigator.vibrate(50); // Getaran halus 50ms
    }
    onClick();
  }, [onClick]);

  return (
    <button
      onClick={handleTap}
      disabled={isOpen}
      aria-label="Add new form field"
      className={`
        relative flex items-center justify-center gap-2 h-12 px-6 
        rounded-full font-bold text-sm shadow-lg
        transition-all duration-200 ease-out select-none
        /* Sentuhan mobile: active state untuk visual click feedback */
        active:scale-95 active:shadow-sm
        ${
          isOpen
            ? "bg-primary/50 text-primary-foreground/50 cursor-not-allowed scale-95 shadow-none"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }
      `}
    >
      <Plus
        className={`w-5 h-5 transition-transform duration-300 ${isOpen ? "rotate-45" : "rotate-0"}`}
      />
      <span>Add Field</span>

      {/* Optional: Efek glow ringan di belakang tombol untuk 
        menarik perhatian user bahwa ini adalah "Primary Action"
      */}
      {!isOpen && (
        <div className="absolute inset-0 -z-10 bg-primary/40 blur-md rounded-full animate-pulse opacity-50" />
      )}
    </button>
  );
}
