"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, LayoutDashboard, FileText, PlusCircle } from "lucide-react";
import Logo from "@/components/shared/logo";
import ConnectWallet from "@/components/wallet/connect-wallet";

export default function Topbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // Simple formatter buat judul halaman berdasarkan URL
  const getPageTitle = () => {
    if (pathname.includes("/forms/create")) return "Create Form";
    if (pathname.includes("/forms")) return "My Forms";
    if (pathname.includes("/settings")) return "Settings";
    return "Overview";
  };

  return (
    <>
      <header className="h-16 border-b border-border bg-background flex items-center justify-between px-4 md:px-6 shrink-0 z-20">
        <div className="flex items-center gap-3">
          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="md:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground rounded-md hover:bg-accent"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu size={24} />
          </button>

          {/* Judul Halaman (Desktop Only) */}
          <h1 className="hidden md:block font-heading text-lg font-semibold text-foreground">
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
          {/* Backdrop gelap */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-64 max-w-[80%] bg-sidebar h-full shadow-2xl flex flex-col animate-in slide-in-from-left-4 duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b border-sidebar-border shrink-0">
              <Logo />
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X size={20} />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
              <Link
                href="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-sidebar-accent text-sidebar-foreground"
              >
                <LayoutDashboard size={18} /> Overview
              </Link>
              <Link
                href="/dashboard/forms"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium hover:bg-sidebar-accent text-sidebar-foreground"
              >
                <FileText size={18} /> My Forms
              </Link>
            </nav>

            <div className="p-4 border-t border-sidebar-border shrink-0">
              <Link
                href="/dashboard/forms/create"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex items-center justify-center gap-2 w-full bg-sidebar-primary text-sidebar-primary-foreground px-4 py-3 rounded-lg text-sm font-semibold"
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
