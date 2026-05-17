"use client";

import React, { useState } from "react";
import {
  useBuilderUIStore,
  useBuilderSchemaStore,
} from "@/store/builder-store";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Check,
  Settings2,
  ListTodo,
  ShieldCheck,
  SlidersHorizontal,
} from "lucide-react";

// Reuse komponen yang sama dengan Desktop!
import ConfigBasic from "./config-basic";
import ConfigOptions from "./config-options/config-options";
import ConfigValidation from "./config-validation/config-validation";
import ConfigPrivacy from "./config-privacy/config-privacy";

export default function MobileConfigSheet() {
  const { isConfigOpen, closeConfig, activeFieldId } = useBuilderUIStore();
  const field = useBuilderSchemaStore((s) =>
    s.fields.find((f) => f.id === activeFieldId),
  );

  // Snap point state untuk Vaul
  const [snap, setSnap] = useState<number | string | null>(0.85);

  // Jangan render isi drawer kalau nggak ada field yang aktif
  // (mencegah error saat animasi drawer sedang menutup)
  if (!activeFieldId || !field) {
    return (
      <Drawer open={isConfigOpen} onOpenChange={closeConfig}>
        <DrawerPortal>
          <DrawerOverlay />
        </DrawerPortal>
      </Drawer>
    );
  }

  // Cek apakah field ini butuh tab Options (Select, Radio, Checkbox)
  const hasOptions = ["select", "radio", "checkbox", "multi-select"].includes(
    field.type,
  );

  return (
    <Drawer
      open={isConfigOpen}
      onOpenChange={closeConfig}
      shouldScaleBackground={true}
      snapPoints={[0.85, 1]} // 85% untuk nyaman, 100% untuk antisipasi keyboard
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
    >
      <DrawerPortal>
        <DrawerOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" />

        <DrawerContent className="fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background outline-none rounded-t-[24px] border-t border-border shadow-2xl h-[95vh] max-h-[100dvh]">
          {/* Grabber Handle */}
          <div className="flex w-full items-center justify-center pt-4 pb-2 shrink-0 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
          </div>

          {/* Sticky Header: Supaya tombol "Done" selalu terjangkau jempol */}
          <div className="flex items-center justify-between px-5 pb-4 border-b border-border/50 shrink-0">
            <div className="flex flex-col">
              <h2 className="text-lg font-bold capitalize leading-tight">
                {field.type} Settings
              </h2>
              <span className="text-xs text-muted-foreground line-clamp-1">
                {field.label || "Untitled Field"}
              </span>
            </div>

            <button
              onClick={closeConfig}
              className="flex items-center gap-1.5 px-4 py-2 bg-primary text-primary-foreground font-semibold text-sm rounded-full active:scale-95 transition-all shadow-sm"
            >
              <Check className="w-4 h-4" />
              <span>Done</span>
            </button>
          </div>

          {/* Scrollable Content dengan Accordion */}
          <div className="flex-1 w-full overflow-y-auto px-4 py-2 custom-scrollbar">
            <Accordion
              type="single"
              collapsible
              defaultValue="basic"
              className="w-full space-y-3 pb-12" // pb-12 agar area bawah tidak tertutup OS Navigation Bar
            >
              {/* 1. BASIC SETTINGS */}
              <AccordionItem
                value="basic"
                className="border-none bg-muted/10 rounded-2xl px-4 shadow-sm border border-border/50"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Settings2 className="w-4 h-4 text-primary" />
                    Basic Properties
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <ConfigBasic />
                </AccordionContent>
              </AccordionItem>

              {/* 2. OPTIONS SETTINGS (Conditional) */}
              {hasOptions && (
                <AccordionItem
                  value="options"
                  className="border-none bg-muted/10 rounded-2xl px-4 shadow-sm border border-border/50"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex items-center gap-2 text-sm font-semibold">
                      <ListTodo className="w-4 h-4 text-blue-500" />
                      Choices & Options
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <ConfigOptions />
                  </AccordionContent>
                </AccordionItem>
              )}

              {/* 3. VALIDATION/RULES */}
              <AccordionItem
                value="rules"
                className="border-none bg-muted/10 rounded-2xl px-4 shadow-sm border border-border/50"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <SlidersHorizontal className="w-4 h-4 text-orange-500" />
                    Validation Rules
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <ConfigValidation />
                </AccordionContent>
              </AccordionItem>

              {/* 4. PRIVACY/ADVANCED */}
              <AccordionItem
                value="privacy"
                className="border-none bg-muted/10 rounded-2xl px-4 shadow-sm border border-border/50"
              >
                <AccordionTrigger className="hover:no-underline py-4">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <ShieldCheck className="w-4 h-4 text-green-500" />
                    Privacy & Visibility
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-4">
                  <ConfigPrivacy />
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
