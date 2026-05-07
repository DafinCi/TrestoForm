"use client";

import React, { useState } from "react";
import FieldPalette from "@/components/form-builder/field-palette";
import BuilderCanvas from "@/components/form-builder/builder-canvas";
import FieldConfig from "@/components/form-builder/field-config";
import FormPreview from "@/components/form-builder/form-preview";
import { useFormBuilderStore } from "@/store/form-builder-store";

// Icons
import { Eye, PenTool, Save, Settings2, Plus, ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function CreateFormPage() {
  const [viewMode, setViewMode] = useState<"builder" | "preview">("builder");
  const [showLeftSidebar, setShowLeftSidebar] = useState(false);
  const [showRightSidebar, setShowRightSidebar] = useState(false);

  const { title, setTitle } = useFormBuilderStore();

  const handleSave = () => {
    alert("Form Schema Saved to Walrus & Sui!");
  };

  return (
    <div className="flex flex-col h-full bg-background font-sans">
      {/* === SUB-HEADER (Action Bar) === */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 border-b border-border bg-card/50 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <Link
            href="/dashboard/forms"
            className="p-2 hover:bg-accent rounded-full transition-colors"
          >
            <ChevronLeft size={20} />
          </Link>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="font-heading text-lg md:text-xl bg-transparent border-none focus:outline-none focus:ring-0 placeholder:text-muted-foreground/40 w-full sm:w-64 font-bold"
            placeholder="Untitled Form"
          />
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto">
          {/* View Toggle */}
          <div className="flex items-center bg-muted p-1 rounded-xl border border-border">
            <button
              onClick={() => setViewMode("builder")}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
                viewMode === "builder"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <PenTool size={14} />{" "}
              <span className="hidden xs:inline">Builder</span>
            </button>
            <button
              onClick={() => setViewMode("preview")}
              className={`flex items-center gap-2 px-3 py-1.5 text-xs md:text-sm font-medium rounded-lg transition-all ${
                viewMode === "preview"
                  ? "bg-card shadow-sm text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Eye size={14} />{" "}
              <span className="hidden xs:inline">Preview</span>
            </button>
          </div>

          <button
            onClick={handleSave}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-xl text-sm font-bold hover:opacity-90 transition-all shadow-md active:scale-95"
          >
            <Save size={16} /> <span>Save</span>
          </button>
        </div>
      </div>

      {/* === WORKSPACE AREA === */}
      <div className="relative flex-1 flex overflow-hidden h-full">
        {viewMode === "builder" ? (
          <>
            {/* 1. Left Sidebar (Palette) - Responsive Drawer on Mobile */}
            <div
              className={`
              absolute lg:relative z-30 h-full w-72 bg-card border-r border-border transition-transform duration-300
              ${showLeftSidebar ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
            `}
            >
              <FieldPalette />
              {/* Mobile Close Button */}
              <button
                onClick={() => setShowLeftSidebar(false)}
                className="lg:hidden absolute top-4 right-4 p-2 bg-accent rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* 2. Main Canvas */}
            <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 custom-scrollbar">
              <div className="max-w-3xl mx-auto min-h-full">
                <BuilderCanvas />
              </div>
            </div>

            {/* 3. Right Sidebar (Config) - Responsive Drawer on Mobile */}
            <div
              className={`
              absolute lg:relative right-0 z-30 h-full w-80 bg-card border-l border-border transition-transform duration-300
              ${showRightSidebar ? "translate-x-0" : "translate-x-full lg:translate-x-0"}
            `}
            >
              <FieldConfig />
              {/* Mobile Close Button */}
              <button
                onClick={() => setShowRightSidebar(false)}
                className="lg:hidden absolute top-4 left-4 p-2 bg-accent rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
            </div>

            {/* === MOBILE FLOATING CONTROLS === */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 flex gap-4 z-40">
              <button
                onClick={() => {
                  setShowLeftSidebar(true);
                  setShowRightSidebar(false);
                }}
                className="bg-primary text-primary-foreground p-4 rounded-full shadow-2xl active:scale-90 transition-transform"
              >
                <Plus size={24} />
              </button>
              <button
                onClick={() => {
                  setShowRightSidebar(true);
                  setShowLeftSidebar(false);
                }}
                className="bg-secondary text-secondary-foreground p-4 rounded-full shadow-2xl active:scale-90 transition-transform border border-border"
              >
                <Settings2 size={24} />
              </button>
            </div>
          </>
        ) : (
          /* Preview Mode */
          <div className="flex-1 overflow-y-auto bg-muted/30 p-4 md:p-12">
            <div className="max-w-2xl mx-auto">
              <FormPreview />
            </div>
          </div>
        )}
      </div>

      {/* Backdrop for mobile drawers */}
      {(showLeftSidebar || showRightSidebar) && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-sm z-20"
          onClick={() => {
            setShowLeftSidebar(false);
            setShowRightSidebar(false);
          }}
        />
      )}
    </div>
  );
}
