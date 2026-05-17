import React from "react";
import Link from "next/link";
import {
  CheckCircle2,
  ShieldCheck,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";

export default function SuccessPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { submissionId?: string };
}) {
  const submissionId = searchParams.submissionId;

  return (
    <div className="min-h-screen bg-background relative flex flex-col items-center justify-center p-4 overflow-hidden font-sans">
      {/* Background Orbs (Glowing Effect) */}
      <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-emerald-500/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50vw] h-[50vw] max-w-[600px] max-h-[600px] bg-primary/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg relative z-10 animate-in zoom-in-95 duration-500">
        <div className="bg-card/80 backdrop-blur-xl border border-border rounded-3xl shadow-2xl p-8 sm:p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
            <CheckCircle2 size={48} className="text-emerald-500" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-foreground mb-3">
            Submission Secured
          </h1>
          <p className="text-muted-foreground mb-8 text-sm sm:text-base">
            Your response has been encrypted and permanently written to the
            Walrus decentralized network.
          </p>

          {submissionId && (
            <div className="bg-muted/50 p-4 rounded-xl border border-border mb-8 text-left">
              <p className="text-[11px] text-muted-foreground uppercase tracking-widest mb-1.5 font-semibold">
                Walrus Blob ID (Receipt)
              </p>
              <div className="flex items-center justify-between gap-2">
                <code className="font-mono text-sm text-primary truncate">
                  {submissionId}
                </code>
                {/* Kalau Walrus punya explorer, lu bisa ganti href ini nanti */}
                <a
                  href={`https://walrus-testnet.explorer.space/blob/${submissionId}`}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 hover:bg-primary/10 rounded-md transition-colors text-primary"
                  title="View on Walrus Explorer"
                >
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/forms/${params.slug}`}
              className="flex items-center justify-center gap-2 px-6 py-3 border border-border hover:bg-muted/50 rounded-xl font-medium transition-colors text-sm"
            >
              <ArrowLeft size={16} /> Submit Another
            </Link>
            <Link
              href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground hover:opacity-90 rounded-xl font-medium transition-opacity text-sm shadow-lg shadow-primary/20"
            >
              Create Your Own Form
            </Link>
          </div>
        </div>

        {/* Trust Badge */}
        <div className="mt-8 flex justify-center text-muted-foreground opacity-60">
          <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest">
            <ShieldCheck size={16} className="text-emerald-500" />
            <span>TrestoForm Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
}
