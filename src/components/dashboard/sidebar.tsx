"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "@/components/shared/logo";
import { LayoutDashboard, FileText, Settings, PlusCircle } from "lucide-react";

const MENU_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Forms", href: "/dashboard/forms", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-sidebar-border bg-sidebar text-sidebar-foreground flex-col hidden md:flex h-full">
      {/* Header Sidebar */}
      <div className="h-16 flex items-center px-6 border-b border-sidebar-border shrink-0">
        <Logo />
      </div>

      {/* Navigasi Utama */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="space-y-1">
          {MENU_ITEMS.map((item) => {
            // Ngecek apakah route aktif (biar menunya nyala)
            const isActive =
              pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium ${
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                }`}
              >
                <Icon size={18} />
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Footer Sidebar (CTA Bikin Form) */}
      <div className="p-4 border-t border-sidebar-border shrink-0">
        <Link
          href="/dashboard/forms/create"
          className="flex items-center justify-center gap-2 w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
        >
          <PlusCircle size={18} />
          New Form
        </Link>
      </div>
    </aside>
  );
}
