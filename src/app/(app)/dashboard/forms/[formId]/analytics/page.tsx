import React from "react";
import StatsOverview from "@/components/dashboard/stats-overview";
import SubmissionsTable from "../../../analytics/submission-table";
import {
  BarChart3,
  ArrowLeft,
  Users,
  MousePointer2,
  Clock,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function AnalyticsPage({
  params,
}: {
  params: { formId: string };
}) {
  const formId = params.formId;

  // Data statistik spesifik untuk form ini yang akan di-passing ke komponen reusable lu
  const analyticsData = [
    {
      label: "Total Submissions",
      value: "128",
      icon: Users,
      color: "text-blue-600",
    },
    {
      label: "Completion Rate",
      value: "84%",
      icon: MousePointer2,
      color: "text-emerald-600",
    },
    {
      label: "Avg. Time to Fill",
      value: "2m 14s",
      icon: Clock,
      color: "text-amber-600",
    },
    {
      label: "Encrypted Records",
      value: "100%",
      icon: ShieldCheck,
      color: "text-primary",
    },
  ];

  return (
    <div className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <Link
            href="/dashboard/forms"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-4"
          >
            <ArrowLeft size={16} /> Back to My Forms
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 text-primary rounded-2xl">
              <BarChart3 size={28} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Form Analytics
              </h1>
              <p className="text-muted-foreground">
                Monitoring response data for{" "}
                <span className="text-foreground font-semibold">
                  Form ID: {formId}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Filter / Toggle Data */}
        <div className="flex items-center gap-3 bg-muted/50 p-1.5 rounded-2xl border border-border">
          <button className="px-4 py-2 bg-card text-foreground rounded-xl shadow-sm text-sm font-bold border border-border">
            Real-time
          </button>
          <button className="px-4 py-2 text-muted-foreground text-sm font-bold hover:text-foreground transition-colors">
            Last 30 Days
          </button>
        </div>
      </div>

      {/* Memanggil Reusable Component StatsOverview milik lu */}
      <StatsOverview stats={analyticsData} />

      {/* Memanggil Tabel Submisi (Pastikan file submissions-table.tsx sudah dibuat) */}
      <SubmissionsTable />

      {/* Indikator Status Koneksi */}
      <div className="mt-8 flex items-center justify-center gap-2 text-muted-foreground opacity-50">
        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
        <p className="text-xs font-medium uppercase tracking-widest">
          Connected to Walrus Protocol Mainnet
        </p>
      </div>
    </div>
  );
}
