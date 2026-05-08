"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  LayoutDashboard,
  FileText,
  PlusCircle,
  Settings,
} from "lucide-react";
import Logo from "@/components/shared/logo";
import dynamic from "next/dynamic";
const ConnectWallet = dynamic(
  () => import("@/components/wallet/connect-wallet"),
  {
    ssr: false,
    loading: () => (
      <div className="w-[140px] h-10 bg-muted/50 animate-pulse rounded-xl" />
    ),
  },
);

// Data menu disatukan biar gampang di-map dan diatur active state-nya
const MOBILE_MENU_ITEMS = [
  { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { name: "My Forms", href: "/dashboard/forms", icon: FileText },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // 1. Mencegah background scroll saat mobile drawer terbuka
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  // 2. Formatter judul yang lebih presisi untuk nested dynamic routes
  const getPageTitle = () => {
    if (pathname.includes("/forms/create")) return "Create New Form";
    if (pathname.match(/\/forms\/.*\/settings/)) return "Form Settings";
    if (pathname.match(/\/forms\/.*\/analytics/)) return "Form Analytics";
    if (pathname.includes("/forms/")) return "Form Details";
    if (pathname.includes("/forms")) return "My Forms";
    if (pathname.includes("/settings")) return "Settings";
    return "Dashboard Overview";
  };

  return (
    <>
      {/* Topbar Base dibuat sticky dan ada efek blur transparan yang elegan */}
      <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 z-20 sticky top-0">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-xl hover:bg-accent focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open mobile menu"
          >
            <Menu size={24} />
          </button>

          {/* Logo muncul di Topbar hanya di mode Mobile */}
          <div className="md:hidden">
            <Logo />
          </div>

          {/* Judul Halaman (Desktop Only) */}
          <h1 className="hidden md:block font-heading text-xl font-bold text-foreground tracking-tight">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-4">
          <ConnectWallet />
        </div>
      </header>

      {/* === MOBILE MENU OVERLAY === */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop gelap dengan animasi fade-in */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Panel dengan animasi slide-in */}
          <div className="relative w-72 max-w-[80%] bg-sidebar h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border shrink-0">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 -mr-2 text-muted-foreground hover:text-foreground rounded-lg hover:bg-sidebar-accent transition-colors"
                aria-label="Close mobile menu"
              >
                <X size={20} />
              </button>
            </div>

            {/* Navigasi Mobile dengan Active State */}
            <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
              {MOBILE_MENU_ITEMS.map((item) => {
                // Logika agar route '/dashboard' tidak nyala terus saat berada di '/dashboard/forms'
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));

                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-sidebar-primary/10 text-sidebar-primary"
                        : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                    }`}
                  >
                    <Icon
                      size={18}
                      className={
                        isActive ? "text-sidebar-primary" : "text-inherit"
                      }
                    />
                    {item.name}
                  </Link>
                );
              })}
            </nav>

            {/* Tombol Create Form di bawah */}
            <div className="p-4 border-t border-sidebar-border shrink-0">
              <Link
                href="/dashboard/forms/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:scale-[0.98] active:scale-95 px-4 py-3.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-sidebar-primary/20"
              >
                <PlusCircle size={18} /> New Form
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
