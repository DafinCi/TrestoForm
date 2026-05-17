"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSidebarStore } from "@/store/sidebar-store";
import { SidebarItemType } from "./sidebar.config";

export default function SidebarItem({ item }: { item: SidebarItemType }) {
  const pathname = usePathname();
  const { isCollapsed } = useSidebarStore();
  const Icon = item.icon;

  // Cek active state: exact match ATAU sub-route (misal /dashboard/forms/create tetep nyalain menu Forms)
  const isActive =
    pathname === item.href || pathname.startsWith(`${item.href}/`);

  return (
    <div className="relative group">
      <Link
        href={item.href}
        className={`flex items-center gap-3 py-2 rounded-lg transition-all text-sm font-medium
          ${isCollapsed ? "justify-center px-0 w-10 h-10 mx-auto" : "justify-start px-3"}
          ${
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
              : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
          }
        `}
      >
        <Icon size={18} className="shrink-0" />

        {/* Teks hanya muncul jika tidak collapsed */}
        {!isCollapsed && <span className="truncate">{item.name}</span>}
      </Link>

      {/* Tooltip Pintar (Muncul otomatis di samping kalau lagi collapsed & di-hover) */}
      {isCollapsed && (
        <div className="absolute left-full top-1/2 -translate-y-1/2 ml-3 px-2.5 py-1.5 bg-popover text-popover-foreground text-xs font-semibold rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 z-50 shadow-md border border-border whitespace-nowrap">
          {item.name}
        </div>
      )}
    </div>
  );
}
