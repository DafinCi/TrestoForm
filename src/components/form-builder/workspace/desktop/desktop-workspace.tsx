"use client";

import React from "react";
import DesktopPalette from "../../field-palette/desktop/desktop-palette";
import Canvas from "../../canvas/canvas";
import ConfigPanel from "../../config-panel/config-panel";
import DesktopResizer from "./desktop-resizer";
import { useBuilderUIStore } from "@/store/builder-store";

export default function DesktopWorkspace() {
  const viewMode = useBuilderUIStore((s) => s.viewMode);
  const isPreview = viewMode === "preview";

  return (
    <div className="flex h-full w-full overflow-hidden bg-background transition-all duration-300">
      {!isPreview && <DesktopPalette />}

      {/* 🌟 FIX: Buang "justify-center", ubah jadi "flex-col w-full" */}
      <main className="flex-1 min-w-0 h-full relative z-0 flex flex-col w-full">
        <Canvas />
      </main>

      {!isPreview && (
        <>
          <DesktopResizer />
          <ConfigPanel />
        </>
      )}
    </div>
  );
}
