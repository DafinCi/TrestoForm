"use client";

import dynamic from "next/dynamic";
import SidebarMobile from "@/components/dashboard/sidebar/sidebar-mobile";
import Logo from "@/components/shared/logo";
import PageTitle from "./page-title";

// Lazy load wallet untuk mencegah hydration mismatch dan mempercepat initial load
const ConnectWallet = dynamic(
  () => import("@/components/wallet/connect-wallet"),
  {
    ssr: false,
    loading: () => (
      <div className="w-[140px] h-10 bg-muted/50 animate-pulse rounded-xl" />
    ),
  },
);

export default function TopbarHeader() {
  return (
    <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md flex items-center justify-between px-4 md:px-6 shrink-0 z-20 sticky top-0 transition-all duration-200">
      <div className="flex items-center gap-3">
        {/* Tombol Hamburger & Drawer dihandle langsung oleh SidebarMobile */}
        <SidebarMobile />

        {/* Logo hanya muncul di Topbar saat layar Mobile */}
        <div className="md:hidden">
          <Logo />
        </div>

        {/* Dynamic Judul Halaman */}
        <PageTitle />
      </div>

      <div className="flex items-center gap-4">
        <ConnectWallet />
      </div>
    </header>
  );
}
