// =============================================================================
// src/app/(app)/dashboard/forms/[formId]/copy-link-button.tsx
// Client Component - Copy Button with Sonner Toast Integration
// =============================================================================

"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { toast } from "sonner";

export default function CopyLinkButton({ link }: { link: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);

      // Menggunakan sonner toast untuk sukses
      toast.success("Public link copied to clipboard!", {
        description: "Respondents can now access your decentralized form.",
      });

      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);

      // Fallback toast jika ada error/permission issues pada clipboard browser
      toast.error("Failed to copy link", {
        description: "Please try copying the URL manually.",
      });
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg font-semibold text-sm hover:opacity-90 transition-all active:scale-95"
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? "Copied!" : "Copy Link"}
    </button>
  );
}
