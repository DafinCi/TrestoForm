import React from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Database,
  SearchCode,
  ArrowRight,
  Check,
} from "lucide-react";

export default function LandingPage() {
  return (
    <>
      {/* === HERO SECTION === */}
      {/* Menggunakan bg-primary agar dominan hijau sesuai permintaan, flat tanpa gradient */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-center bg-primary text-primary-foreground px-4 sm:px-6 pt-20 pb-12 overflow-hidden">
        {/* Dekorasi Flat Geometry (Tanpa Glow) */}
        <div className="absolute top-20 -left-20 w-64 h-64 bg-white/10 rounded-full" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 border-[40px] border-white/5 rounded-full" />

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          <div className="inline-block border border-primary-foreground/30 bg-primary-foreground/10 px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest mb-8">
            Verifiable Data Collection
          </div>

          <h1 className="font-heading text-5xl sm:text-7xl lg:text-8xl font-bold leading-[1.1] mb-6 tracking-tight">
            Build Forms.
            <br />
            Own the Data.
          </h1>

          <p className="text-lg sm:text-2xl font-medium max-w-3xl mb-10 opacity-90 leading-relaxed">
            The first fully decentralized form builder. Collect data with
            enterprise-grade privacy via Seal encryption, stored immutably on
            the Walrus Protocol.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/dashboard"
              className="w-full sm:w-auto bg-background text-foreground px-8 py-4 rounded-xl text-lg font-bold hover:bg-muted active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              Start Building Free <ArrowRight size={20} />
            </Link>
            <Link
              href="/docs"
              className="w-full sm:w-auto bg-primary text-primary-foreground border-2 border-primary-foreground/30 px-8 py-4 rounded-xl text-lg font-bold hover:bg-primary-foreground/10 active:scale-95 transition-all flex items-center justify-center"
            >
              Read the Docs
            </Link>
          </div>
        </div>
      </section>

      {/* === FEATURES SECTION === */}
      <section className="py-24 px-6 bg-background text-foreground border-b border-border">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-4">
              Infrastructure, not just a tool.
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We eliminated the middleman. Your data is stored directly on
              decentralized networks, ensuring absolute censorship resistance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-card border-2 border-border p-8 rounded-2xl">
              <div className="w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-xl mb-6">
                <ShieldCheck size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">Client-Side Encryption</h3>
              <p className="text-muted-foreground leading-relaxed">
                Sensitive fields are encrypted in the browser using the Seal
                protocol before transmission. Only you hold the decryption keys.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card border-2 border-border p-8 rounded-2xl">
              <div className="w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-xl mb-6">
                <Database size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">
                Walrus Protocol Storage
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Submissions and media files are sharded and stored as Walrus
                blobs. No central server means 100% uptime and no data
                harvesting.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card border-2 border-border p-8 rounded-2xl">
              <div className="w-14 h-14 bg-primary text-primary-foreground flex items-center justify-center rounded-xl mb-6">
                <SearchCode size={28} />
              </div>
              <h3 className="text-xl font-bold mb-3">On-Chain Verifiability</h3>
              <p className="text-muted-foreground leading-relaxed">
                Every form submission generates a cryptographic hash on the Sui
                blockchain, creating a verifiable and tamper-proof audit trail.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === HOW IT WORKS SECTION === */}
      <section className="py-24 px-6 bg-muted">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <h2 className="font-heading text-4xl font-bold mb-6 text-foreground">
                A workflow you already know.
              </h2>
              <ul className="space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">
                      Design your Schema
                    </h4>
                    <p className="text-muted-foreground mt-1">
                      Use our drag-and-drop builder to craft your questions and
                      mark fields as encrypted.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">
                      Deploy to the Network
                    </h4>
                    <p className="text-muted-foreground mt-1">
                      Generate a public link. Your form logic is immutable and
                      hosted entirely on-chain.
                    </p>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h4 className="text-lg font-bold text-foreground">
                      Analyze & Decrypt
                    </h4>
                    <p className="text-muted-foreground mt-1">
                      Connect your wallet to the dashboard to safely decrypt and
                      download your responses.
                    </p>
                  </div>
                </li>
              </ul>
            </div>

            {/* Flat Illustration Mockup */}
            <div className="flex-1 w-full">
              <div className="bg-background border-2 border-border p-6 rounded-3xl">
                <div className="border-b-2 border-border pb-4 mb-4 flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                  <div className="w-3 h-3 rounded-full bg-muted-foreground/30" />
                </div>
                <div className="space-y-4">
                  <div className="h-8 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-5/6" />
                  <div className="h-12 bg-primary/10 border border-primary/20 rounded-lg flex items-center px-4 gap-3 mt-6">
                    <Check size={18} className="text-primary" />
                    <span className="text-sm font-bold text-primary">
                      Fully Encrypted Block
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
