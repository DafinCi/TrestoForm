"use client";

import React from "react";
import Link from "next/link";
import {
  Plus,
  FileText,
  Users,
  Activity,
  ArrowUpRight,
  MoreVertical,
  ShieldCheck,
  Database,
} from "lucide-react";

// Mock data untuk tampilan awal
const STATS = [
  {
    label: "Total Forms",
    value: "12",
    icon: FileText,
    color: "text-blue-500",
    bg: "bg-blue-500/10",
  },
  {
    label: "Total Submissions",
    value: "1,284",
    icon: Users,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    label: "Active Blobs",
    value: "48",
    icon: Database,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
  },
  {
    label: "Security Level",
    value: "Encrypted",
    icon: ShieldCheck,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
  },
];

const RECENT_FORMS = [
  {
    id: "1",
    title: "Customer Feedback Q3",
    status: "Active",
    responses: 142,
    lastModified: "2 hours ago",
  },
  {
    id: "2",
    title: "Bug Report - Beta v1.0",
    status: "Encrypted",
    responses: 24,
    lastModified: "5 hours ago",
  },
  {
    id: "3",
    title: "Internal Survey",
    status: "Draft",
    responses: 0,
    lastModified: "Yesterday",
  },
];

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* === WELCOME SECTION === */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-3xl font-bold text-foreground">
            Welcome back, Builder!
          </h2>
          <p className="text-muted-foreground mt-1">
            Here's what's happening with your decentralized forms today.
          </p>
        </div>
        <Link
          href="/dashboard/forms/create"
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95"
        >
          <Plus size={20} />
          Create New Form
        </Link>
      </div>

      {/* === STATS GRID === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <div
            key={stat.label}
            className="bg-card border border-border p-6 rounded-2xl hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-xs font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full flex items-center gap-1">
                <Activity size={12} /> +12%
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </p>
              <h3 className="font-heading text-2xl font-bold mt-1">
                {stat.value}
              </h3>
            </div>
          </div>
        ))}
      </div>

      {/* === MAIN CONTENT: RECENT FORMS === */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Forms Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-xl font-bold">Recent Forms</h3>
            <Link
              href="/dashboard/forms"
              className="text-primary text-sm font-semibold hover:underline flex items-center gap-1"
            >
              View all <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Form Title
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground text-center">
                      Responses
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold text-muted-foreground">
                      Modified
                    </th>
                    <th className="px-6 py-4 text-sm font-semibold"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {RECENT_FORMS.map((form) => (
                    <tr
                      key={form.id}
                      className="hover:bg-muted/20 transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <span className="font-medium text-foreground group-hover:text-primary transition-colors cursor-pointer">
                          {form.title}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                            form.status === "Active"
                              ? "bg-emerald-500/10 text-emerald-600"
                              : form.status === "Encrypted"
                                ? "bg-primary/10 text-primary"
                                : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {form.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center text-sm text-muted-foreground">
                        {form.responses}
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">
                        {form.lastModified}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-muted rounded-full text-muted-foreground">
                          <MoreVertical size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Sidebar: Walrus/Sui Status Card */}
        <div className="space-y-4">
          <h3 className="font-heading text-xl font-bold">Network Status</h3>
          <div className="bg-primary p-6 rounded-2xl text-primary-foreground relative overflow-hidden group">
            {/* Dekorasi Abstract */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />

            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest opacity-80">
                  Walrus Protocol
                </span>
              </div>
              <div>
                <p className="text-sm opacity-90">Connected Node</p>
                <p className="font-mono text-xs mt-1 truncate bg-black/20 p-2 rounded">
                  0x738...2948ff201wal
                </p>
              </div>
              <div className="pt-2">
                <div className="flex justify-between text-xs mb-1 font-bold">
                  <span>Storage Used</span>
                  <span>42%</span>
                </div>
                <div className="w-full bg-black/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-white h-full w-[42%]" />
                </div>
              </div>
              <button className="w-full bg-white text-primary py-2 rounded-lg text-sm font-bold hover:bg-opacity-90 transition-colors">
                Manage Storage
              </button>
            </div>
          </div>

          <div className="bg-card border border-border p-6 rounded-2xl">
            <h4 className="font-bold text-sm mb-3">Quick Tips</h4>
            <ul className="text-xs text-muted-foreground space-y-3">
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Use "Encrypted" mode for sensitive bug reports.
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">•</span>
                Walrus Blobs are permanent, double-check your schema.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
