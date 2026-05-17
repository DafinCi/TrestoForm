"use client";

import React, { useState } from "react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerPortal,
} from "@/components/ui/drawer"; // Sesuaikan jika import lu beda

interface MobileSheetProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export default function MobileSheet({
  isOpen,
  onOpenChange,
  children,
}: MobileSheetProps) {
  // State untuk melacak apakah user sedang menarik sheet ke fullscreen
  const [snap, setSnap] = useState<number | string | null>(0.5);

  return (
    <Drawer
      open={isOpen}
      onOpenChange={onOpenChange}
      // Physics & UX Engine
      shouldScaleBackground={true} // Bikin canvas belakang mengecil ala iOS
      snapPoints={[0.5, 0.95]} // 0.5 = Half screen, 0.95 = Almost Fullscreen
      activeSnapPoint={snap}
      setActiveSnapPoint={setSnap}
      fadeFromIndex={0} // Background overlay mulai gelap dari snap point pertama
    >
      <DrawerPortal>
        {/* Backdrop dengan GPU-friendly blur */}
        <DrawerOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" />

        <DrawerContent
          className={`
            fixed bottom-0 left-0 right-0 z-50 
            flex flex-col bg-background outline-none
            rounded-t-[24px] border-t border-border shadow-2xl
            /* Hapus transition dari tinggi, biarkan Vaul yang ngurus physics-nya */
            h-[95vh]
          `}
        >
          {/* Grabber Handle (Indikator visual untuk ditarik)
            Area ini sengaja dibuat agak lebar tap-targetnya biar gampang kena jempol 
          */}
          <div className="flex w-full items-center justify-center pt-4 pb-2 cursor-grab active:cursor-grabbing">
            <div className="w-12 h-1.5 rounded-full bg-muted-foreground/20" />
          </div>

          {/* Content Wrapper
            Pakai overflow-hidden di luar, biar isi di dalamnya yang ngurus scrolling (Grid/Category)
          */}
          <div className="flex-1 w-full flex flex-col overflow-hidden px-4 pb-6">
            {children}
          </div>
        </DrawerContent>
      </DrawerPortal>
    </Drawer>
  );
}
