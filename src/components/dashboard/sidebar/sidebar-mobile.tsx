"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, PlusCircle } from "lucide-react";

import Logo from "@/components/shared/logo";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { SIDEBAR_CONFIG } from "./sidebar.config";

export default function SidebarMobile() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      {/* Tombol Hamburger buat di Topbar */}
      <SheetTrigger asChild>
        <button className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground">
          <Menu size={24} />
        </button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[280px] p-0 flex flex-col bg-sidebar border-r-sidebar-border"
      >
        {/* Hidden Title buat Accessibility (Screen Reader) biar gak warning */}
        <SheetTitle className="sr-only">Navigation Menu</SheetTitle>

        {/* Header Sidebar (Logo) */}
        <div className="h-16 flex items-center px-6 border-b border-sidebar-border shrink-0">
          <Logo />
        </div>

        {/* Navigasi Utama */}
        <div className="flex-1 py-6 overflow-y-auto">
          <div className="flex flex-col gap-6 px-4">
            {SIDEBAR_CONFIG.map((group, index) => (
              <div key={index} className="flex flex-col gap-1">
                <p className="px-2 text-[11px] font-bold text-sidebar-foreground/50 uppercase tracking-wider mb-1">
                  {group.label}
                </p>

                {group.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setIsOpen(false)} // UX Penting: Tutup otomatis pas diklik
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
            ))}
          </div>
        </div>

        {/* Footer / CTA Bikin Form */}
        <div className="p-4 border-t border-sidebar-border shrink-0">
          <Link
            href="/dashboard/forms/create"
            onClick={() => setIsOpen(false)}
            className="flex items-center justify-center gap-2 w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <PlusCircle size={18} />
            New Form
          </Link>
        </div>
      </SheetContent>
    </Sheet>
  );
}
