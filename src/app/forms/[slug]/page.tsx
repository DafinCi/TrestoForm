import React from "react";
import PublicForm from "@/components/form-viewer/public-form";
import { ShieldCheck } from "lucide-react";

export default function PublicFormPage({
  params,
}: {
  params: { slug: string };
}) {
  // Simulasi data form yang ditarik dari backend/blockchain berdasarkan params.id
  const mockForm = {
    slug: params.slug,
    title: "Web3 Developer Survey 2026",
    description:
      "Your responses are encrypted via Seal and stored immutably on the Walrus Protocol. We value your privacy and data ownership.",
    fields: [
      {
        id: "f1",
        type: "text" as const,
        label: "Wallet Address or ENS",
        required: true,
        placeholder: "0x... or vitalik.eth",
      },
      {
        id: "f2",
        type: "textarea" as const,
        label: "What is the biggest challenge in Web3 right now?",
        required: true,
        placeholder: "Gas fees, UX, wallet management...",
      },
      {
        id: "f3",
        type: "file" as const,
        label: "Upload Diagnostic Logs (Optional)",
        required: false,
        description:
          "File will be sharded and stored on Walrus decentralized storage.",
      },
    ],
  };

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
              {mockForm.title}
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              {mockForm.description}
            </p>
          </div>

          {/* Render Komponen Interaktif */}
          <PublicForm fields={mockForm.fields} formId={mockForm.id} />
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
