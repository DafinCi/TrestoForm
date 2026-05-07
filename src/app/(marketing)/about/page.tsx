import React from "react";
import Link from "next/link";
import { ArrowLeft, ServerOff, KeyRound, Globe } from "lucide-react";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background font-sans pt-24 pb-16 px-6">
      <div className="max-w-3xl mx-auto">
        {/* Navigation / Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium text-sm mb-12 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Header Section */}
        <div className="mb-16">
          <h1 className="font-heading text-4xl sm:text-6xl font-bold text-foreground mb-6 tracking-tight">
            The Manifesto for Decentralized Data.
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground leading-relaxed">
            For too long, we've surrendered our data to centralized tech giants
            just to build simple forms. It's time to take control back.
          </p>
        </div>

        {/* Content Body */}
        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              The Problem with Web2 Forms
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Every time you use a traditional form builder, you are effectively
              handing over the responses to a third-party server. They index it,
              they analyze it, and in the worst cases, they suffer data breaches
              that leak your users' sensitive information. We realized that the
              current infrastructure is broken by design.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-foreground mb-6">
              Our Solution: TrestoForm
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-card border-2 border-border p-6 rounded-2xl">
                <ServerOff size={32} className="text-primary mb-4" />
                <h3 className="font-bold mb-2">No Central Servers</h3>
                <p className="text-sm text-muted-foreground">
                  Responses bypass traditional backends and go straight to
                  decentralized storage.
                </p>
              </div>

              <div className="bg-card border-2 border-border p-6 rounded-2xl">
                <KeyRound size={32} className="text-primary mb-4" />
                <h3 className="font-bold mb-2">Seal Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Data is encrypted on the client side. Only you hold the
                  private keys to decrypt it.
                </p>
              </div>

              <div className="bg-card border-2 border-border p-6 rounded-2xl">
                <Globe size={32} className="text-primary mb-4" />
                <h3 className="font-bold mb-2">Verifiable Truth</h3>
                <p className="text-sm text-muted-foreground">
                  Every submission creates an immutable footprint on the Sui
                  blockchain network.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
