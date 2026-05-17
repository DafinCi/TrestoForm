"use client";

import React from "react";
import { useWorkspace } from "../shared/workspace-provider";

// Core Canvas
import Canvas from "../../canvas/canvas";

// Transient Overlays & Toolbars
import MobileBottomToolbar from "../../mobile/mobile-bottom-toolbar";
import MobilePalette from "../../field-palette/mobile/mobile-palette";
import MobileConfigSheet from "../../config-panel/mobile-config-sheet";

export default function MobileWorkspace() {
  const { isKeyboardOpen, keyboardHeight } = useWorkspace();

  return (
    <div
      className="flex flex-col h-full w-full relative bg-muted/10 overflow-hidden"
      style={{
        // 🚨 MAGIC TRICK: Hindari keyboard menutupi area aktif di canvas!
        // Kalau keyboard muncul, kita dorong padding bawah sebesar tinggi keyboard.
        paddingBottom: isKeyboardOpen ? `${keyboardHeight}px` : "0px",
        transition: "padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      }}
    >
      {/* 1. LAYER UTAMA: Canvas (Fullscreen) */}
      <main className="flex-1 w-full h-full relative z-0">
        <Canvas />
      </main>

      {/* 2. TRANSIENT OVERLAYS: Bottom Sheets */}
      {/* Komponen-komponen ini tidak merender UI di dalam flow DOM normal, 
          melainkan menggunakan Portal/Drawer (Vaul) yang muncul dari bawah.
          Logic buka-tutupnya (isOpen) sudah di-handle mandiri oleh komponen masing-masing 
          lewat BuilderUIStore. */}
      <MobilePalette />
      <MobileConfigSheet />

      {/* 3. FIXED BOTTOM TOOLBAR (Command Center Mobile) */}
      {/* Jika keyboard terbuka, kita sembunyikan toolbar ini ke bawah layar 
          biar ngasih ruang maksimal buat user ngetik. */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-40 pb-safe transition-transform duration-300 ease-out ${
          isKeyboardOpen
            ? "translate-y-full opacity-0 pointer-events-none"
            : "translate-y-0 opacity-100"
        }`}
      >
        <MobileBottomToolbar />
      </div>
    </div>
  );
}
