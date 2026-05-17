"use client";

import React from "react";
import { Database, LayoutDashboard, UserSquare2 } from "lucide-react";

interface PrivacyPreviewProps {
  isEncrypted: boolean;
  isMasked: boolean;
  visibility: string;
}

export default function PrivacyPreview({
  isEncrypted,
  isMasked,
  visibility,
}: PrivacyPreviewProps) {
  // Dummy data untuk simulasi
  const rawData = "john.doe@wallet.com";

  // Logic simulasi
  const dashboardView = isMasked ? "j***.d**@w****.com" : rawData;
  const dbView = isEncrypted ? "0x8f7a9b2e4c1d5f... (Ciphertext)" : rawData;

  return (
    <div className="mt-6 pt-6 border-t border-border/40 space-y-4">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
          Data Flow Preview
        </h4>
        <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-mono">
          Live Simulation
        </span>
      </div>

      <div className="space-y-2 bg-muted/20 border border-border rounded-lg p-3">
        {/* Public Form View */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2 pb-2 border-b border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <UserSquare2 size={12} />
            <span className="text-[10px] font-medium">Public Form</span>
          </div>
          <div className="text-xs font-mono text-foreground truncate">
            {visibility === "private" || visibility === "admin_only" ? (
              <span className="text-muted-foreground italic">
                [Field is Hidden]
              </span>
            ) : (
              rawData
            )}
          </div>
        </div>

        {/* Dashboard View */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2 pb-2 border-b border-border/50">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <LayoutDashboard size={12} />
            <span className="text-[10px] font-medium">Dashboard</span>
          </div>
          <div className="text-xs font-mono text-foreground truncate">
            {dashboardView}
          </div>
        </div>

        {/* Database / Walrus View */}
        <div className="grid grid-cols-[100px_1fr] items-center gap-2 pt-1">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Database size={12} />
            <span className="text-[10px] font-medium">Storage layer</span>
          </div>
          <div
            className={`text-xs font-mono truncate ${isEncrypted ? "text-emerald-500" : "text-foreground"}`}
          >
            {dbView}
          </div>
        </div>
      </div>
    </div>
  );
}
