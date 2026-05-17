"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { PlusCircle } from "lucide-react";

import Logo from "@/components/shared/logo"; // Sesuaikan path logo lu
import { useSidebarStore } from "@/store/sidebar-store";
import { SIDEBAR_CONFIG } from "./sidebar.config";
import SidebarItem from "./sidebar-item";
import SidebarToggle from "./sidebar-toggle";

export default function Sidebar() {
  const { isCollapsed } = useSidebarStore();
  const [mounted, setMounted] = useState(false);

  // Hydration Fix: Jangan render UI logic sampai client siap baca LocalStorage
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Skeleton ringan untuk mencegah CLS (Cumulative Layout Shift) pas load
    return (
      <aside className="w-[260px] border-r border-sidebar-border bg-sidebar hidden md:flex h-full shrink-0" />
    );
  }

  return (
    <aside
      className={`relative hidden md:flex flex-col h-full border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-all duration-300 ease-in-out shrink-0 ${
        isCollapsed ? "w-[72px]" : "w-[260px]"
      }`}
    >
      {/* Tombol Toggle yang nongkrong di border kanan */}
      <SidebarToggle />

      {/* Header Sidebar (Logo) */}
      <div
        className={`h-16 flex items-center border-b border-sidebar-border shrink-0 transition-all ${isCollapsed ? "justify-center px-0" : "px-6"}`}
      >
        {/* Kalau komponen Logo lu belum support prop collapsed, biarin aja ngerender ikon utamanya aja pas width mengecil */}
        <Logo className={isCollapsed ? "scale-75" : ""} />
      </div>

      {/* Navigasi Utama */}
      <div className="flex-1 py-4 overflow-y-auto overflow-x-hidden scrollbar-hide">
        <div className="flex flex-col gap-6 px-3">
          {SIDEBAR_CONFIG.map((group, index) => (
            <div key={index} className="flex flex-col gap-1">
              {/* Group Title (Sembunyikan kalau collapsed) */}
              {!isCollapsed ? (
                <p className="px-3 text-[11px] font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-1">
                  {group.label}
                </p>
              ) : (
                /* Garis pemisah antar grup pas mode collapsed */
                index !== 0 && (
                  <div className="mx-4 my-2 border-t border-sidebar-border/40" />
                )
              )}

              {/* Looping Items */}
              {group.items.map((item) => (
                <SidebarItem key={item.name} item={item} />
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Footer / CTA Bikin Form */}
      <div className="p-3 border-t border-sidebar-border shrink-0">
        <Link
          href="/dashboard/forms/create"
          className={`flex items-center justify-center gap-2 w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 transition-colors font-semibold group relative ${
            isCollapsed
              ? "p-2.5 rounded-xl h-10 w-10 mx-auto"
              : "px-4 py-2.5 rounded-lg text-sm"
          }`}
        >
          <PlusCircle size={isCollapsed ? 20 : 18} className="shrink-0" />
          {!isCollapsed && <span className="truncate">New Form</span>}

          {/* Tooltip Khusus Tombol Create Form */}
          {isCollapsed && (
            <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-md border border-border whitespace-nowrap">
              Create Form
            </div>
          )}
        </Link>
      </div>
    </aside>
  );
}
