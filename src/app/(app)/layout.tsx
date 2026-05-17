import React from "react";
import Sidebar from "@/components/dashboard/sidebar/sidebar";
import Topbar from "@/components/dashboard/topbar/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Kita cuma butuh bungkus pake <div>, BUKAN <html> atau <body>
    // h-screen bikin dia pas satu layar tanpa scrollbar ganda
    <div className="flex h-screen w-full bg-background font-sans overflow-hidden">
      {/* Sidebar Desktop Kiri */}
      <Sidebar />

      {/* Sisi Kanan (Topbar + Konten) */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header Atas */}
        <Topbar />

        {/* Area Konten Dinamis (Form Builder / Dashboard Utama) */}
        <main className="flex-1 overflow-hidden relative">{children}</main>
      </div>
    </div>
  );
}
