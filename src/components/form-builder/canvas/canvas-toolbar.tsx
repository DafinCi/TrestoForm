"use client";

import React from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  RotateCcw,
  RotateCw,
  Minus,
  CheckLine,
  Plus,
  CloudUpload,
} from "lucide-react";
import { useBuilderUIStore } from "@/store/builder-store";

export default function CanvasToolbar() {
  const { device, setDevice, zoom, setZoom, isSaving } = useBuilderUIStore();

  const handleZoom = (type: "in" | "out") => {
    if (type === "in") setZoom(Math.min(zoom + 10, 150));
    else setZoom(Math.max(zoom - 10, 50));
  };

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-card border-b border-border text-muted-foreground select-none">
      {/* Kiri: Undo/Redo & Save Status */}
      <div className="flex items-center gap-4">
        <div className="flex items-center border-r border-border pr-4 gap-1">
          <button className="p-1.5 hover:bg-accent hover:text-foreground rounded-md transition-all">
            <RotateCcw size={16} />
          </button>
          <button className="p-1.5 hover:bg-accent hover:text-foreground rounded-md transition-all opacity-40">
            <RotateCw size={16} />
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs font-medium">
          {isSaving ? (
            <>
              <CloudUpload size={14} className="animate-pulse text-primary" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckLine size={14} className="text-green-500" />
              <span>Saved to Walrus</span>
            </>
          )}
        </div>
      </div>

      {/* Tengah: Device Preview */}
      <div className="flex items-center bg-muted/50 p-1 rounded-lg border border-border">
        <button
          onClick={() => setDevice("desktop")}
          className={`p-1.5 rounded-md transition-all ${device === "desktop" ? "bg-card text-primary shadow-sm" : "hover:text-foreground"}`}
        >
          <Monitor size={18} />
        </button>
        <button
          onClick={() => setDevice("tablet")}
          className={`p-1.5 rounded-md transition-all ${device === "tablet" ? "bg-card text-primary shadow-sm" : "hover:text-foreground"}`}
        >
          <Tablet size={18} />
        </button>
        <button
          onClick={() => setDevice("mobile")}
          className={`p-1.5 rounded-md transition-all ${device === "mobile" ? "bg-card text-primary shadow-sm" : "hover:text-foreground"}`}
        >
          <Smartphone size={18} />
        </button>
      </div>

      {/* Kanan: Zoom Control */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleZoom("out")}
            className="p-1 hover:text-foreground"
          >
            <Minus size={14} />
          </button>
          <span className="text-[11px] font-mono w-10 text-center">
            {zoom}%
          </span>
          <button
            onClick={() => handleZoom("in")}
            className="p-1 hover:text-foreground"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
