"use client";

import React from "react";
import { WorkspaceProvider, useWorkspace } from "./workspace-provider";
import WorkspaceHeader from "./workspace-header";

// Karena desktop dan mobile layout itu lumayan berat,
// kita bisa pertimbangkan lazy loading kalau perlu,
// tapi untuk sekarang kita import normal dulu sebagai struktur.
import DesktopWorkspace from "../desktop/desktop-workspace";
import MobileWorkspace from "../mobile/mobile-workspace";

function WorkspaceOrchestrator() {
  const { isMobile } = useWorkspace();

  return (
    // Layer paling luar, memaksakan ukuran penuh layar dan menahan overscroll
    <div className="flex flex-col h-[100dvh] w-full bg-background overflow-hidden overscroll-none">
      {/* HEADER: Persisten, tidak akan pernah unmount saat resize */}
      <WorkspaceHeader />

      {/* WORKSPACE AREA: Switching secara cerdas antara Desktop & Mobile */}
      <main className="flex-1 relative overflow-hidden">
        {isMobile ? <MobileWorkspace /> : <DesktopWorkspace />}
      </main>
    </div>
  );
}

// Ekspor utama: Membungkus Orchestrator dengan Provider
export default function WorkspaceShell() {
  return (
    <WorkspaceProvider>
      <WorkspaceOrchestrator />
    </WorkspaceProvider>
  );
}
