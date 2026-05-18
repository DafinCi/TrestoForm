// =============================================================================
// src/app/(app)/dashboard/forms/[formId]/page.tsx
// Server Component - Dashboard Mini / Overview untuk Spesifik Form
// =============================================================================

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  ExternalLink,
  Settings,
  BarChart3,
  Users,
  Calendar,
  Layers,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";

// Services & Auth
import { verifySession } from "@/lib/auth/session";
import { getFormOverviewById } from "@/services/analytics.service";
import CopyLinkButton from "./copy-link-button"; // Client component untuk fitur copy (dibikin di bawah)

export default async function FormOverviewPage({
  params,
}: {
  params: { formId: string };
}) {
  const formId = params.formId;

  // 1. Verifikasi Web3 Session
  const session = await verifySession();
  if (!session?.address) {
    redirect("/");
  }

  // 2. Tarik data overview spesifik form ini
  let overview;
  try {
    overview = await getFormOverviewById(formId, session.address);
  } catch (error) {
    console.error("[FormOverview] Error fetching form:", error);
    // Kalau gagal ambil dari Walrus/DB, tampilkan state error fallback
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center p-6">
        <ShieldAlert size={48} className="text-destructive/50 mb-4" />
        <h2 className="text-xl font-bold mb-2">Form Data Unavailable</h2>
        <p className="text-muted-foreground text-sm max-w-sm mb-6">
          We couldn't retrieve the details for this form. It might be
          permanently deleted or the Walrus network is currently syncing.
        </p>
        <Link
          href="/dashboard/forms"
          className="text-primary hover:underline font-medium"
        >
          ← Back to My Forms
        </Link>
      </div>
    );
  }

  // URL publik menggunakan slug (sesuai struktur /forms/[slug]/page.tsx)
  // NEXT_PUBLIC_SITE_URL bisa didefinisikan di env, fallback ke localhost
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const publicLink = `${baseUrl}/forms/${formId}`;

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-8">
      {/* === HEADER & BREADCRUMBS === */}
      <div>
        <Link
          href="/dashboard/forms"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft size={16} /> Back to My Forms
        </Link>
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="font-heading text-3xl font-bold text-foreground">
                {overview.title}
              </h1>
              <span
                className={`text-[10px] uppercase tracking-wider font-bold px-2 py-1 rounded-md ${
                  overview.status === "Active"
                    ? "bg-emerald-500/10 text-emerald-600"
                    : overview.status === "Encrypted"
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                }`}
              >
                {overview.status}
              </span>
            </div>
            <p className="text-muted-foreground text-sm md:text-base max-w-2xl line-clamp-2">
              {overview.description}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href={`/forms/${formId}`}
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg font-semibold text-sm hover:bg-secondary/80 transition-colors"
            >
              <ExternalLink size={16} /> Preview
            </Link>
            <CopyLinkButton link={publicLink} />
          </div>
        </div>
      </div>

      {/* === MINI STATS HIGHLIGHT === */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="text-primary bg-primary/10 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
            <Users size={16} />
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Total Responses
          </p>
          <h3 className="font-heading text-xl font-bold mt-1">
            {overview.stats.totalResponses}
          </h3>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="text-emerald-500 bg-emerald-500/10 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
            <Calendar size={16} />
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Created On
          </p>
          <h3 className="font-heading text-sm font-bold mt-2">
            {overview.createdAt}
          </h3>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="text-amber-500 bg-amber-500/10 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
            <Layers size={16} />
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Total Fields
          </p>
          <h3 className="font-heading text-xl font-bold mt-1">
            {overview.stats.fieldsCount}
          </h3>
        </div>
        <div className="bg-card border border-border p-5 rounded-2xl">
          <div className="text-blue-500 bg-blue-500/10 w-8 h-8 rounded-lg flex items-center justify-center mb-3">
            <BarChart3 size={16} />
          </div>
          <p className="text-xs font-medium text-muted-foreground">
            Last Activity
          </p>
          <h3 className="font-heading text-sm font-bold mt-2">
            {overview.stats.lastResponseDate}
          </h3>
        </div>
      </div>

      {/* === NAVIGATION ENTRY POINTS === */}
      <h3 className="font-heading text-xl font-bold pt-4">Form Management</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Submissions */}
        <Link
          href={`/dashboard/forms/${formId}/submissions`}
          className="group relative bg-card border border-border p-6 rounded-2xl hover:border-primary/50 hover:shadow-md transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Users size={80} />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-2 group-hover:text-primary transition-colors">
              View Submissions
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              Browse, filter, and decrypt responses securely submitted to this
              form.
            </p>
            <span className="text-xs font-bold text-primary uppercase tracking-wider flex items-center gap-1">
              Open Vault <ArrowLeft className="rotate-135" size={12} />
            </span>
          </div>
        </Link>

        {/* Card 2: Analytics */}
        <Link
          href={`/dashboard/forms/${formId}/analytics`}
          className="group relative bg-card border border-border p-6 rounded-2xl hover:border-emerald-500/50 hover:shadow-md transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <BarChart3 size={80} className="text-emerald-500" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-2 group-hover:text-emerald-500 transition-colors">
              Insights & Analytics
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              View response trends, metrics, and data visualizations.
            </p>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider flex items-center gap-1">
              View Stats <ArrowLeft className="rotate-135" size={12} />
            </span>
          </div>
        </Link>

        {/* Card 3: Settings */}
        <Link
          href={`/dashboard/forms/${formId}/settings`}
          className="group relative bg-card border border-border p-6 rounded-2xl hover:border-amber-500/50 hover:shadow-md transition-all overflow-hidden"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Settings size={80} className="text-amber-500" />
          </div>
          <div className="relative z-10">
            <h4 className="font-bold text-lg mb-2 group-hover:text-amber-500 transition-colors">
              Form Settings
            </h4>
            <p className="text-sm text-muted-foreground mb-6">
              Manage privacy level, pause submissions, or archive this form
              permanently.
            </p>
            <span className="text-xs font-bold text-amber-500 uppercase tracking-wider flex items-center gap-1">
              Configure <ArrowLeft className="rotate-135" size={12} />
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}
