// =============================================================================
// src/app/forms/[slug]/page.tsx
// =============================================================================

import React from "react";
import PublicForm from "@/components/form-viewer/public-form";
import { ShieldCheck } from "lucide-react";
import { getFormSchema } from "@/services/form.service";
import { notFound } from "next/navigation";

export default async function PublicFormPage({
  params,
}: {
  params: { slug: string };
}) {
  // slug di URL adalah blobId dari Walrus
  const formId = params.slug;

  let formSchema;
  try {
    // Tarik data schema langsung dari jaringan Walrus!
    formSchema = await getFormSchema(formId);
  } catch (error) {
    console.error("[PublicFormPage] Failed to fetch form:", error);
    // Kalau form gak ketemu / blobId salah, lempar ke halaman 404 Next.js
    notFound();
  }

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-start pt-10 sm:pt-20 pb-24 px-4 sm:px-6 overflow-hidden font-sans">
      {/* Background Orbs (Glowing Effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-primary/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-emerald-500/15 rounded-full blur-[100px] pointer-events-none" />

      {/* Kontainer Form */}
      <div className="w-full max-w-3xl relative z-10">
        {/* Dekorasi Garis Atas (Glowing Top Border) */}
        <div className="h-4 w-full bg-gradient-to-r from-primary via-emerald-400 to-primary rounded-t-3xl shadow-[0_0_20px_rgba(20,184,166,0.3)]" />

        {/* Bingkai Kaca (Glassmorphism Frame) */}
        <div className="bg-card/80 backdrop-blur-xl border-x border-b border-border rounded-b-3xl shadow-2xl p-6 sm:p-12">
          {/* Header Form */}
          <div className="mb-8 border-b border-border/60 pb-8">
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-foreground mb-4 leading-tight">
              {formSchema.title}
            </h1>
            {formSchema.description && (
              <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                {formSchema.description}
              </p>
            )}
          </div>

          {/* Render Komponen Interaktif Client-Side */}
          {/* Kita passing formId agar nanti saat submit, sistem tahu data ini milik form mana */}
          <PublicForm fields={formSchema.fields} formId={formId} />
        </div>

        {/* Trust Badge / Security Note */}
        <div className="mt-10 flex flex-col items-center justify-center gap-2 text-muted-foreground opacity-60 hover:opacity-100 transition-opacity">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>Secured by TrestoForm Infrastructure</span>
          </div>
          <p className="text-[10px] text-center max-w-xs font-medium">
            End-to-end encrypted via Seal • Immutable storage on Walrus Protocol
          </p>
        </div>
      </div>
    </div>
  );
}
