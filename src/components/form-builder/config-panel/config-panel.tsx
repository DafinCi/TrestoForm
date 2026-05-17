"use client";

import React, { useEffect } from "react";
import { useBuilderUIStore } from "@/store/builder-store";
import { X, Settings2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ConfigBasic from "./config-basic";
import ConfigOptions from "./config-options/config-options";
import ConfigValidation from "./config-validation/config-validation";
import ConfigPrivacy from "./config-privacy/config-privacy";

export default function ConfigPanel() {
  const { activeFieldId, isConfigOpen, configWidth, closeConfig } =
    useBuilderUIStore();

  // --- ESC to Close ---
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeConfig();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [closeConfig]);

  return (
    <aside
      style={{
        // 🚨 MAGIC INTEGRATION:
        // Jika buka, pakai CSS Variable (dikendalikan DesktopResizer).
        // Fallback ke configWidth dari Zustand jika CSS Variable belum ada.
        width: isConfigOpen ? `var(--config-width, ${configWidth}px)` : "0px",
      }}
      // Kita pakai class khusus `config-panel-transition` untuk ngatur animasinya
      // biar gak lag saat ditarik. (Penjelasan di bawah)
      className="relative h-full bg-card border-l border-border flex flex-col overflow-hidden shadow-xl transition-[width] duration-300 ease-out"
    >
      {!activeFieldId ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <Settings2 size={40} className="mb-4 opacity-20" />
          <p className="text-sm italic">
            Select a field to configure its properties
          </p>
        </div>
      ) : (
        <>
          {/* Header Panel */}
          <div className="flex items-center justify-between p-4 border-b border-border bg-muted/20">
            <h3 className="font-bold text-sm uppercase tracking-wider">
              Field Settings
            </h3>
            <button
              onClick={closeConfig}
              className="p-1.5 hover:bg-accent rounded-md transition-all"
            >
              <X size={18} />
            </button>
          </div>

          {/* Tabs Section */}
          <Tabs
            defaultValue="basic"
            className="flex-1 flex flex-col overflow-hidden"
          >
            <div className="px-4 pt-4">
              <TabsList className="grid grid-cols-4 w-full h-9">
                <TabsTrigger value="basic" className="text-xs">
                  Basic
                </TabsTrigger>
                <TabsTrigger value="options" className="text-xs">
                  Options
                </TabsTrigger>
                <TabsTrigger value="valid" className="text-xs">
                  Rules
                </TabsTrigger>
                <TabsTrigger value="privacy" className="text-xs">
                  Privacy
                </TabsTrigger>
              </TabsList>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-6">
              <TabsContent
                value="basic"
                className="m-0 focus-visible:outline-none"
              >
                <ConfigBasic />
              </TabsContent>
              <TabsContent
                value="options"
                className="m-0 focus-visible:outline-none"
              >
                <ConfigOptions />
              </TabsContent>
              <TabsContent
                value="valid"
                className="m-0 focus-visible:outline-none"
              >
                <ConfigValidation />
              </TabsContent>
              <TabsContent
                value="privacy"
                className="m-0 focus-visible:outline-none"
              >
                <ConfigPrivacy />
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}
    </aside>
  );
}
