import React from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Terminal } from "lucide-react";

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-background font-sans pt-24 pb-16 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Navigation / Back Button */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground font-medium text-sm mb-8 transition-colors"
        >
          <ArrowLeft size={16} /> Back to Home
        </Link>

        {/* Page Header */}
        <div className="border-b-2 border-border pb-8 mb-12 flex items-center gap-4">
          <div className="p-4 bg-primary text-primary-foreground rounded-2xl">
            <BookOpen size={32} />
          </div>
          <div>
            <h1 className="font-heading text-3xl sm:text-5xl font-bold text-foreground">
              Documentation
            </h1>
            <p className="text-muted-foreground mt-2">
              Everything you need to build on TrestoForm.
            </p>
          </div>
        </div>

        {/* Documentation Content */}
        <div className="prose prose-invert prose-emerald max-w-none space-y-12">
          {/* Section 1 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">#</span> Getting Started
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              TrestoForm requires a Web3 wallet (like Sui Wallet) to manage your
              cryptographic keys and interact with the decentralized network. To
              create your first form:
            </p>
            <ol className="list-decimal list-inside text-muted-foreground space-y-2 bg-card border-2 border-border p-6 rounded-2xl">
              <li>
                Navigate to the Dashboard and click <strong>Create Form</strong>
                .
              </li>
              <li>Use the drag-and-drop builder to define your schema.</li>
              <li>
                Toggle the <strong>Encrypt Field</strong> option for sensitive
                data (e.g., emails, phone numbers).
              </li>
              <li>
                Click <strong>Deploy to Walrus</strong> to generate your public
                link.
              </li>
            </ol>
          </section>

          {/* Section 2 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">#</span> How Encryption Works
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              We utilize the <strong>Seal Protocol</strong> for end-to-end
              encryption. When a respondent submits a form, the browser executes
              the encryption algorithm locally before the payload ever touches
              the network.
            </p>
            <div className="bg-muted p-4 rounded-xl font-mono text-sm text-foreground border border-border/50">
              <p className="text-muted-foreground mb-2">// Flow of data</p>
              <p>1. User Input -{">"} Browser Memory</p>
              <p>2. Browser -{">"} Encrypts payload with Form's Public Key</p>
              <p>3. Encrypted Payload -{">"} Uploaded to Walrus Storage</p>
              <p>
                4. Form Owner -{">"} Decrypts locally using Wallet's Private Key
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <span className="text-primary">#</span> Walrus Storage & Sui
              Network
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Instead of an AWS database, responses are sharded and stored as
              blobs on the <strong>Walrus Protocol</strong>. To ensure data
              hasn't been tampered with, a cryptographic hash of the submission
              is recorded permanently on the <strong>Sui Network</strong>. This
              creates a verifiable audit trail that is publicly accessible but
              unreadable without the decryption key.
            </p>
            <div className="flex items-center gap-3 bg-card border-l-4 border-primary p-4 mt-4">
              <Terminal size={20} className="text-primary shrink-0" />
              <p className="text-sm font-medium text-foreground">
                Note: Because data on Walrus is immutable, you cannot "delete" a
                response in the traditional sense. You can only ignore it in
                your analytics dashboard.
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
