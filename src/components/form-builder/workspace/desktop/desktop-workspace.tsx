"use client";

import React from "react";
import DesktopPalette from "../../field-palette/desktop/desktop-palette";
import Canvas from "../../canvas/canvas";
import ConfigPanel from "../../config-panel/config-panel";
import DesktopResizer from "./desktop-resizer";

export default function DesktopWorkspace() {
  return (
    <div className="flex h-full w-full overflow-hidden bg-background">
      {/* KIRI: Field Palette (Komponen untuk drag field baru) */}
      {/* Biasanya lebarnya statis (misal 280px/300px) dan diatur di dalam komponennya sendiri */}
      <DesktopPalette />

      {/* TENGAH: Canvas Area */}
      {/* flex-1 bikin dia ngambil sisa ruang di tengah. 
          min-w-0 sangat krusial di flexbox biar kalau canvas kegedean, 
          dia gak ngedorong sidebar keluar layar. */}
      <main className="flex-1 min-w-0 h-full relative z-0">
        <Canvas />
      </main>

      <DesktopResizer />

      {/* KANAN: Config Panel (Pengaturan properti field) */}
      {/* Logic buka-tutup (isConfigOpen) dan geser lebar (configWidth) 
          udah di-handle mandiri di dalam komponen ConfigPanel lu. Brilliant! */}
      <ConfigPanel />
    </div>
  );
}
