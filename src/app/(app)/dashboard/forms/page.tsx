// =============================================================================
// src/app/(app)/dashboard/forms/page.tsx
// Server Component - Forms List Page (Data Fetching Layer)
// =============================================================================

import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";

// Services & Auth
import { verifySession } from "@/lib/auth/session";
import { getUserForms } from "@/services/analytics.service";
import FormListClient from "./form-list-section";

export default async function MyFormsPage() {
  // 1. Verifikasi Web3 Session
  const session = await verifySession();

  if (!session?.address) {
    redirect("/");
  }

  // 2. Ambil data list form real dari backend
  const forms = await getUserForms(session.address);

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto h-full flex flex-col">
      {/* === HEADER & ACTIONS === */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
        <div>
          <h1 className="font-heading text-3xl md:text-4xl font-bold text-foreground mb-2">
            My Forms
          </h1>
          <p className="text-muted-foreground text-sm md:text-base">
            Manage your decentralized forms and analyze responses.
          </p>
        </div>

        <Link
          href="/dashboard/forms/create"
          className="flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-all active:scale-95 shrink-0"
        >
          <Plus size={20} />
          Create Form
        </Link>
      </div>

      {/* === DELEGATE TO CLIENT COMPONENT === */}
      {/* Client component menangani State (Search & Filter) */}
      <FormListClient initialForms={forms} />
    </div>
  );
}
