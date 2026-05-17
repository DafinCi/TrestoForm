"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useSidebarStore } from "@/store/sidebar-store";

export default function SidebarToggle() {
  const { isCollapsed, toggleSidebar } = useSidebarStore();

  return (
    <button
      onClick={toggleSidebar}
      className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background hover:bg-accent hover:text-accent-foreground text-muted-foreground transition-colors z-40 shadow-sm"
      aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
    >
      {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
    </button>
  );
}
